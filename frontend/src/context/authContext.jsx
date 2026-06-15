import { createContext, useState, useEffect, useContext } from "react";
import axios from "../config/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);


  // Initialize: Check for token and fetch user data on mount
  useEffect(() => {
    const initializeAuth = async () => {
     

      try {
        if(user) return;
        setLoading(true);
        // Fetch current user details from backend (adjust route if needed)
        const response = await axios.get("/api/auth/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Failed to authenticate token:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [setUser]);



  
  return (
    <AuthContext.Provider value={{ user, loading,setLoading,setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming auth data easily across components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
