import "./SolicitarAdocaoModal.css";
import { useState } from "react";
import { db } from "../firebaseConfig"; // ✔ Caminho corrigido!
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SolicitarAdocaoModal({ gato, aberto, fechar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  if (!aberto) return null;

  const enviarSolicitacao = async (e) => {
    e.preventDefault();

    if (!nome || !email || !telefone) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      setCarregando(true);

      await addDoc(collection(db, "adocao-solicitacoes"), {
        gatoId: gato.id,
        gatoNome: gato.nome,
        nome: nome,
        email,
        telefone,
        mensagem,
        status: "Pendente",
        dataSolicitacao: serverTimestamp(),
      });

      setEnviado(true);

    } catch (err) {
      console.error("Erro ao enviar solicitação:", err);
      alert("Ocorreu um erro. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        <button className="modal-close" onClick={fechar}>✖</button>

        {!enviado ? (
          <>
            <h2>Solicitar Adoção</h2>
            <p className="modal-gato-nome">Gato selecionado: <strong>{gato.nome}</strong></p>

            <form onSubmit={enviarSolicitacao} className="modal-form">

              <label>Nome completo *</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />

              <label>E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label>Telefone *</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />

              <label>Mensagem (opcional)</label>
              <textarea
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />

              <button type="submit" className="modal-btn" disabled={carregando}>
                {carregando ? "Enviando..." : "Enviar solicitação"}
              </button>

            </form>
          </>
        ) : (
          <div className="modal-sucesso">
            <h3>💚 Solicitação enviada!</h3>
            <p>Obrigado por demonstrar interesse em adotar o(a) {gato.nome}!</p>
            <p>Entraremos em contato em breve com mais informações.</p>

            <button className="modal-btn" onClick={fechar}>
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
