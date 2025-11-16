import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { User } from "lucide-react";
import { useEffect, useState } from "react";

function getIsAdmin() {
  try {
    return localStorage.getItem("isAdmin") === "1";
  } catch {
    return false;
  }
}

export default function Header() {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(getIsAdmin());

  // 🔁 Atualiza quando muda a rota
  useEffect(() => {
    setIsAdmin(getIsAdmin());
  }, [location]);

  // 🔔 Atualiza automaticamente quando login/logout ocorre
  useEffect(() => {
    const onChange = () => setIsAdmin(getIsAdmin());
    window.addEventListener("storage", onChange);
    window.addEventListener("auth-change", onChange);
    return () => {
      window.removeEventListener("storage", onChange);
      window.removeEventListener("auth-change", onChange);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        {/* --- LOGO --- */}
        <Link to="/" className="logo-link" aria-label="Ir para a página inicial">
          <img
            src="/Menu/logo_gatos_tipo-Horizontal.svg"
            alt="Logo Gatos da Praça"
            className="logo-img"
          />
        </Link>

        {/* --- MENU --- */}
        <nav className="nav-menu">
          <Link to="/">
            <img src="/icones-menu/home.svg" alt="Home" className="menu-icon" />
            Home
          </Link>

          <Link to="/adocao">
            <img src="/icones-menu/adote.svg" alt="Adoção" className="menu-icon" />
            Adoção
          </Link>

          <Link to="/seja-voluntario">
            <img src="/icones-menu/voluntario.svg" alt="Voluntário" className="menu-icon" />
            Seja Voluntário
          </Link>

          <Link to="/doe">
            <img src="/icones-menu/doe.svg" alt="Doe" className="menu-icon" />
            Doe
          </Link>

          <Link to="/contato">
            <img src="/icones-menu/contato.svg" alt="Contato" className="menu-icon" />
            Contato
          </Link>
        </nav>

        {/* --- LOGIN / PERFIL --- */}
        <div className="login">
          {!isAdmin ? (
            <Link to="/login" className="login-link">
              <User size={18} strokeWidth={2} className="icon-login" />
              Entrar
            </Link>
          ) : (
            <Link to="/dashboard" className="dashboard-link">
              <User size={18} strokeWidth={2} className="icon-login" />
              Perfil
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
