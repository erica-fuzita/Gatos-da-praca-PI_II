import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "./DashboardSections.css";

export default function VoluntariosAdmin() {
  const [voluntarios, setVoluntarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dados do pop-up
  const [popupOpen, setPopupOpen] = useState(false);
  const [voluntarioEdit, setVoluntarioEdit] = useState(null);
  const [confirmClose, setConfirmClose] = useState(false);

  // 🔹 Carrega voluntários do Firestore
  const carregarVoluntarios = async () => {
    try {
      const ref = collection(db, "voluntarios");
      const snapshot = await getDocs(ref);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setVoluntarios(lista);
    } catch (error) {
      console.error("Erro ao carregar voluntários:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVoluntarios();
  }, []);

  // 🔹 Abrir pop-up com dados do voluntário selecionado
  const abrirPopup = (vol) => {
    setVoluntarioEdit({ ...vol });
    setPopupOpen(true);
  };

  // 🔹 Fechar pop-up com confirmação
  const fecharPopup = () => {
    setConfirmClose(true);
  };

  const confirmarFechar = () => {
    setConfirmClose(false);
    setPopupOpen(false);
    setVoluntarioEdit(null);
  };

  // 🔹 Salvar edição
  const salvarEdicao = async () => {
    try {
      const ref = doc(db, "voluntarios", voluntarioEdit.id);
      await updateDoc(ref, {
        nome: voluntarioEdit.nome,
        email: voluntarioEdit.email,
        telefone: voluntarioEdit.telefone,
        mensagem: voluntarioEdit.mensagem,
      });

      alert("Voluntário atualizado!");
      carregarVoluntarios();
      setPopupOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações.");
    }
  };

  // 🔹 Excluir voluntário
  const excluirVoluntario = async () => {
    if (!confirm("Tem certeza que deseja remover este voluntário?")) return;

    try {
      const ref = doc(db, "voluntarios", voluntarioEdit.id);
      await deleteDoc(ref);

      alert("Voluntário removido.");
      carregarVoluntarios();
      setPopupOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir.");
    }
  };

  return (
    <div className="section-container">
      <h1>Voluntários cadastrados</h1>

      {loading ? (
        <p>Carregando voluntários...</p>
      ) : voluntarios.length === 0 ? (
        <p>Nenhum voluntário encontrado.</p>
      ) : (
        <table className="table-list">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {voluntarios.map((v) => (
              <tr key={v.id}>
                <td>{v.nome}</td>
                <td>{v.email}</td>
                <td>{v.telefone || "-"}</td>
                <td>
                  {v.dataCadastro?.toDate
                    ? v.dataCadastro.toDate().toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => abrirPopup(v)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* === POP-UP DE EDIÇÃO === */}
      {popupOpen && voluntarioEdit && (
        <div className="popup-bg">
          <div className="popup-card-large">
            <button className="popup-close" onClick={fecharPopup}>
              ✖
            </button>

            <h2>Editar voluntário</h2>

            <label>Nome</label>
            <input
              type="text"
              value={voluntarioEdit.nome}
              onChange={(e) =>
                setVoluntarioEdit({ ...voluntarioEdit, nome: e.target.value })
              }
            />

            <label>E-mail</label>
            <input
              type="email"
              value={voluntarioEdit.email}
              onChange={(e) =>
                setVoluntarioEdit({ ...voluntarioEdit, email: e.target.value })
              }
            />

            <label>Telefone</label>
            <input
              type="text"
              value={voluntarioEdit.telefone || ""}
              onChange={(e) =>
                setVoluntarioEdit({
                  ...voluntarioEdit,
                  telefone: e.target.value,
                })
              }
            />

            <label>Mensagem enviada</label>
            <textarea
              rows="4"
              value={voluntarioEdit.mensagem || ""}
              onChange={(e) =>
                setVoluntarioEdit({
                  ...voluntarioEdit,
                  mensagem: e.target.value,
                })
              }
            />

            <div className="popup-actions">
              <button className="save-btn" onClick={salvarEdicao}>
                Salvar
              </button>
              <button className="delete-btn" onClick={excluirVoluntario}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAÇÃO DE FECHAR POP-UP */}
      {confirmClose && (
        <div className="popup-bg">
          <div className="popup-confirm-small">
            <p>Deseja realmente fechar o formulário?</p>

            <div className="popup-actions">
              <button onClick={confirmarFechar}>Sim</button>
              <button onClick={() => setConfirmClose(false)}>Não</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
