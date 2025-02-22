import axiosWithCookie from "../axios";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SessionContext = createContext();

const SessionProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionValid, setSessionValid] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkSession = async () => {
    setLoading(true);
    try {
      const response = await axiosWithCookie().get(
        "/api/session/session-check"
      );

      if (response.data.status !== "success" || !response.data.isValid) {
        setLoading(false);
        navigate("/auth/sign-in");
      } else {
        setSessionValid(true);
        setIsAdmin(response.data.isAdmin);
        setLoading(false);
      }
    } catch (error) {
      console.error("Session check failed:", error);
      setSessionValid(false);
      setLoading(false);
      navigate("/auth/sign-in");
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <SessionContext.Provider value={{ sessionValid, isAdmin, loading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

export { SessionProvider, SessionContext };
