import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserRole } from '../services/roleService';
import './RoleSelection.css';

interface RoleSelectionProps {
  userId: string;
  userEmail: string;
  onRoleSelected: (role: 'Fan' | 'Coach') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ userId, userEmail, onRoleSelected }) => {
  const [selectedRole, setSelectedRole] = useState<'Fan' | 'Coach' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRoleSelect = async (role: 'Fan' | 'Coach') => {
    setSelectedRole(role);
    setIsLoading(true);
    setError(null);

    try {
      const success = await updateUserRole(userId, role);
      if (success) {
        onRoleSelected(role);
        if (role === 'Coach') {
          navigate('/team-setup');
        } else {
          navigate('/user-dashboard');
        }
      } else {
        setError('Failed to update role. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="role-selection">
      <div className="role-selection-container">
        <div className="role-selection-header">
          <h1>Welcome to Sport Stats Tracker!</h1>
          <p>Hi {userEmail}, please select your role to get started:</p>
        </div>

        <div className="role-options">
          <div 
            className={`role-option ${selectedRole === 'Fan' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Fan')}
          >
            <div className="role-icon">👥</div>
            <h3>Fan</h3>
            <p>Track your favorite teams, view match statistics, and stay updated with the latest football news.</p>
            <ul>
              <li>View team and player statistics</li>
              <li>Track match results and live scores</li>
              <li>Save favorite teams and players</li>
              <li>Access comprehensive football analytics</li>
            </ul>
          </div>

          <div 
            className={`role-option ${selectedRole === 'Coach' ? 'selected' : ''}`}
            onClick={() => setSelectedRole('Coach')}
          >
            <div className="role-icon">⚽</div>
            <h3>Coach</h3>
            <p>Manage your team, track player performance, and analyze match data to improve your team's strategy.</p>
            <ul>
              <li>Create and manage your team</li>
              <li>Track individual player statistics</li>
              <li>Analyze team performance metrics</li>
              <li>Manage match lineups and tactics</li>
            </ul>
          </div>
        </div>

        {selectedRole && (
          <div className="role-selection-actions">
            <button
              className="continue-btn"
              onClick={() => handleRoleSelect(selectedRole)}
              disabled={isLoading}
            >
              {isLoading ? 'Setting up...' : `Continue as ${selectedRole}`}
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
