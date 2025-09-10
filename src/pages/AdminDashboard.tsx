import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabaseClient";
import "../Styles/admin-dashboard.css";

interface Coach {
  id: string;
  email: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  team_name?: string;
  experience?: string;
}

interface User {
  id: string;
  email: string;
  role: "admin" | "coach" | "fan";
  created_at: string;
  last_sign_in?: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("coaches");
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    pendingCoaches: 0,
    activeUsers: 0
  });

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
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      navigate('/');
      return;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: coachesData } = await supabase
        .from('coaches')
        .select('*')
        .order('created_at', { ascending: false });

      if (coachesData) setCoaches(coachesData);

      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersData) setUsers(usersData);

      setStats({
        totalUsers: usersData?.length || 0,
        totalCoaches: coachesData?.length || 0,
        pendingCoaches: coachesData?.filter(c => c.status === 'pending').length || 0,
        activeUsers: usersData?.filter(u => u.last_sign_in > new Date(Date.now() - 30*24*60*60*1000).toISOString()).length || 0
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveCoach = async (coachId: string) => {
    try {
      const { error } = await supabase
        .from('coaches')
        .update({ status: 'approved' })
        .eq('id', coachId);

      if (!error) {
        setCoaches(coaches.map(coach => 
          coach.id === coachId ? { ...coach, status: 'approved' } : coach
        ));
        setStats({...stats, pendingCoaches: stats.pendingCoaches - 1});
      }
    } catch (error) {
      console.error('Error approving coach:', error);
    }
  };

  const rejectCoach = async (coachId: string) => {
    try {
      const { error } = await supabase
        .from('coaches')
        .update({ status: 'rejected' })
        .eq('id', coachId);

      if (!error) {
        setCoaches(coaches.map(coach => 
          coach.id === coachId ? { ...coach, status: 'rejected' } : coach
        ));
        setStats({...stats, pendingCoaches: stats.pendingCoaches - 1});
      }
    } catch (error) {
      console.error('Error rejecting coach:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (!error) {
        setUsers(users.filter(user => user.id !== userId));
        setStats({...stats, totalUsers: stats.totalUsers - 1});
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
        <button className="back-btn" onClick={() => navigate('/')}>
          Back to Site
        </button>
      </header>

      <section className="admin-stats">
        <section className="admin-stat-card">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </section>
        <section className="admin-stat-card">
          <h3>{stats.totalCoaches}</h3>
          <p>Total Coaches</p>
        </section>
        <section className="admin-stat-card warning">
          <h3>{stats.pendingCoaches}</h3>
          <p>Pending Approvals</p>
        </section>
        <section className="admin-stat-card">
          <h3>{stats.activeUsers}</h3>
          <p>Active Users (30d)</p>
        </section>
      </section>

      <nav className="admin-nav">
        <button 
          className={activeTab === 'coaches' ? 'active' : ''}
          onClick={() => setActiveTab('coaches')}
        >
          Coach Applications
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          User Management
        </button>
        <button 
          className={activeTab === 'reports' ? 'active' : ''}
          onClick={() => setActiveTab('reports')}
        >
          Reports
        </button>
      </nav>

      <section className="admin-content">
        {activeTab === 'coaches' && (
          <section className="coaches-tab">
            <h2>Coach Applications</h2>
            {coaches.length === 0 ? (
              <p>No coach applications found.</p>
            ) : (
              <section className="coaches-list">
                {coaches.map(coach => (
                  <section key={coach.id} className="coach-card">
                    <section className="coach-info">
                      <h3>{coach.name || 'Unnamed Coach'}</h3>
                      <p>Email: {coach.email}</p>
                      {coach.team_name && <p>Team: {coach.team_name}</p>}
                      {coach.experience && <p>Experience: {coach.experience}</p>}
                      <p>Applied: {new Date(coach.created_at).toLocaleDateString()}</p>
                      <span className={`status-badge ${coach.status}`}>
                        {coach.status}
                      </span>
                    </section>
                    <section className="coach-actions">
                      {coach.status === 'pending' && (
                        <>
                          <button 
                            className="approve-btn"
                            onClick={() => approveCoach(coach.id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="reject-btn"
                            onClick={() => rejectCoach(coach.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {coach.status !== 'pending' && (
                        <span>Action taken</span>
                      )}
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
                    <th>Last Sign In</th>
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
                        {user.last_sign_in 
                          ? new Date(user.last_sign_in).toLocaleDateString()
                          : 'Never'
                        }
                      </td>
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

        {activeTab === 'reports' && (
          <section className="reports-tab">
            <h2>System Reports</h2>
            <section className="report-cards">
              <section className="report-card">
                <h3>User Growth</h3>
                <p>Monthly user registration statistics</p>
                <button className="view-report-btn">View Report</button>
              </section>
              <section className="report-card">
                <h3>Coach Applications</h3>
                <p>Application trends and approval rates</p>
                <button className="view-report-btn">View Report</button>
              </section>
              <section className="report-card">
                <h3>System Usage</h3>
                <p>Feature usage and engagement metrics</p>
                <button className="view-report-btn">View Report</button>
              </section>
            </section>
          </section>
        )}
      </section>
    </section>
  );
};

export default AdminDashboard;
