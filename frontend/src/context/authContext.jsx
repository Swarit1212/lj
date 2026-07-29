import { useState, createContext, useEffect } from "react";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const userInfo = localStorage.getItem("UserInfo");
      if (userInfo && userInfo !== "undefined") {
        setUser(JSON.parse(userInfo));
      }
    } catch (err) {
      console.warn("Failed to parse UserInfo from localStorage:", err);
      localStorage.removeItem("UserInfo");
    }
  }, []);

  const login = (data) => {
    localStorage.setItem("UserInfo", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("UserInfo");
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};
