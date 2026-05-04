import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSubscription, isActive } from '@/hooks/useSubscription';

type Props = { children: React.ReactNode };

export function SubscriptionGuard({ children }: Props) {
  const { data: sub, isLoading } = useSubscription();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isActive(sub)) {
      navigate('/pricing?upgrade=true', { replace: true });
    }
  }, [sub, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isActive(sub)) return null;

  return <>{children}</>;
}
