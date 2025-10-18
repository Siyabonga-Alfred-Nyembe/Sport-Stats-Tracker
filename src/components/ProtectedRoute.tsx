import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isCoach, isFan } from '../services/roleService';
import supabase from '../../supabaseClient';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Fan' | 'Coach' | 'Admin';
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  redirectTo = '/role-selection' 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate('/login');
          return;
        }

        if (!requiredRole) {
          setHasAccess(true);
          setIsLoading(false);
          return;
        }

        let hasRequiredRole = false;
        
        if (requiredRole === 'Coach') {
          hasRequiredRole = await isCoach(session.user.id);
        } else if (requiredRole === 'Fan') {
          hasRequiredRole = await isFan(session.user.id);
        }

        if (hasRequiredRole) {
          setHasAccess(true);
        } else {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [navigate, requiredRole, redirectTo]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#666'
      }}>
        Checking access...
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
};

export default ProtectedRoute;
