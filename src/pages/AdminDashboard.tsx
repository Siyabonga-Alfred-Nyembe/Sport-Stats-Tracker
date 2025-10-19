import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import { type DbChatRecord } from "../services/chatService";
import { deleteUserCompletely } from "../services/adminService";
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

  useEffect(() => {
    // No need for checkAdminStatus - ProtectedRoute already handles this
    fetchData();
  }, []);

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

      // Fetch from 'users' table (primary source)
      const { data: usersData } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersData) setUsers(usersData as unknown as User[]);

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
      </section>
    </section>
  );
};

export default AdminDashboard;