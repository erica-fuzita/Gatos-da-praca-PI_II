// src/pages/Dashboard/GatoPopup.jsx
import { useEffect, useState } from "react";
import "./GatoAdmin.css";

export default function GatoPopup({ gato, onClose, onSave, onDelete }) {
  const [form, setForm] = useState({
    id: gato.id,
    nome: "",
    sexo: "",
    idade: "",
    castrado: false,
    status_adocao: "",
    descricao: "",
    imagem_url: "",
  });

  useEffect(() => {
    if (gato) {
      setForm({
        id: gato.id,
        nome: gato.nome || "",
        sexo: gato.sexo || "",
        idade: gato.idade || "",
        castrado: !!gato.castrado,
        status_adocao: gato.status_adocao || "",
        descricao: gato.descricao || "",
        imagem_url: gato.imagem_url || gato.imagemUrl || "",
      });
    }
  }, [gato]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "castrado") {
      setForm((prev) => ({ ...prev, castrado: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="gato-popup-overlay">
      <div className="gato-popup-card">
        {/* HEADER */}
        <div className="gato-popup-header">
          <h2>Editar gato</h2>
          <button className="gato-popup-close" onClick={handleCloseClick}>
            ✕
          </button>
        </div>

        {/* CONTEÚDO SUPERIOR: FOTO + DADOS DO GATO */}
        <div className="gato-popup-top">
          <div className="gato-popup-foto-wrapper">
            <div className="gato-popup-foto-quadrado">
              <img
                src={
                  form.imagem_url ||
                  "/banners/gato-padrao.jpg"
                }
                alt={form.nome || "Gato"}
                onError={(e) => {
                  e.target.src = "/banners/gato-padrao.jpg";
                }}
              />
            </div>
          </div>

          <div className="gato-popup-dados">
            <h3 className="gato-popup-nome">{form.nome || "Sem nome"}</h3>

            <p>
              <strong>Sexo:</strong> {form.sexo || "-"}
            </p>
            <p>
              <strong>Idade:</strong> {form.idade || "-"}
            </p>
            <p>
              <strong>Castrado:</strong> {form.castrado ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Status de adoção:</strong>{" "}
              {form.status_adocao || "-"}
            </p>
            <p className="gato-popup-descricao-resumo">
              <strong>Descrição:</strong>{" "}
              {form.descricao || "Sem descrição."}
            </p>
          </div>
        </div>

        {/* FORMULÁRIO DE EDIÇÃO (ABAIXO DA FOTO/DADOS) */}
        <form className="gato-popup-form" onSubmit={handleSubmit}>
          <div className="gato-popup-linha">
            <label>
              Nome
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
              />
            </label>
            <label>
              Sexo
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </label>
          </div>

          <div className="gato-popup-linha">
            <label>
              Idade
              <select
                name="idade"
                value={form.idade}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="Jovem">Jovem</option>
                <option value="Adulto">Adulto</option>
              </select>
            </label>

            <label className="gato-popup-checkbox">
              <input
                type="checkbox"
                name="castrado"
                checked={form.castrado}
                onChange={handleChange}
              />
              Castrado
            </label>
          </div>

          <div className="gato-popup-linha">
            <label>
              Status de adoção
              <select
                name="status_adocao"
                value={form.status_adocao}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="disponível">Disponível</option>
                <option value="indisponível">Indisponível</option>
                <option value="adotado">Adotado</option>
              </select>
            </label>
          </div>

          <label className="gato-popup-full">
            URL da imagem
            <input
              type="text"
              name="imagem_url"
              value={form.imagem_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <label className="gato-popup-full">
            Descrição
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              rows={4}
            />
          </label>

          <div className="gato-popup-botoes">
            <button type="submit" className="btn-salvar">
              Salvar
            </button>
            <button
              type="button"
              className="btn-excluir-popup"
              onClick={onDelete}
            >
              Excluir
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
