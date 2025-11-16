// src/pages/Dashboard/GatoAdmin.jsx
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import GatoPopup from "./GatoPopup";
import "./GatoAdmin.css";

export default function GatoAdmin() {
  const [gatos, setGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [gatoSelecionado, setGatoSelecionado] = useState(null);

  const carregarGatos = async () => {
    try {
      setCarregando(true);
      const ref = collection(db, "gatos");
      const snap = await getDocs(ref);
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGatos(lista);
      setErro("");
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar gatos.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarGatos();
  }, []);

  const abrirPopup = (gato) => setGatoSelecionado(gato);
  const fecharPopup = () => setGatoSelecionado(null);

  const salvarGato = async (gatoAtualizado) => {
    try {
      const ref = doc(db, "gatos", gatoAtualizado.id);

      const payload = {
        nome: gatoAtualizado.nome || "",
        sexo: gatoAtualizado.sexo || "",
        idade: gatoAtualizado.idade || "",
        castrado: !!gatoAtualizado.castrado,
        status_adocao: gatoAtualizado.status_adocao || "",
        descricao: gatoAtualizado.descricao || "",
        imagem_url: gatoAtualizado.imagem_url || "",
      };

      await updateDoc(ref, payload);

      setGatos((prev) =>
        prev.map((g) => (g.id === gatoAtualizado.id ? { ...g, ...payload } : g))
      );

      fecharPopup();
      alert("✅ Dados do gato salvos com sucesso!");
    } catch (e) {
      console.error(e);
      alert("❌ Erro ao salvar os dados do gato.");
    }
  };

  const excluirGato = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este gato?")) return;

    try {
      await deleteDoc(doc(db, "gatos", id));
      setGatos((prev) => prev.filter((g) => g.id !== id));
      fecharPopup();
      alert("🗑️ Gato excluído com sucesso.");
    } catch (e) {
      console.error(e);
      alert("❌ Erro ao excluir o gato.");
    }
  };

 return (
  <div className="gatos-admin-container">

    <div className="gatos-admin-card">

      <div className="gatos-admin-topo">
        <h1>Gatos cadastrados</h1>
        <button className="btn-novo-gato">+ Novo gato</button>
      </div>

      <p className="gatos-subtitulo">
        Aqui você pode visualizar, editar ou remover gatos cadastrados.
      </p>

      {erro && <p className="gatos-erro">{erro}</p>}
      {carregando ? (
        <p>Carregando gatos...</p>
      ) : gatos.length === 0 ? (
        <p>Nenhum gato cadastrado.</p>
      ) : (
        <div className="gatos-tabela-wrapper">
          <table className="gatos-tabela">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nome</th>
                <th>Sexo</th>
                <th>Idade</th>
                <th>Castrado</th>
                <th>Status adoção</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {gatos.map((gato) => (
                <tr key={gato.id}>
                  <td>
                    <div className="gato-miniatura">
                      <img
                        src={
                          gato.imagem_url ||
                          gato.imagemUrl ||
                          "/banners/gato-padrao.jpg"
                        }
                        alt={gato.nome || "Gato"}
                        onError={(e) => {
                          e.target.src = "/banners/gato-padrao.jpg";
                        }}
                      />
                    </div>
                  </td>
                  <td>{gato.nome || "-"}</td>
                  <td>{gato.sexo || "-"}</td>
                  <td>{gato.idade || "-"}</td>
                  <td>{gato.castrado ? "Sim" : "Não"}</td>
                  <td>{gato.status_adocao || "-"}</td>
                  <td className="gatos-acoes">
                    <button
                      className="btn-editar"
                      onClick={() => abrirPopup(gato)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => excluirGato(gato.id)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

    {/* POPUP */}
    {gatoSelecionado && (
      <GatoPopup
        gato={gatoSelecionado}
        onClose={fecharPopup}
        onSave={salvarGato}
        onDelete={() => excluirGato(gatoSelecionado.id)}
      />
    )}
  </div>
);
}
