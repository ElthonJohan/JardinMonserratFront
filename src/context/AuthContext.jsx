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
    const initAuth = async () => {
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (token) {
        if (userType === "parent") {
          const savedUser = JSON.parse(localStorage.getItem("userData") || "null");
          const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
          if (savedUser) {
            setUser({ ...savedUser, user_type: "parent", permissions });
          } else {
            setUser({ user_type: "parent", permissions });
          }
          setIsAuthenticated(true);
          setLoading(false);
        } else {
          try {
            const response = await axiosInstance.get("/auth/usuarios/me/");
            const userData = response.data;
            const groups = userData.groups || [];
            const isTeacher = groups.includes("PROFESOR");

            const fullUser = {
              ...userData,
              isTeacher,
              user_type: isTeacher ? "teacher" : "staff",
            };

            localStorage.setItem("userData", JSON.stringify(fullUser));
            localStorage.setItem("groups", JSON.stringify(groups));
            localStorage.setItem("permissions", JSON.stringify(userData.permissions || []));
            localStorage.setItem("role", isTeacher ? "PROFESOR" : (userData.is_superuser ? "superuser" : "staff"));

            setUser(fullUser);
            setIsAuthenticated(true);
          } catch (error) {
            console.error("Error fetching user profile during initAuth:", error);
            const savedUser = JSON.parse(localStorage.getItem("userData") || "null");
            const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
            const groups = JSON.parse(localStorage.getItem("groups") || "[]");
            const role = localStorage.getItem("role");

            if (savedUser) {
              const isTeacher = (groups || []).includes("PROFESOR") || role === "PROFESOR";
              setUser({ ...savedUser, permissions, groups, isTeacher });
              setIsAuthenticated(true);
            } else {
              localStorage.clear();
              setUser(null);
              setIsAuthenticated(false);
            }
          } finally {
            setLoading(false);
          }
        }
      } else {
        setLoading(false);
      }
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

      const { access, refresh, role, apoderado_id, permissions, groups } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("permissions", JSON.stringify(permissions || []));
      localStorage.setItem("groups", JSON.stringify(groups || []));
      if (apoderado_id) {
          localStorage.setItem("apoderado_id", apoderado_id);
      }

      const isTeacher = (groups || []).includes("PROFESOR");
      const fullUser = {
        username,
        role,
        apoderado_id,
        permissions: permissions || [],
        groups: groups || [],
        isTeacher,
        user_type: isTeacher ? "teacher" : "staff",
      };

      localStorage.setItem("userData", JSON.stringify(fullUser));

      setIsAuthenticated(true);
      setUser(fullUser);

      toast.success("¡Bienvenido!");
      return { success: true, isTeacher };

    } catch (error) {
      console.log("ERROR LOGIN:", error.response); // 👈 IMPORTANTE

      const errorMessage =
        error.response?.data?.detail ||
        "Error en el servidor o conexión";

      toast.error(errorMessage);
      return { success: false };

    } finally {
      setLoading(false);
    }
  };
 

// Login para Apoderados
  const loginParent = async (dni, password) => {
    try {
      const response = await axiosInstance.post("/auth/login-parent/", {
        dni,
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

  const isTeacher = user ? !!user.isTeacher : false;

  const value = {
    user,
    loading,
    isAuthenticated,
    isTeacher,
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
