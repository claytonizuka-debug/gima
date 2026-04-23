import { useEffect, useState } from 'react';
import { getBusinesses, type Business } from '../services/businessService';

export function useBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        const data = await getBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, []);

  return { businesses, loading };
}