import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useEffect } from "react";

// Ícones minimalistas
import { 
  Home, 
  User, 
  Grid, 
  Users, 
  Heart, 
  ClipboardList, 
  LogOut 
} from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    if (!isAdmin) navigate("/login", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("adminName");
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  // Links do dashboard (menu lateral)
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/dashboard/perfil", label: "Meu Perfil", icon: <User size={20} /> },
    { to: "/dashboard/gatos", label: "Gatos", icon: <Grid size={20} /> },
    { to: "/dashboard/voluntarios", label: "Voluntários", icon: <Users size={20} /> },
    { to: "/dashboard/doacoes", label: "Doações", icon: <Heart size={20} /> },
    { to: "/dashboard/solicitacoes-adocao", label: "Solicitações de Adoção", icon: <ClipboardList size={20} /> }
  ];

  return (
    <div className="dashboard-wrapper">

      {/* === SIDEBAR === */}
      <aside className="sidebar">

        <div className="sidebar-header">
          <h2>🐾 Admin</h2>
        </div>

        <nav className="sidebar-nav">
          {links.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <span className="icon">{item.icon}</span>
              <span className="text">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} className="logout-icon" />
          Sair
        </button>

      </aside>

      {/* === CONTEÚDO PRINCIPAL === */}
      <main className="dashboard-content">
        <Outlet />
      </main>

    </div>
  );
}
