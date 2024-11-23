import { User } from '@/models/dataType';
import { fetchBackendGET, fetchBackendPOST } from '@/utils/backendFetch';
import { Box, CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  currentUser: User | null | "loading";
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const LoadingScreen = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null | "loading">("loading");

  // const isAuthPage = (pathname: string) => {
  //   const authPages = ['/login', '/register'];
  //   return authPages.includes(pathname);
  // };

  // const GetCurrentUser = async () => {
  //   try {
  //     const response = await fetchBackendGET('/user/me');
  //     if (response.ok) {
  //       const data = await response.json();
  //       setCurrentUser(data);
  //     } else {
  //       setCurrentUser(null);
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch current user data:", error);
  //     setCurrentUser(null);
  //   }
  // };

  // const checkAuth = async () => {
  //   try {
  //     const response = await fetchBackendGET('/user/check-auth');
  //     const data = await response.json();
  //     if (data.isLoggedIn) {
  //       await GetCurrentUser();
  //       if (isAuthPage(router.pathname)) {
  //         router.push('/home');
  //       }
  //     } else {
  //       router.push("/login");
  //     }
  //   } catch (error) {
  //     console.error('Auth check failed:', error);
  //     setCurrentUser(null);
  //     router.push("/login");
  //   }
  // };

  // useEffect(() => {
  //   if (isAuthPage(router.pathname)) {
  //     setCurrentUser(null);
  //   } else {
  //     checkAuth();
  //   }
  // }, []);

  // useEffect(() => {
  //   if (router.pathname === "/login") {
  //     setCurrentUser(null);
  //   }
  // }, [router.pathname]);

  const login = async (email: string, password: string) => {
    try {
      const loginData = { email, password };
      const response = await fetchBackendPOST('/user/login', loginData);
      const data = await response.json();
      if (response.ok && data.session) {
    ;
        router.push("/home");
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Login process error:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetchBackendGET('/user/logout');
      if (response.ok) {
        setCurrentUser(null);
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout process error:", error);
    }
  };

  const value = { currentUser, login, logout };

/*   if (currentUser === "loading") {
    return <LoadingScreen />;
  } */

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
