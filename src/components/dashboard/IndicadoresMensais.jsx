import "./IndicadoresMensais.css";
import { TrendingUp, CalendarDays, PawPrint, Cat } from "lucide-react";

export default function IndicadoresMensais() {
  const indicadores = [
    {
      icon: <PawPrint />,
      titulo: "Adoções no mês",
      valor: 2,
      cor: "#2e4932",
    },
    {
      icon: <CalendarDays />,
      titulo: "Solicitações no mês",
      valor: 4,
      cor: "#e39622",
    },
    {
      icon: <TrendingUp />,
      titulo: "Taxa de adoção",
      valor: "50%",
      cor: "#2e4932",
    },
    {
      icon: <Cat />,
      titulo: "Novos gatos cadastrados",
      valor: 1,
      cor: "#3b5d40",
    },
  ];

  return (
    <div className="indicadores-grid">
      {indicadores.map((item, i) => (
        <div className="indicador-card" key={i}>
          <div className="icon" style={{ color: item.cor }}>
            {item.icon}
          </div>
          <p className="titulo">{item.titulo}</p>
          <p className="valor">{item.valor}</p>
        </div>
      ))}
    </div>
  );
}
