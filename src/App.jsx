import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// --- Páginas principais ---
import Home from "./pages/Home";
import SejaVoluntario from "./pages/SejaVoluntario";
import Login from "./pages/Login";
import Adocao from "./pages/Adocao";
import Doe from "./pages/Doe";
import Contato from "./pages/Contato";

// --- Painel do Administrador ---
import DashboardLayout from "./pages/Dashboard/DashboardLayout";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import PerfilAdmin from "./pages/Dashboard/PerfilAdmin";

import GatosLista from "./pages/Dashboard/GatosLista";
import CadastrarGato from "./pages/Dashboard/CadastrarGato";
import EditarGato from "./pages/Dashboard/EditarGato";

import VoluntariosAdmin from "./pages/Dashboard/VoluntariosAdmin";
import DoacoesAdmin from "./pages/Dashboard/DoacoesAdmin";
import SolicitacoesAdocaoAdmin from "./pages/Dashboard/SolicitacoesAdocaoAdmin";

function App() {
  return (
    <BrowserRouter>
      <Header />

      <main style={{ flex: 1, minHeight: "80vh", backgroundColor: "#f9f7f7ff" }}>
        <Routes>
          {/* --- PÁGINAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/adocao" element={<Adocao />} />
          <Route path="/doe" element={<Doe />} />
          <Route path="/seja-voluntario" element={<SejaVoluntario />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/login" element={<Login />} />

          {/* --- PAINEL ADMIN --- */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="perfil" element={<PerfilAdmin />} />
            <Route path="solicitacoes-adocao" element={<SolicitacoesAdocaoAdmin />} />

            {/* CRUD dos gatos */}
            <Route path="gatos" element={<GatosLista />} />
            <Route path="gatos/novo" element={<CadastrarGato />} />
            <Route path="gatos/editar/:id" element={<EditarGato />} />

            <Route path="voluntarios" element={<VoluntariosAdmin />} />
            <Route path="doacoes" element={<DoacoesAdmin />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
