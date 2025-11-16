import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import "./SolicitacoesAdocaoAdmin.css";
import { CheckCircle, Trash2, Eye, ChevronDown } from "lucide-react";

export default function SolicitacoesAdocaoAdmin() {
  const [solicitacoes, setSolicitacoes] = useState([]);

  // Modal de detalhes
  const [detalhesAberto, setDetalhesAberto] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState(null);

  // Dropdown de status
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // Carregar solicitações
  useEffect(() => {
    async function carregarSolicitacoes() {
      const snap = await getDocs(collection(db, "adocao-solicitacoes"));

      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Ordenar por data (mais recente primeiro)
      lista.sort(
        (a, b) => (b.dataSolicitacao?.seconds || 0) - (a.dataSolicitacao?.seconds || 0)
      );

      setSolicitacoes(lista);
    }

    carregarSolicitacoes();
  }, []);

  // Atualizar status no Firestore
  async function atualizarStatus(id, novoStatus) {
    try {
      await updateDoc(doc(db, "adocao-solicitacoes", id), {
        status: novoStatus,
      });

      setSolicitacoes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: novoStatus } : s))
      );

      if (solicitacaoSelecionada?.id === id) {
        setSolicitacaoSelecionada((prev) => ({ ...prev, status: novoStatus }));
      }

      // Se marcado como concluído → atualizar status do gato
      if (novoStatus === "Concluído" && solicitacaoSelecionada?.gatoId) {
        await updateDoc(doc(db, "gatos", solicitacaoSelecionada.gatoId), {
          status_adocao: "Adotado",
        });
      }

      // Se marcado como pendente → o gato fica disponível
      if (novoStatus === "Pendente" && solicitacaoSelecionada?.gatoId) {
        await updateDoc(doc(db, "gatos", solicitacaoSelecionada.gatoId), {
          status_adocao: "Disponível",
        });
      }

    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  }

  // Excluir solicitação
  async function excluirSolicitacao(solicitacao) {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;

    // 1️⃣ Restaurar status do gato
    if (solicitacao.gatoId) {
      try {
        await updateDoc(doc(db, "gatos", solicitacao.gatoId), {
          status_adocao: "Disponível",
        });
      } catch (err) {
        console.error("Erro ao atualizar status do gato:", err);
      }
    }

    // 2️⃣ Deletar solicitação
    await deleteDoc(doc(db, "adocao-solicitacoes", solicitacao.id));

    // 3️⃣ Atualizar renderização
    setSolicitacoes((prev) => prev.filter((s) => s.id !== solicitacao.id));

    // Fechar modal se estiver aberto
    if (detalhesAberto) {
      setDetalhesAberto(false);
      setSolicitacaoSelecionada(null);
    }
  }

  // Formatar data
  function formatarData(data) {
    if (!data) return "—";
    const d = new Date(data.seconds * 1000);
    return d.toLocaleDateString("pt-BR");
  }

  // Abrir modal
  function abrirDetalhes(solicitacao) {
    setSolicitacaoSelecionada(solicitacao);
    setDropdownAberto(false);
    setDetalhesAberto(true);
  }

  // Fechar modal
  function fecharDetalhes() {
    setSolicitacaoSelecionada(null);
    setDetalhesAberto(false);
    setDropdownAberto(false);
  }

  return (
    <div className="solicitacoes-container">
      <h1>Solicitações de Adoção</h1>
      <p className="subtitulo">Gerencie as solicitações recebidas pelo site.</p>

      {solicitacoes.length === 0 ? (
        <p className="nenhuma">Nenhuma solicitação encontrada 😿</p>
      ) : (
        <div className="tabela-wrapper">
          <table className="tabela-solicitacoes">
            <thead>
              <tr>
                <th>Adotante</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Gato</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {solicitacoes.map((s) => (
                <tr key={s.id}>
                  <td>{s.nome}</td>
                  <td>{s.email}</td>
                  <td>{s.telefone}</td>
                  <td>{s.gatoNome}</td>
                  <td>{formatarData(s.dataSolicitacao)}</td>

                  <td>
                    <span
                      className={`status ${
                        s.status === "Concluído" ? "done" : "pendente"
                      }`}
                    >
                      {s.status || "Pendente"}
                    </span>
                  </td>

                  <td className="acoes">
                    {/* Ver detalhes */}
                    <button
                      className="btn detalhes"
                      onClick={() => abrirDetalhes(s)}
                    >
                      <Eye size={18} />
                    </button>

                    {/* Concluir */}
                    {s.status !== "Concluído" && (
                      <button
                        className="btn concluir"
                        onClick={() => atualizarStatus(s.id, "Concluído")}
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}

                    {/* Excluir */}
                    <button
                      className="btn excluir"
                      onClick={() => excluirSolicitacao(s)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* === MODAL DE DETALHES === */}
      {detalhesAberto && solicitacaoSelecionada && (
        <div className="modal-overlay" onClick={fecharDetalhes}>
          <div
            className="modal-detalhes"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Detalhes da Solicitação</h2>

            <p><strong>Adotante:</strong> {solicitacaoSelecionada.nome}</p>
            <p><strong>E-mail:</strong> {solicitacaoSelecionada.email}</p>
            <p><strong>Telefone:</strong> {solicitacaoSelecionada.telefone}</p>
            <p><strong>Gato:</strong> {solicitacaoSelecionada.gatoNome}</p>
            <p><strong>Data:</strong> {formatarData(solicitacaoSelecionada.dataSolicitacao)}</p>

            {solicitacaoSelecionada.mensagem && (
              <p><strong>Mensagem:</strong> {solicitacaoSelecionada.mensagem}</p>
            )}

            {/* Dropdown STATUS */}
            <div className="status-editor">
              <label>Status:</label>

              <div
                className="dropdown-status"
                onClick={() => setDropdownAberto(!dropdownAberto)}
              >
                <span>{solicitacaoSelecionada.status || "Pendente"}</span>
                <ChevronDown size={18} />
              </div>

              {dropdownAberto && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => {
                      atualizarStatus(solicitacaoSelecionada.id, "Pendente");
                      setDropdownAberto(false);
                    }}
                  >
                    Pendente
                  </div>

                  <div
                    className="dropdown-item"
                    onClick={() => {
                      atualizarStatus(solicitacaoSelecionada.id, "Concluído");
                      setDropdownAberto(false);
                    }}
                  >
                    Concluído
                  </div>
                </div>
              )}
            </div>

            <button className="modal-btn" onClick={fecharDetalhes}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
