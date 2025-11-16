// src/pages/SejaVoluntario.jsx
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import "./SejaVoluntario.css";

export default function SejaVoluntario() {
  const [diasAberto, setDiasAberto] = useState(false);
  const [horasAberto, setHorasAberto] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    complemento: "",
    dias: "",
    outrosDias: "",
    horas: "",
  });

  const [popupAtivo, setPopupAtivo] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopupAtivo(true);
  };

  const confirmarEnvio = async () => {
    try {
      await addDoc(collection(db, "voluntarios"), {
        ...formData,
        dataCadastro: serverTimestamp(),
      });
      setPopupAtivo(false);
      alert("✅ Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("❌ Ocorreu um erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <main
      className="voluntario-container"
      role="main"
      aria-labelledby="titulo-voluntario"
    >
      <form
        className="voluntario-form"
        onSubmit={handleSubmit}
        aria-describedby="texto-intro"
      >
        {/* INTRO */}
        <div className="voluntario-intro">
          <h2 id="titulo-voluntario">Seja um voluntário 💚</h2>

          <p id="texto-intro">
            Cadastre-se para fazer parte do nosso projeto — aqui você pode
            ajudar de várias maneiras. Toda ajuda é bem-vinda, e nossos
            gatinhos agradecem seu carinho!
          </p>
        </div>

        {/* DADOS PESSOAIS */}
        <div className="input-group">
          <label className="sr-only" htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            type="text"
            name="nome"
            placeholder="Nome completo"
            onChange={handleChange}
            required
            aria-required="true"
          />

          <label className="sr-only" htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="E-mail"
            onChange={handleChange}
            required
            aria-required="true"
          />

          <label className="sr-only" htmlFor="telefone">Telefone</label>
          <input
            id="telefone"
            type="tel"
            name="telefone"
            placeholder="Telefone"
            onChange={handleChange}
            required
            aria-required="true"
          />
        </div>

        {/* ENDEREÇO */}
        <div className="input-group">
          <label className="sr-only" htmlFor="rua">Rua</label>
          <input id="rua" type="text" name="rua" placeholder="Rua" onChange={handleChange} />

          <label className="sr-only" htmlFor="numero">Número</label>
          <input id="numero" type="text" name="numero" placeholder="Número" onChange={handleChange} />

          <label className="sr-only" htmlFor="bairro">Bairro</label>
          <input id="bairro" type="text" name="bairro" placeholder="Bairro" onChange={handleChange} />

          <label className="sr-only" htmlFor="cidade">Cidade</label>
          <input id="cidade" type="text" name="cidade" placeholder="Cidade" onChange={handleChange} />

          <label className="sr-only" htmlFor="complemento">Complemento</label>
          <input id="complemento" type="text" name="complemento" placeholder="Complemento" onChange={handleChange} />
        </div>

        {/* MENU DIAS */}
        <div className="menu-expansivel">
          <button
            type="button"
            className="menu-titulo"
            aria-expanded={diasAberto}
            aria-controls="dias-opcoes"
            onClick={() => setDiasAberto(!diasAberto)}
          >
            Dias de voluntariado ⏷
          </button>

          {diasAberto && (
            <div className="menu-opcoes" id="dias-opcoes">
              <label>
                <input
                  type="radio"
                  name="dias"
                  value="Segunda, Quarta e Sexta"
                  onChange={handleChange}
                />
                <span>Segunda, Quarta e Sexta</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="dias"
                  value="Terça e Quinta"
                  onChange={handleChange}
                />
                <span>Terça e Quinta</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="dias"
                  value="Sábado e Domingo"
                  onChange={handleChange}
                />
                <span>Sábado e Domingo</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="dias"
                  value="De Segunda a Sexta"
                  onChange={handleChange}
                />
                <span>De Segunda a Sexta</span>
              </label>

              <textarea
                name="outrosDias"
                placeholder="Outros..."
                aria-label="Outros dias de disponibilidade"
                onChange={handleChange}
              ></textarea>
            </div>
          )}
        </div>

        {/* MENU HORAS */}
        <div className="menu-expansivel">
          <button
            type="button"
            className="menu-titulo"
            aria-expanded={horasAberto}
            aria-controls="horas-opcoes"
            onClick={() => setHorasAberto(!horasAberto)}
          >
            Horas de voluntariado ⏷
          </button>

          {horasAberto && (
            <div className="menu-opcoes" id="horas-opcoes">
              <label>
                <input
                  type="radio"
                  name="horas"
                  value="1 hora por dia"
                  onChange={handleChange}
                />
                <span>1 hora por dia</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="horas"
                  value="2 horas por dia"
                  onChange={handleChange}
                />
                <span>2 horas por dia</span>
              </label>

              <label>
                <input
                  type="radio"
                  name="horas"
                  value="Acima de 2 horas"
                  onChange={handleChange}
                />
                <span>Acima de 2 horas</span>
              </label>
            </div>
          )}
        </div>

        {/* AVISO */}
        <p className="voluntario-aviso">
          Caso não tenha conseguido encontrar opções adequadas a você, entre em
          contato pela página <a href="/contatos">Contatos</a>.
        </p>

        {/* BOTÃO */}
        <button type="submit" className="btn-cadastrar">
          Cadastre
        </button>
      </form>

      {popupAtivo && (
        <div className="popup" role="dialog" aria-modal="true">
          <div className="popup-content">
            <h3>Confirmar cadastro?</h3>
            <div className="popup-botoes">
              <button type="button" onClick={confirmarEnvio}>
                Sim
              </button>
              <button type="button" onClick={() => setPopupAtivo(false)}>
                Não
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
