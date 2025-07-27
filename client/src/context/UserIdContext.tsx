import React, { createContext, useContext, useState, useCallback } from 'react';

// Generate a random 6-character code (A-F, 0-9)
function generateUserId() {
  const chars = 'ABCDEF0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

type UserIdContextType = {
  userId: string;
  regenerateUserId: () => void;
};

const UserIdContext = createContext<UserIdContextType | undefined>(undefined);

export const UserIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState(() => generateUserId());
  const regenerateUserId = useCallback(() => {
    setUserId(generateUserId());
  }, []);
  return (
    <UserIdContext.Provider value={{ userId, regenerateUserId }}>
      {children}
    </UserIdContext.Provider>
  );
};

export function useUserId() {
  const ctx = useContext(UserIdContext);
  if (!ctx) throw new Error('useUserId must be used within a UserIdProvider');
  return ctx;
}
