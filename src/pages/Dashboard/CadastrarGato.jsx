import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Gatos.css";

export default function CadastrarGato() {
  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("macho");
  const [idade, setIdade] = useState("jovem");
  const [castrado, setCastrado] = useState("true"); // string, vamos converter
  const [statusAdocao, setStatusAdocao] = useState("Disponível");
  const [imagemUrl, setImagemUrl] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem("");
    setTipoMensagem("");

    if (!nome || !imagemUrl || !descricao) {
      setTipoMensagem("erro");
      setMensagem("Preencha pelo menos nome, URL da imagem e descrição.");
      return;
    }

    try {
      setSalvando(true);
      await addDoc(collection(db, "gatos"), {
        nome,
        sexo,
        idade,
        Castrado: castrado === "true",
        status_adocao: statusAdocao,
        imagem_url: imagemUrl,
        descricao,
        dataCadastro: serverTimestamp(),
      });

      setTipoMensagem("sucesso");
      setMensagem("Gato cadastrado com sucesso!");

      setTimeout(() => {
        navigate("/dashboard/gatos");
      }, 1000);
    } catch (err) {
      console.error(err);
      setTipoMensagem("erro");
      setMensagem("Erro ao cadastrar gato.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="gatos-page">
      <div className="gatos-header">
        <h1>Cadastrar novo gato</h1>
      </div>

      {mensagem && (
        <div className={`msg-${tipoMensagem}`}>{mensagem}</div>
      )}

      <form className="form-gato" onSubmit={handleSubmit}>
        <div className="campo-linha">
          <div className="campo">
            <label>Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="campo">
            <label>Sexo</label>
            <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
              <option value="macho">macho</option>
              <option value="fêmea">fêmea</option>
            </select>
          </div>

          <div className="campo">
            <label>Idade</label>
            <select value={idade} onChange={(e) => setIdade(e.target.value)}>
              <option value="filhote">filhote</option>
              <option value="jovem">jovem</option>
              <option value="adulto">adulto</option>
              <option value="idoso">idoso</option>
            </select>
          </div>
        </div>

        <div className="campo-linha">
          <div className="campo">
            <label>Castrado</label>
            <select
              value={castrado}
              onChange={(e) => setCastrado(e.target.value)}
            >
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>

          <div className="campo">
            <label>Status de adoção</label>
            <select
              value={statusAdocao}
              onChange={(e) => setStatusAdocao(e.target.value)}
            >
              <option value="Disponível">Disponível</option>
              <option value="Adotado">Adotado</option>
            </select>
          </div>

          <div className="campo">
            <label>URL da imagem</label>
            <input
              type="text"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>

        <div className="campo">
          <label>Descrição</label>
          <textarea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>

        <div className="acoes-form">
          <button
            type="button"
            className="btn-secundario"
            onClick={() => navigate("/dashboard/gatos")}
          >
            Voltar
          </button>

          <button type="submit" className="btn-primario" disabled={salvando}>
            {salvando ? "Salvando..." : "Cadastrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
