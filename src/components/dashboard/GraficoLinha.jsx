import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function GraficoLinha() {
  const historicoFake = [
    { mes: "Jan", adotados: 3 },
    { mes: "Fev", adotados: 1 },
    { mes: "Mar", adotados: 5 },
    { mes: "Abr", adotados: 2 },
  ];

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <LineChart data={historicoFake}>
          {/* GRID MAIS VISÍVEL */}
          <CartesianGrid stroke="#98b89a" strokeDasharray="3 3" />

          {/* EIXOS */}
          <XAxis dataKey="mes" />
          <YAxis />

          {/* TOOLTIP */}
          <Tooltip />

          {/* LINHA */}
          <Line
            type="monotone"
            dataKey="adotados"
            stroke="#2e4932"
            strokeWidth={3}
            dot={{ r: 6, fill: "#e39622" }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
