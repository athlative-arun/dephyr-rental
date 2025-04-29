
import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { users } from "../data/mockData";

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginAsAdmin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

// Admin credentials
const ADMIN_EMAIL = "admin@bangalorewheels.com";
const ADMIN_PASSWORD = "admin123";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load users from localStorage on initialization
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        // Update the users array reference with stored data
        users.length = 0; // Clear the array
        users.push(...parsedUsers); // Add all stored users
      } else {
        // Initialize localStorage with current users if not present
        localStorage.setItem("users", JSON.stringify(users));
      }
    } catch (error) {
      console.error("Error loading users from localStorage:", error);
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in via localStorage
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        setIsAdmin(user.isAdmin === true);
      } catch (error) {
        console.error("Error parsing stored user", error);
        localStorage.removeItem("currentUser");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting regular login with:", email);
      console.log("Available users:", users);
      
      // In a real app, this would be an API call
      const user = users.find(
        (u) => u.email === email && u.password === password && !u.isAdmin
      );
      
      if (user) {
        console.log("Login successful for user:", user);
        setCurrentUser(user);
        setIsLoggedIn(true);
        setIsAdmin(false);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return true;
      }
      console.log("Login failed: User not found or incorrect password");
      return false;
    } catch (error) {
      console.error("Login error", error);
      return false;
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log("Attempting admin login with:", email, password);
      
      // Check for hardcoded admin credentials
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: User = {
          id: "admin1",
          name: "Admin User",
          email: ADMIN_EMAIL,
          phone: "9876543210",
          password: ADMIN_PASSWORD,
          isAdmin: true,
          createdAt: new Date().toISOString(),
        };
        
        setCurrentUser(adminUser);
        setIsLoggedIn(true);
        setIsAdmin(true);
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        console.log("Admin login successful with hardcoded credentials");
        return true;
      }
      
      // Fallback to check in users array
      const admin = users.find(
        (u) => u.email === email && u.password === password && u.isAdmin === true
      );
      
      if (admin) {
        setCurrentUser(admin);
        setIsLoggedIn(true);
        setIsAdmin(true);
        localStorage.setItem("currentUser", JSON.stringify(admin));
        console.log("Admin login successful from users array");
        return true;
      }
      
      console.log("Admin login failed");
      return false;
    } catch (error) {
      console.error("Admin login error", error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("currentUser");
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    try {
      // Check if user already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        return false;
      }

      // In a real app, this would be an API call to create a user
      const newUser: User = {
        id: `user${users.length + 1}`,
        name,
        email,
        phone,
        password,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };

      // Add to users array
      users.push(newUser);
      
      // Save updated users array to localStorage
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Updated users in localStorage:", users);

      // Log in the new user
      setCurrentUser(newUser);
      setIsLoggedIn(true);
      setIsAdmin(false);
      localStorage.setItem("currentUser", JSON.stringify(newUser));

      return true;
    } catch (error) {
      console.error("Registration error", error);
      return false;
    }
  };

  const value = {
    currentUser,
    isLoggedIn,
    isAdmin,
    loading,
    login,
    loginAsAdmin,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
