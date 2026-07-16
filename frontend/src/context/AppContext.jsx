import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, analysisService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Load auth state and theme on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    setAuthLoading(false);
  }, []);

  // Fetch history when user logins
  useEffect(() => {
    if (token) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [token]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setToken(data.access_token);
      setUser(data.user);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      return await authService.signup(username, email, password);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
    setActiveReport(null);
    setHistory([]);
  };

  const fetchHistory = async () => {
    try {
      const data = await analysisService.getHistory();
      setHistory(data);
      // Auto set first report as active if none is active
      if (data.length > 0 && !activeReport) {
        setActiveReport(data[0]);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const deleteReport = async (report_id) => {
    try {
      await analysisService.deleteReport(report_id);
      setHistory((prev) => prev.filter((r) => r.id !== report_id));
      if (activeReport && activeReport.id === report_id) {
        setActiveReport(null);
      }
    } catch (err) {
      console.error("Error deleting report:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        theme,
        history,
        activeReport,
        loading,
        authLoading,
        setActiveReport,
        toggleTheme,
        login,
        signup,
        logout,
        fetchHistory,
        deleteReport,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export default AppContext;
