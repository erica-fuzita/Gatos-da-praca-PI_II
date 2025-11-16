import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Gatos.css";

export default function EditarGato() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [sexo, setSexo] = useState("macho");
  const [idade, setIdade] = useState("jovem");
  const [castrado, setCastrado] = useState("true");
  const [statusAdocao, setStatusAdocao] = useState("Disponível");
  const [imagemUrl, setImagemUrl] = useState("");
  const [descricao, setDescricao] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [tipoMensagem, setTipoMensagem] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    async function carregarGato() {
      try {
        const ref = doc(db, "gatos", id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          setTipoMensagem("erro");
          setMensagem("Gato não encontrado.");
          setCarregando(false);
          return;
        }
        const dados = snap.data();
        setNome(dados.nome || "");
        setSexo(dados.sexo || "macho");
        setIdade(dados.idade || "jovem");
        setCastrado(dados.Castrado ? "true" : "false");
        setStatusAdocao(dados.status_adocao || "Disponível");
        setImagemUrl(dados.imagem_url || "");
        setDescricao(dados.descricao || "");
      } catch (err) {
        console.error(err);
        setTipoMensagem("erro");
        setMensagem("Erro ao carregar dados do gato.");
      } finally {
        setCarregando(false);
      }
    }

    carregarGato();
  }, [id]);

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
      await updateDoc(doc(db, "gatos", id), {
        nome,
        sexo,
        idade,
        Castrado: castrado === "true",
        status_adocao: statusAdocao,
        imagem_url: imagemUrl,
        descricao,
      });

      setTipoMensagem("sucesso");
      setMensagem("Gato atualizado com sucesso!");

      setTimeout(() => {
        navigate("/dashboard/gatos");
      }, 1000);
    } catch (err) {
      console.error(err);
      setTipoMensagem("erro");
      setMensagem("Erro ao atualizar gato.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <div className="gatos-page">Carregando dados...</div>;
  }

  return (
    <div className="gatos-page">
      <div className="gatos-header">
        <h1>Editar gato</h1>
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
            {salvando ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
