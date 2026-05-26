import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

// Inicializar autenticación al cargar la página
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      
      if (token) {
        const savedUser = JSON.parse(localStorage.getItem("userData") || "null");
        const userType = localStorage.getItem("userType");
        const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

        if (savedUser) {
          setUser({ ...savedUser, user_type: userType, permissions });
        } else {
          // Fallback para administrativos
          const username = localStorage.getItem("username");
          const role = localStorage.getItem("role");
          setUser({ username, role, permissions });
        }
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Función de login
  const login = async (username, password) => {
  try {
    setLoading(true);

    const response = await axiosInstance.post("/auth/login/", {
      username,
      password,
    });

    console.log("LOGIN RESPONSE:", response.data); // 👈 DEBUG

    const { access, refresh, role, apoderado_id, permissions } = response.data;

    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    localStorage.setItem("permissions", JSON.stringify(permissions || []));
    if (apoderado_id) {
        localStorage.setItem("apoderado_id", apoderado_id);
    }

    setIsAuthenticated(true);
    setUser({ username, role, apoderado_id, permissions: permissions || [] });

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
 

// Login para Apoderados
  const loginParent = async (codigo_estudiante, password) => {
    try {
      const response = await axiosInstance.post("/auth/login-parent/", {
        codigo_estudiante,
        password,
      });

      const { token, user: userInfo, requires_password_change, refresh } = response.data;

      const parentPermissions = ["parent"];

      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("userType", "parent");
      localStorage.setItem("userData", JSON.stringify(userInfo));
      localStorage.setItem("permissions", JSON.stringify(parentPermissions));

      setIsAuthenticated(true);
      setUser({ ...userInfo, user_type: "parent", permissions: parentPermissions });

      toast.success("¡Bienvenido!");
      return { success: true, requires_password_change };

    } catch (error) {
      const message = error.response?.data?.detail || "Credenciales incorrectas";
      toast.error(message);
      return { success: false };
    }
  };

  // Función de logout
const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Sesión cerrada");
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    loginParent,     // ← Importante
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
