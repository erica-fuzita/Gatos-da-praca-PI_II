import { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import "./Doe.css";

export default function Doe() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [valor, setValor] = useState("");
  const [frequencia, setFrequencia] = useState("única");
  const [categoria, setCategoria] = useState("");
  const [detalhesItem, setDetalhesItem] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [popupAtivo, setPopupAtivo] = useState(false);

  const handleValorChange = (e) => {
    let digits = e.target.value.replace(/\D/g, "");
    if (!digits) {
      setValor("");
      return;
    }
    const num = (Number(digits) / 100).toFixed(2);
    const [inteiro, centavos] = num.split(".");
    const inteiroFmt = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    setValor(`R$ ${inteiroFmt},${centavos}`);
  };

  const abrirPopup = (e) => {
    e.preventDefault();

    const temDinheiro = valor.trim() !== "";
    const temItem = categoria && detalhesItem.trim() !== "";

    if (!nome || !email) {
      alert("Preencha nome e e-mail.");
      return;
    }

    if (!temDinheiro && !temItem) {
      alert("Informe um valor em dinheiro ou descreva o item a doar.");
      return;
    }

    setPopupAtivo(true);
  };

  const confirmarEnvio = async () => {
    try {
      const payload = {
        nome,
        email,
        dataCadastro: serverTimestamp(),
      };

      if (valor.trim()) {
        payload.doacaoDinheiro = { valor, frequencia };
      }
      if (categoria && detalhesItem.trim()) {
        payload.doacaoItens = { categoria, detalhes: detalhesItem };
      }
      if (mensagem.trim()) payload.mensagem = mensagem.trim();

      await addDoc(collection(db, "doacoes"), payload);

      alert("✅ Obrigado! Sua doação foi registrada.");
      setPopupAtivo(false);

      setNome("");
      setEmail("");
      setValor("");
      setFrequencia("única");
      setCategoria("");
      setDetalhesItem("");
      setMensagem("");
    } catch (err) {
      console.error(err);
      alert("❌ Ocorreu um erro ao enviar sua doação. Tente novamente.");
    }
  };

  return (
    <main
      className="doe-page"
      role="main"
      aria-labelledby="titulo-doe"
    >
      <div className="doe-container">
        <div className="doe-box">
          <h2 id="titulo-doe">Doe e ajude nossos gatos 🐾</h2>

          <p id="texto-intro">
            Sua contribuição ajuda a garantir alimentação, cuidados veterinários e abrigo
            para dezenas de gatos resgatados. Cada doação faz a diferença!
          </p>

          <form className="doe-form" onSubmit={abrirPopup} aria-describedby="texto-intro">

            {/* Nome e email */}
            <div className="grid-2">
              <label htmlFor="nome" className="sr-only">Nome completo</label>
              <input
                id="nome"
                type="text"
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                aria-required="true"
              />

              <label htmlFor="email" className="sr-only">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
              />
            </div>

            {/* Dinheiro */}
            <h3 className="sec-title">💰 Doação em dinheiro</h3>

            <div className="grid-2">
              <label htmlFor="valor" className="sr-only">Valor da doação</label>
              <input
                id="valor"
                type="text"
                placeholder="R$ 00,00"
                value={valor}
                onChange={handleValorChange}
                inputMode="numeric"
                aria-label="Valor em reais"
              />

              <label htmlFor="frequencia" className="sr-only">Frequência</label>
              <select
                id="frequencia"
                value={frequencia}
                onChange={(e) => setFrequencia(e.target.value)}
              >
                <option value="única">Única</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="anual">Anual</option>
              </select>
            </div>

            {/* Itens */}
            <h3 className="sec-title">📦 Doação de materiais ou alimentos</h3>

            <div className="grid-2">
              <label htmlFor="categoria" className="sr-only">Categoria da doação</label>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                aria-label="Selecione o tipo de item"
              >
                <option value="">Selecione o tipo</option>
                <option value="alimentos">Alimentos</option>
                <option value="materiais">Materiais</option>
              </select>

              <div className="col-with-help">
                <span className="help-text" id="ajuda-itens">
                  Por favor, descreva qual será o material ou alimento, peso ou quantidade.
                </span>

                <label htmlFor="detalhesItem" className="sr-only">Descrição do item</label>
                <input
                  id="detalhesItem"
                  type="text"
                  placeholder="Ex.: 2 kg de ração | 3 sachês | 2 cobertores..."
                  value={detalhesItem}
                  onChange={(e) => setDetalhesItem(e.target.value)}
                  aria-describedby="ajuda-itens"
                />
              </div>
            </div>

            <label htmlFor="mensagem" className="sr-only">Mensagem opcional</label>
            <textarea
              id="mensagem"
              placeholder="Mensagem (opcional)"
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            ></textarea>

            <button type="submit" className="btn-enviar">
              Ir para pagamento
            </button>
          </form>
        </div>
      </div>

      {/* POPUP */}
      {popupAtivo && (
        <div className="popup-bg">
          <div
            className="popup-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-pagamento"
          >
            <button
              className="popup-close"
              aria-label="Fechar janela de pagamento"
              onClick={() => setPopupAtivo(false)}
            >
              ×
            </button>

            <h3 id="titulo-pagamento">Pagamento da Doação</h3>

            <div className="pagamento-form">
              <div className="campo">
                <label htmlFor="cartaoNome">Nome no cartão</label>
                <input id="cartaoNome" type="text" placeholder="Nome impresso" />
              </div>

              <div className="campo">
                <label htmlFor="cartaoNumero">Número do cartão</label>
                <input id="cartaoNumero" type="text" maxLength="19" placeholder="0000 0000 0000 0000" />
              </div>

              <div className="linha-dupla">
                <div className="campo">
                  <label htmlFor="cartaoValidade">Validade</label>
                  <input id="cartaoValidade" type="text" maxLength="5" placeholder="MM/AA" />
                </div>

                <div className="campo">
                  <label htmlFor="cartaoCVV">CVV</label>
                  <input id="cartaoCVV" type="text" maxLength="3" placeholder="123" />
                </div>
              </div>
            </div>

            <button className="btn-confirmar" onClick={confirmarEnvio}>
              Confirmar pagamento
            </button>

            <button className="btn-cancelar" onClick={() => setPopupAtivo(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
