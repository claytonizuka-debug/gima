import { createContext, ReactNode, useContext, useState } from 'react';

// This defines what data and functions our context will provide
type SavedBusinessesContextType = {
  savedSlugs: string[];
  toggleSaved: (slug: string) => void;
  isSaved: (slug: string) => boolean;
};

// Create the context
const SavedBusinessesContext = createContext<SavedBusinessesContextType | undefined>(undefined);

// Provider component that wraps the app and shares saved business state
export function SavedBusinessesProvider({ children }: { children: ReactNode }) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  // Add or remove a business slug from the saved list
  const toggleSaved = (slug: string) => {
    setSavedSlugs((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  // Returns true if a business is already saved
  const isSaved = (slug: string) => {
    return savedSlugs.includes(slug);
  };

  return (
    <SavedBusinessesContext.Provider value={{ savedSlugs, toggleSaved, isSaved }}>
      {children}
    </SavedBusinessesContext.Provider>
  );
}

// Custom hook so other files can use the context easily
export function useSavedBusinesses() {
  const context = useContext(SavedBusinessesContext);

  if (!context) {
    throw new Error('useSavedBusinesses must be used inside a SavedBusinessesProvider');
  }

  return context;
}