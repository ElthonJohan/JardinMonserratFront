import { useState } from "react";
import axiosInstance from "../api/axiosConfig";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await axiosInstance.post("login/", { username, password });
    localStorage.setItem("token", res.data.access);
    alert("Login exitoso");
  };

  return (
    <div>
      <h2>Login</h2>
      <input onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" />
      <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Ingresar</button>
    </div>
  );
}