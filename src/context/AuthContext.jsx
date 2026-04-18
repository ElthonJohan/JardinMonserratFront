import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay token al cargar
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      const refresh = localStorage.getItem("refresh_token");

      if (token) {
        setIsAuthenticated(true);
        setUser({ username: localStorage.getItem("username") });
      } else if (refresh) {
        try {
          const res = await axiosInstance.post("/refresh/", {
            refresh,
          });

          localStorage.setItem("access_token", res.data.access);
          setIsAuthenticated(true);
        } catch {
          logout();
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // Función de login
  const login = async (username, password) => {
  try {
    setLoading(true);

    const response = await axiosInstance.post("/login/", {
      username,
      password,
    });

    console.log("LOGIN RESPONSE:", response.data); // 👈 DEBUG

    const { access, refresh } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("username", username);

    setIsAuthenticated(true);
    setUser({ username });

    toast.success("¡Bienvenido!");
    return true;

  } catch (error) {
    console.log("ERROR LOGIN:", error.response); // 👈 IMPORTANTE

    const errorMessage =
      error.response?.data?.detail ||
      "Error en el servidor o conexión";

    toast.error(errorMessage);
    return false;

  } finally {
    setLoading(false);
  }
};
  // const login = async (username, password) => {
  //   try {
  //     setLoading(true);

  //     const response = await axiosInstance.post("/login/", {
  //       username,
  //       password,
  //     });

  //     const { access, refresh } = response.data;

  //     localStorage.setItem("access_token", access);
  //     localStorage.setItem("refresh_token", refresh);
  //     localStorage.setItem("username", username);

  //     setIsAuthenticated(true);
  //     setUser({ username });
  //     toast.success("¡Bienvenido!");
  //     return true;
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.detail || "Error en el login";
  //     toast.error(errorMessage);
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Función de logout
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Sesión cerrada");
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
