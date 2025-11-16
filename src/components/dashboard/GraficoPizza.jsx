import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function GraficoPizza({ disponiveis, adotados }) {
  const dados = [
    { name: "Disponíveis", value: disponiveis },
    { name: "Adotados", value: adotados },
  ];

  const cores = ["#2e4932", "#e39622"];

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={dados}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label
          >
            {dados.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={cores[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
