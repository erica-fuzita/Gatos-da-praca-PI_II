import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

import DashboardSection from "../../components/dashboard/DashboardSection";
import CardsResumo from "../../components/dashboard/CardsResumo";
import GraficoPizza from "../../components/dashboard/GraficoPizza";
import GraficoLinha from "../../components/dashboard/GraficoLinha";
import IndicadoresMensais from "../../components/dashboard/IndicadoresMensais";

export default function DashboardHome() {
  const [gatos, setGatos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [voluntarios, setVoluntarios] = useState([]);

  useEffect(() => {
    async function carregar() {
      const snapGatos = await getDocs(collection(db, "gatos"));
      setGatos(snapGatos.docs.map((d) => ({ id: d.id, ...d.data() })));

      const snapSolic = await getDocs(collection(db, "adocao-solicitacoes"));
      setSolicitacoes(snapSolic.docs.map((d) => ({ id: d.id, ...d.data() })));

      const snapVol = await getDocs(collection(db, "voluntarios"));
      setVoluntarios(snapVol.docs.map((d) => ({ id: d.id, ...d.data() })));
    }
    carregar();
  }, []);

  const total = gatos.length;
  const adotados = gatos.filter((g) => g.status_adocao === "Adotado").length;
  const disponiveis = total - adotados;

  return (
    <div>
      {/* VISÃO GERAL */}
      <DashboardSection title="📌 Visão Geral">
        <CardsResumo
          dados={{
            totalGatos: total,
            disponiveis,
            adotados,
            solicitacoes: solicitacoes.length,
            voluntarios: voluntarios.length,
          }}
        />
      </DashboardSection>

      {/* DISTRIBUIÇÃO */}
      <DashboardSection title="📊 Distribuição dos Gatos">
        <GraficoPizza disponiveis={disponiveis} adotados={adotados} />
      </DashboardSection>

      {/* LINHA DO TEMPO */}
      <DashboardSection title="📈 Evolução das Adoções (Histórico Fictício)">
        <GraficoLinha />
      </DashboardSection>

      {/* INDICADORES MENSAIS */}
      <DashboardSection title="📅 Indicadores Mensais">
        <IndicadoresMensais />
      </DashboardSection>
    </div>
  );
}
