import React, { useState } from 'react';
import './RoleSelection.css';

interface RoleSelectionProps {
  userEmail: string;
  onRoleSelected: (role: 'Fan' | 'Coach' | 'Admin') => void;
  includeAdminOption?: boolean;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ 
  userEmail, 
  onRoleSelected,
  includeAdminOption = false
}) => {
  const [selectedRole, setSelectedRole] = useState<'Fan' | 'Coach' | 'Admin' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (role: 'Fan' | 'Coach' | 'Admin') => {
    setSelectedRole(role);
    setIsLoading(true);
    setError(null);

    try {
      // Call the parent's role selection handler instead of doing navigation here
      onRoleSelected(role);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <section className="role-selection">
      <section className="role-selection-container">
        <section className="role-selection-header">
          <h1>Welcome to Sport Stats Tracker!</h1>
          <p>Hi {userEmail}, please select your role to get started:</p>
        </section>

        <section className="role-options">
          <section 
            className={`role-option ${selectedRole === 'Fan' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Fan')}
          >
            <section className="role-icon">👥</section>
            <h3>Fan</h3>
            <p>Track your favorite teams, view match statistics, and stay updated with the latest football news.</p>
            <ul>
              <li>View team and player statistics</li>
              <li>Track match results and live scores</li>
              <li>Save favorite teams and players</li>
              <li>Access comprehensive football analytics</li>
            </ul>
          </section>

          <section 
            className={`role-option ${selectedRole === 'Coach' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Coach')}
          >
            <section className="role-icon">⚽</section>
            <h3>Coach</h3>
            <p>Manage your team, track player performance, and analyze match data to improve your team's strategy.</p>
            <ul>
              <li>Create and manage your team</li>
              <li>Track individual player statistics</li>
              <li>Analyze team performance metrics</li>
              <li>Manage match lineups and tactics</li>
            </ul>
          </section>

          {includeAdminOption && (
            <section 
              className={`role-option ${selectedRole === 'Admin' ? 'selected' : ''}`}
              onClick={() => setSelectedRole('Admin')}
            >
              <section className="role-icon">🛠️</section>
              <h3>Admin</h3>
              <p>Manage the platform, approve coach applications, and oversee system operations and user management.</p>
              <ul>
                <li>User management and moderation</li>
                <li>Coach application approval</li>
                <li>System analytics and reports</li>
                <li>Platform configuration and settings</li>
              </ul>
            </section>
          )}
        </section>

        {selectedRole && (
          <section className="role-selection-actions">
            <button
              className="continue-btn"
              onClick={() => handleRoleSelect(selectedRole)}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : `Continue as ${selectedRole}`}
            </button>
          </section>
        )}

        {error && (
          <section className="error-message">
            {error}
          </section>
        )}
      </section>
    </section>
  );
};

export default RoleSelection;