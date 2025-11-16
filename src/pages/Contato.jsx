import React, { useState } from "react";
import "./Contato.css";

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    mensagem: "",
  });

  const [popup, setPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPopup(true);
    setFormData({ nome: "", email: "", telefone: "", mensagem: "" });
  };

  return (
    <section
      className="contato-wrapper"
      aria-labelledby="titulo-contato"
    >
      <div className="contato-container">

        <form
          className="form-contato"
          onSubmit={handleSubmit}
          aria-describedby="descricao-contato"
        >
          <div className="contato-intro">
            <h2 id="titulo-contato">Fale Conosco</h2>
            <p id="descricao-contato">
              Envie suas dúvidas que entraremos em contato por e-mail com você!
            </p>
          </div>

          {/* LABELS INVISÍVEIS PARA ACESSIBILIDADE */}
          <label htmlFor="nome" className="sr-only">Nome completo</label>
          <input
            id="nome"
            type="text"
            name="nome"
            placeholder="Nome completo"
            value={formData.nome}
            onChange={handleChange}
            required
            aria-required="true"
          />

          <label htmlFor="email" className="sr-only">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
            aria-required="true"
          />

          <label htmlFor="telefone" className="sr-only">Telefone (opcional)</label>
          <input
            id="telefone"
            type="tel"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
          />

          <label htmlFor="mensagem" className="sr-only">Mensagem</label>
          <textarea
            id="mensagem"
            name="mensagem"
            placeholder="Escreva sua mensagem..."
            value={formData.mensagem}
            onChange={handleChange}
            rows="5"
            required
            aria-required="true"
          ></textarea>

          <button type="submit">
            Enviar
          </button>
        </form>
      </div>

      {/* POPUP ACESSÍVEL */}
      {popup && (
        <div
          className="popup-bg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="popup-titulo"
        >
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
            tabIndex="-1"
          >
            <div className="popup-header">
              <img
                src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
                alt="Ícone de mensagem enviada"
                className="popup-icon"
              />
              <h3 id="popup-titulo">Mensagem enviada!</h3>
            </div>

            <div className="popup-text">
              <p>Obrigado por entrar em contato.</p>
              <p>Nossa equipe responderá por e-mail em breve.</p>
            </div>

            <button
              className="btn-fechar"
              onClick={() => setPopup(false)}
              aria-label="Fechar mensagem"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
