import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./Gatos.css";

export default function GatosLista() {
  const [gatos, setGatos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function carregarGatos() {
    try {
      setCarregando(true);
      const ref = collection(db, "gatos");
      const snap = await getDocs(ref);
      const lista = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGatos(lista);
    } catch (e) {
      console.error(e);
      setErro("Erro ao carregar gatos.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarGatos();
  }, []);

  async function handleExcluir(id, nome) {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o gato "${nome}"?`
    );
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, "gatos", id));
      setGatos((prev) => prev.filter((g) => g.id !== id));
    } catch (e) {
      console.error(e);
      setErro("Erro ao excluir gato.");
    }
  }

  if (carregando) {
    return <div className="gatos-page">Carregando gatos...</div>;
  }

  return (
    <div className="gatos-page">
      <div className="gatos-header">
        <h1 id="titulo-gatos">Gatos cadastrados</h1>

        <button
          onClick={() => navigate("/dashboard/gatos/novo")}
          className="btn-primario"
          aria-label="Cadastrar um novo gato"
        >
          + Novo gato
        </button>
      </div>

      {erro && <div className="msg-erro" role="alert">{erro}</div>}

      {gatos.length === 0 ? (
        <p role="status">Nenhum gato cadastrado ainda.</p>
      ) : (
        <div className="tabela-container">
          <table
            className="tabela-gatos"
            aria-labelledby="titulo-gatos"
            role="table"
          >
            <thead>
              <tr>
                <th scope="col">Foto</th>
                <th scope="col">Nome</th>
                <th scope="col">Sexo</th>
                <th scope="col">Idade</th>
                <th scope="col">Castrado</th>
                <th scope="col">Status adoção</th>
                <th scope="col">Ações</th>
              </tr>
            </thead>

            <tbody>
              {gatos.map((gato) => (
                <tr key={gato.id}>
                  <td>
                    {gato.imagem_url ? (
                      <img
                        src={gato.imagem_url}
                        alt={`Foto do gato ${gato.nome}`}
                        className="thumb-gato"
                      />
                    ) : (
                      <span aria-hidden="true">-</span>
                    )}
                  </td>

                  <td>{gato.nome}</td>
                  <td>{gato.sexo}</td>
                  <td>{gato.idade}</td>
                  <td>{gato.Castrado ? "Sim" : "Não"}</td>
                  <td>{gato.status_adocao}</td>

                  <td className="col-acoes">
                    <button
                      className="btn-menor"
                      onClick={() =>
                        navigate(`/dashboard/gatos/editar/${gato.id}`)
                      }
                      aria-label={`Editar informações do gato ${gato.nome}`}
                    >
                      Editar
                    </button>

                    <button
                      className="btn-menor btn-perigo"
                      onClick={() => handleExcluir(gato.id, gato.nome)}
                      aria-label={`Excluir o gato ${gato.nome}`}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
