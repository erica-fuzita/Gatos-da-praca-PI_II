import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { app } from "../firebaseConfig";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setCarregando(true);
    const auth = getAuth(app);

    try {
      await setPersistence(auth, browserLocalPersistence);

      // 🔓 Login automático — usa EXACTAMENTE as credenciais do Firebase
      await signInWithEmailAndPassword(
        auth,
        "admin@outlook.com", // ← coloque aqui o email EXATO que está no Firebase Auth
        "46181770a"          // ← e aqui a senha que você setou lá
      );

      // salvar corretamente
      localStorage.setItem("isAdmin", "1");
      localStorage.setItem("adminEmail", "admin@outlook.com");
      localStorage.setItem("adminName", "Administrador");
      window.dispatchEvent(new Event("auth-change"));
      navigate("/dashboard");
      return; // encerra aqui

    } catch (err) {
      console.error(err);
      alert("E-mail ou senha inválidos.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <h2 className="login-title">Entrar no sistema</h2>

        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button type="submit" disabled={carregando}>
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
