// src/ListaGatos.jsx
console.log("🐾 ListaGatos.jsx foi carregado!");
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

function ListaGatos() {
  const [gatos, setGatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    const buscarGatos = async () => {
      console.log("🟢 Iniciando busca de dados...");
      try {
        const gatosCollectionRef = collection(db, "gatos");
        const snapshot = await getDocs(gatosCollectionRef);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log("✅ Dados recebidos:", lista);
        setGatos(lista);
      } catch (err) {
        console.error("❌ ERRO ao buscar Firestore:", err);
        setErro("Erro ao carregar dados. Verifique o console ou permissões.");
      } finally {
        setLoading(false);
      }
    };

    buscarGatos();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Carregando gatos...</p>;
  if (erro) return <p style={{ color: "red", textAlign: "center" }}>{erro}</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
      {gatos.length > 0 ? (
        gatos.map((gato) => (
          <div
            key={gato.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "10px",
              width: "220px",
              textAlign: "center",
              backgroundColor: "#fff"
            }}
          >
            <img
              src={gato.imagem_url || "https://placekitten.com/200/200"}
              alt={`Gato ${gato.nome}`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
            <h3>{gato.nome || "Sem nome"}</h3>
            <p>Sexo: {gato.sexo || "Não informado"}</p>
            <p>Idade: {gato.idade || "Desconhecida"}</p>
            <p>{gato.descricao || "Sem descrição."}</p>
            <p>Castrado: {gato.castrado ? "Sim ✅" : "Não ❌"}</p>
            <p>Status: {gato.status_adocao || "Disponível"}</p>
          </div>
        ))
      ) : (
        <p>Nenhum gato disponível no momento 😿</p>
      )}
    </div>
  );
}

export default ListaGatos;
