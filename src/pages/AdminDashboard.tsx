import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { type DbChatRecord } from "../services/chatService";
import { deleteUserCompletely } from "../services/adminService";
import { getAdminWhitelist, addAdminToWhitelist, removeAdminFromWhitelist } from "../services/roleService";
import "../Styles/admin-dashboard.css";

interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
  last_sign_in?: string;
  last_sign_in_at?: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("chats");
  const [chats, setChats] = useState<DbChatRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalChats: 0,
    activeUsers: 0
  });
  const [adminWhitelist, setAdminWhitelist] = useState<Array<{email: string, added_by: string, created_at: string, is_active: boolean}>>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");

  useEffect(() => {
    checkAdminStatus();
    fetchData();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      navigate('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'Admin') {
      navigate('/');
      console.log('Not an admin');
      return;
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('Error during logout:', e);
    } finally {
      // Force navigation to landing page regardless
      if (typeof window !== 'undefined') {
        window.location.assign('/');
      } else {
        navigate('/');
      }
      setLoggingOut(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chatsData } = await supabase
        .from('chats')
        .select('*')
        .order('inserted_at', { ascending: false });

      if (chatsData) setChats(chatsData as unknown as DbChatRecord[]);

      // Try fetching from 'users' first (primary source)
      let usersData: any[] | null = null;
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });
        usersData = data ?? null;
      } catch (e) {
        usersData = null;
      }

      // Fallback to 'profiles' if 'users' returns empty/null
      if (!usersData || usersData.length === 0) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        usersData = data ?? [];
      }

      if (usersData) setUsers(usersData as unknown as User[]);

      // Fetch admin whitelist
      const whitelist = await getAdminWhitelist();
      setAdminWhitelist(whitelist);

      setStats({
        totalUsers: usersData?.length || 0,
        totalChats: chatsData?.length || 0,
        activeUsers: usersData?.filter((u: any) => {
          const last = (u.last_sign_in || u.last_sign_in_at || '').toString();
          if (!last) return false;
          return last > new Date(Date.now() - 30*24*60*60*1000).toISOString();
        }).length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    const success = await addAdminToWhitelist(newAdminEmail.trim(), session.user.email || '');
    if (success) {
      setNewAdminEmail("");
      fetchData(); // Refresh the list
    } else {
      alert('Failed to add admin. Please try again.');
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to remove ${email} from the admin whitelist?`)) return;
    
    const success = await removeAdminFromWhitelist(email);
    if (success) {
      fetchData(); // Refresh the list
    } else {
      alert('Failed to remove admin. Please try again.');
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!window.confirm('Are you sure you want to remove this chat?')) return;
    try {
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (!error) {
        setChats(chats.filter(c => c.id !== chatId));
        setStats({ ...stats, totalChats: stats.totalChats - 1 });
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user and all related data?')) return;
    try {
      const ok = await deleteUserCompletely(userId);
      if (ok) {
        setUsers(users.filter(user => user.id !== userId));
        setStats({ ...stats, totalUsers: Math.max(0, stats.totalUsers - 1) });
        // Also remove their chats from the list if any
        setChats(chats.filter(c => c.user_id !== userId));
        setStats((s) => ({ ...s, totalChats: chats.filter(c => c.user_id !== userId).length }));
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <section className="admin-loading">Loading...</section>;
  }

  return (
    <section className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout} disabled={loggingOut}>
          {loggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </header>

      <section className="admin-stats">
        <section className="admin-stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </section>
        <section className="admin-stat-card">
          <h3>{stats.totalChats}</h3>
          <p>Total Chats</p>
        </section>
      </section>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'chats' ? 'active' : ''}
          onClick={() => setActiveTab('chats')}
        >
          Chats
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'admins' ? 'active' : ''}
          onClick={() => setActiveTab('admins')}
        >
          Admin Management
        </button>
      </nav>

      <section className="admin-content">
        {activeTab === 'chats' && (
          <section className="chats-tab">
            <h2>Chats</h2>
            {chats.length === 0 ? (
              <p>No chats found.</p>
            ) : (
              <section className="chats-list">
                {chats.map(chat => (
                  <section key={chat.id} className="chat-card">
                    <section className="chat-card-header">
                      <span className="chat-author">
                        {chat.author || 'Anonymous'}
                      </span>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteChat(chat.id)}
                      >
                        Remove
                      </button>
                    </section>
                    <section className="chat-message">
                      {chat.message}
                    </section>
                  </section>
                ))}
              </section>
            )}
          </section>
        )}

        {activeTab === 'users' && (
          <section className="users-tab">
            <h2>User Management</h2>
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="delete-btn"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {activeTab === 'admins' && (
          <section className="admins-tab">
            <h2>Admin Management</h2>
            
            <section className="add-admin-section">
              <h3>Add New Admin</h3>
              <section className="add-admin-form">
                <input
                  type="email"
                  placeholder="Enter admin email address"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  className="admin-email-input"
                />
                <button 
                  onClick={handleAddAdmin}
                  className="add-admin-btn"
                  disabled={!newAdminEmail.trim()}
                >
                  Add Admin
                </button>
              </section>
            </section>

            <section className="admin-whitelist-section">
              <h3>Admin Whitelist</h3>
              {adminWhitelist.length === 0 ? (
                <p>No admins in whitelist.</p>
              ) : (
                <table className="admin-whitelist-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Added By</th>
                      <th>Added Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminWhitelist.map((admin, index) => (
                      <tr key={index}>
                        <td>{admin.email}</td>
                        <td>{admin.added_by}</td>
                        <td>{new Date(admin.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${admin.is_active ? 'active' : 'inactive'}`}>
                            {admin.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          {admin.is_active && (
                            <button 
                              className="remove-admin-btn"
                              onClick={() => handleRemoveAdmin(admin.email)}
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          </section>
        )}
        
      </section>
    </section>
  );
};

export default AdminDashboard;