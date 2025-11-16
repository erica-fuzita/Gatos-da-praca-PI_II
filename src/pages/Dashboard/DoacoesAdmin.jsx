import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "./DashboardSections.css";

export default function DoacoesAdmin() {
  const [doacoes, setDoacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  // popup
  const [popupOpen, setPopupOpen] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);
  const [doacaoSelecionada, setDoacaoSelecionada] = useState(null);

  // 🔹 Carregar doações do Firestore
  const carregarDoacoes = async () => {
    try {
      const ref = collection(db, "doacoes");
      const snapshot = await getDocs(ref);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoacoes(lista);
    } catch (err) {
      console.error("Erro ao carregar doações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDoacoes();
  }, []);

  // 🔹 Abrir detalhes da doação
  const abrirPopup = (doacao) => {
    setDoacaoSelecionada(doacao);
    setPopupOpen(true);
  };

  // 🔹 Fechar com confirmação
  const fecharPopup = () => {
    setConfirmClose(true);
  };

  const confirmarFechar = () => {
    setConfirmClose(false);
    setPopupOpen(false);
    setDoacaoSelecionada(null);
  };

  // 🔹 Excluir doação
  const excluirDoacao = async () => {
    if (!confirm("Tem certeza que deseja remover esta doação?")) return;

    try {
      const ref = doc(db, "doacoes", doacaoSelecionada.id);
      await deleteDoc(ref);
      alert("Doação removida!");
      carregarDoacoes();
      setPopupOpen(false);
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir doação.");
    }
  };

  return (
    <div className="section-container">
      <h1>Doações recebidas</h1>

      {loading ? (
        <p>Carregando doações...</p>
      ) : doacoes.length === 0 ? (
        <p>Nenhuma doação encontrada.</p>
      ) : (
        <table className="table-list">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Tipo</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {doacoes.map((d) => (
              <tr key={d.id}>
                <td>{d.nome}</td>
                <td>{d.email}</td>
                <td>
                  {d.doacaoDinheiro
                    ? "Dinheiro"
                    : d.doacaoItens
                    ? "Itens"
                    : "-"}
                </td>
                <td>
                  {d.dataCadastro?.toDate
                    ? d.dataCadastro.toDate().toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => abrirPopup(d)}>
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* POPUP DETALHES */}
      {popupOpen && doacaoSelecionada && (
        <div className="popup-bg">
          <div className="popup-card-large">
            <button className="popup-close" onClick={fecharPopup}>
              ✖
            </button>

            <h2>Detalhes da Doação</h2>

            <label>Nome</label>
            <input type="text" value={doacaoSelecionada.nome} disabled />

            <label>Email</label>
            <input type="email" value={doacaoSelecionada.email} disabled />

            {doacaoSelecionada.doacaoDinheiro && (
              <>
                <label>Doação em dinheiro</label>
                <input
                  type="text"
                  value={`${doacaoSelecionada.doacaoDinheiro.valor} — ${doacaoSelecionada.doacaoDinheiro.frequencia}`}
                  disabled
                />
              </>
            )}

            {doacaoSelecionada.doacaoItens && (
              <>
                <label>Doação de itens</label>
                <input
                  type="text"
                  value={`${doacaoSelecionada.doacaoItens.categoria} — ${doacaoSelecionada.doacaoItens.detalhes}`}
                  disabled
                />
              </>
            )}

            {doacaoSelecionada.mensagem && (
              <>
                <label>Mensagem</label>
                <textarea value={doacaoSelecionada.mensagem} disabled />
              </>
            )}

            <div className="popup-actions">
              <button className="delete-btn" onClick={excluirDoacao}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMAR FECHAR POPUP */}
      {confirmClose && (
        <div className="popup-bg">
          <div className="popup-confirm-small">
            <p>Deseja realmente fechar?</p>

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
