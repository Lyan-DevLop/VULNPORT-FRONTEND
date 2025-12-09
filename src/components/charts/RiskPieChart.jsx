import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const COLORS = {
  low: "#0dcaf0",     // Azul
  medium: "#ffcc00",  // Amarillo
  high: "#ff4c4c",    // Rojo
};

export default function RiskPieChart({ hosts = [] }) {
  const low = hosts.filter((h) => h.high_risk_count === 0).length;
  const medium = hosts.filter((h) => h.high_risk_count === 1).length;
  const high = hosts.filter((h) => h.high_risk_count >= 2).length;

  const total = hosts.length || 1; // Evitar división por 0

  const data = [
    { name: "Bajo", value: low, color: COLORS.low },
    { name: "Medio", value: medium, color: COLORS.medium },
    { name: "Alto", value: high, color: COLORS.high },
  ];

  const formatterPercent = (value) =>
    ((value / total) * 100).toFixed(1) + "%";

  return (
    <div className="card bg-dark p-3 shadow-sm h-100">
      <h5 className="text-center mb-3">
        <i className="bi bi-shield-lock text-danger me-2"></i>
        Nivel de Riesgo
      </h5>

      {hosts.length === 0 ? (
        <p className="text-muted text-center mb-0">Sin datos de hosts</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={85}
                dataKey="value"
                label={({ name, value }) =>
                  value > 0 ? `${name} (${formatterPercent(value)})` : ""
                }
                labelStyle={{ fill: "#fff" }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.color}
                    stroke="#111"
                    strokeWidth={1}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{ background: "#222", border: "1px solid #555" }}
                labelStyle={{ color: "#fff" }}
                formatter={(value, name) => [
                  `${value} host(s) — ${formatterPercent(value)}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Leyenda personalizada */}
          <div className="mt-3">
            {data.map((item, i) => (
              <div
                key={i}
                className="d-flex align-items-center mb-1"
                style={{ fontSize: "0.9rem" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 14,
                    background: item.color,
                    borderRadius: 3,
                    marginRight: 8,
                  }}
                />
                <span className="text-white me-2">{item.name}:</span>
                <span className="text-info me-2">{item.value}</span>
                <span className="text-muted">
                  ({formatterPercent(item.value)})
                </span>
              </div>
            ))}
          </div>

          {/* Mensaje cuando todos son nivel bajo */}
          {high === 0 && medium === 0 && (
            <p className="text-success text-center mt-2 fw-bold">
              ✔ Todos los hosts están libres de riesgos altos
            </p>
          )}
        </>
      )}
    </div>
  );
}
