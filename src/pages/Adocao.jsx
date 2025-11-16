import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs
} from "firebase/firestore";

import SolicitarAdocaoModal from "../components/SolicitarAdocaoModal";

import "./Adocao.css";

export default function Adocao() {
  const [gatos, setGatos] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtrados, setFiltrados] = useState([]);

  const [modalAberto, setModalAberto] = useState(false);
  const [gatoSelecionado, setGatoSelecionado] = useState(null);

  // 🔹 Abrir modal
  function abrirModalAdocao(gato) {
    setGatoSelecionado(gato);
    setModalAberto(true);
  }

  function fecharModalAdocao() {
    setModalAberto(false);
    setGatoSelecionado(null);
  }

  // 🔹 Carregar gatos do Firestore
  useEffect(() => {
    const carregarGatos = async () => {
      try {
        const ref = collection(db, "gatos");
        const snapshot = await getDocs(ref);

        const lista = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((gato) => gato.nome && gato.nome.toLowerCase() !== "gato anonimo");

        setGatos(lista);
        setFiltrados(lista);

      } catch (err) {
        console.error("Erro ao carregar gatos:", err);
      }
    };

    carregarGatos();
  }, []);

  // 🔍 Pesquisa
  const handleSearch = (e) => {
    e.preventDefault();

    const termo = busca.toLowerCase();
    const filtrados = gatos.filter(
      (gato) =>
        gato.nome?.toLowerCase().includes(termo) ||
        gato.descricao?.toLowerCase().includes(termo)
    );

    setFiltrados(filtrados);
  };

  return (
    <div className="adocao-container">

      {/* --- BANNER --- */}
      <div className="adocao-banner">
        <img
          src={`${import.meta.env.BASE_URL}banners/BG-03.png`}
          alt="gato preto e gato malhado"
        />
      </div>

      {/* --- PESQUISA --- */}
      <form className="barra-pesquisa" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nome ou característica..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </form>

      {/* --- LISTAGEM DE GATOS --- */}
      <div className="cards-container">
        {filtrados.length > 0 ? (
          filtrados.map((gato) => (
            <div
              key={gato.id}
              className={`card-gato ${gato.status_adocao === "Adotado" ? "adotado" : ""}`}
            >

              {/* IMAGEM */}
              <div className="img-wrapper">
                <img
                  src={gato.imagem_url || "/banners/gato-padrao.jpg"}
                  alt={gato.nome}
                  onError={(e) => (e.target.src = "/banners/gato-padrao.jpg")}
                />

                {gato.status_adocao === "Adotado" && (
                  <div className="overlay-adotado">Adotado 🐾</div>
                )}
              </div>

              {/* NOME */}
              <h3 className="nome-gato">{gato.nome}</h3>

              <hr className="card-divider" />

              {/* INFORMAÇÕES */}
              <div className="info-grid">
                <div className="info-item">
                  <strong>Sexo:</strong><span>{gato.sexo}</span>
                </div>
                <div className="info-item">
                  <strong>Idade:</strong><span>{gato.idade}</span>
                </div>
                <div className="info-item">
                  <strong>Castrado:</strong><span>{gato.Castrado ? "Sim" : "Não"}</span>
                </div>
                <div className="info-item">
                  <strong>Status:</strong><span>{gato.status_adocao}</span>
                </div>
              </div>

              <hr className="card-divider" />

              {/* DESCRIÇÃO */}
              <p className="descricao">{gato.descricao}</p>

              {/* BOTÃO ADOTAR */}
              <button
                className="btn-adotar"
                disabled={gato.status_adocao === "Adotado"}
                onClick={() => abrirModalAdocao(gato)}
              >
                {gato.status_adocao === "Adotado" ? "Indisponível" : "Quero Adotar"}
              </button>

            </div>
          ))
        ) : (
          <p className="nenhum-resultado">Nenhum gato encontrado 😿</p>
        )}
      </div>

      {/* --- MODAL DE ADOÇÃO --- */}
      {modalAberto && (
        <SolicitarAdocaoModal
          gato={gatoSelecionado}
          aberto={modalAberto}
          fechar={fecharModalAdocao}
        />
      )}

    </div>
  );
}
