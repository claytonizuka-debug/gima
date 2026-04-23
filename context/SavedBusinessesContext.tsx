import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import {
    getSavedBusinessSlugs,
    saveBusinessForUser,
    unsaveBusinessForUser,
} from '../services/savedBusinessService';
import { useAuth } from './AuthContext';

type SavedBusinessesContextType = {
  savedSlugs: string[];
  toggleSaved: (slug: string) => Promise<void>; // ✅ FIX HERE
  isSaved: (slug: string) => boolean;
  loading: boolean;
};

const SavedBusinessesContext = createContext<SavedBusinessesContextType | undefined>(undefined);

export function SavedBusinessesProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSavedBusinesses() {
      if (authLoading) {
        return;
      }

      if (!user) {
        setSavedSlugs([]);
        setLoading(false);
        return;
      }

      try {
        const slugs = await getSavedBusinessSlugs(user.uid);
        setSavedSlugs(slugs);
      } catch (error) {
        console.error('Error loading saved businesses:', error);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    loadSavedBusinesses();
  }, [user, authLoading]);

  async function toggleSaved(slug: string) {
    if (!user) {
      console.warn('Must be logged in to save businesses');
      return;
    }

    const alreadySaved = savedSlugs.includes(slug);

    try {
      if (alreadySaved) {
        await unsaveBusinessForUser(user.uid, slug);
        setSavedSlugs((current) => current.filter((item) => item !== slug));
      } else {
        await saveBusinessForUser(user.uid, slug);
        setSavedSlugs((current) => [...current, slug]);
      }
    } catch (error) {
      console.error('Error toggling saved business:', error);
    }
  }

  function isSaved(slug: string) {
    return savedSlugs.includes(slug);
  }

  return (
    <SavedBusinessesContext.Provider
      value={{ savedSlugs, toggleSaved, isSaved, loading }}
    >
      {children}
    </SavedBusinessesContext.Provider>
  );
}

export function useSavedBusinesses() {
  const context = useContext(SavedBusinessesContext);

  if (!context) {
    throw new Error('useSavedBusinesses must be used inside a SavedBusinessesProvider');
  }

  return context;
}