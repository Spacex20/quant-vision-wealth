import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthPage } from './AuthPage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProfileOnboarding } from '../profiles/ProfileOnboarding';

interface ProtectedRouteProps {
  children: ReactNode;
}

// If loaded, show login if not authenticated; 
// If profile exists but onboarding not completed, show onboarding page;
// Otherwise show requested children (dashboard etc.)
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, profile } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  if (profile && !profile.onboarding_completed) {
    return <ProfileOnboarding />;
  }

  return <>{children}</>;
}
