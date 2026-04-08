import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateApiMetadata } from '../utils/apiMetadata';

interface Membership {
  badge: string;
  discountPercent: number;
  status: string;
  joinedAt: string;
  currentAvailablePoints: number;
  totalPoints: number;
  pointToNextTier: number;
  pointMultiplier: number;
}

interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  fullName?: string;
  roles?: string[];
  status?: string;
  membership?: Membership;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateUserAvatar: (newUrl: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    
    if (!userId || !accessToken) return;

    const metadata = generateApiMetadata("ONL");
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/profile-me?userId=${userId}`, {
        method: "GET",
        headers: {
          "accept": "*/*",
          "authorization": `Bearer ${accessToken}`,
          "rt-request-id": metadata.requestId,
          "rt-request_date_time": metadata.requestDateTime,
          "rt-channel": metadata.channel
        }
      });

      if (response.ok) {
        const result = await response.json();
        // Update user state with full profile data
        const profileData = result.data;
        const membershipData = result.membership;
        const authoritiesData = result.authorities;
        
        const updatedUser = {
          id: userId,
          name: profileData.fullName || profileData.username || "User",
          username: profileData.username,
          fullName: profileData.fullName,
          email: profileData.email,
          phone: profileData.phone,
          avatar: profileData.avatarUrl,
          status: profileData.status,
          roles: authoritiesData?.roles || [],
          membership: membershipData
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchProfile().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchProfile]);

  const login = (user: User, accessToken: string, refreshToken: string) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userId', user.id);
    fetchProfile(); // Initial profile fetch after login
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    const metadata = generateApiMetadata("OFF");
    
    try {
      await fetch("http://localhost:8080/api/v1/authentication/logout", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...metadata,
          data: { refreshToken: refreshToken || "" }
        })
      });
    } catch (err) {
      console.error("Logout API failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
    }
  };

  const updateUserAvatar = (newUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: newUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchProfile, updateUserAvatar, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
