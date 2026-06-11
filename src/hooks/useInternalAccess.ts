import { useState, useEffect } from 'react';
import { checkInternalAccess, InternalAccessCheck } from '../services/internalGoogleAdsService';
import { auth } from '../config/firebase';

export function useInternalAccess() {
  const [accessData, setAccessData] = useState<InternalAccessCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setAccessData({ isWhitelisted: false, error: 'Not authenticated' });
          setIsLoading(false);
          return;
        }

        const result = await checkInternalAccess();
        setAccessData(result);

        if (!result.isWhitelisted) {
          setError(result.error || 'Access denied');
        }
      } catch (err) {
        console.error('Error checking access:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setAccessData({ isWhitelisted: false, error: 'Failed to check access' });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, []);

  return {
    isWhitelisted: accessData?.isWhitelisted || false,
    user: accessData?.user,
    isLoading,
    error,
  };
}
