import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function PortsBarChart({ hosts = [] }) {
  // Construcción del dataset
  const data = hosts
    .map((h) => ({
      name: h.ip_address,
      hostname: h.hostname,
      ports: h.total_ports || 0,
    }))
    .sort((a, b) => b.ports - a.ports); // ordenar por puertos

  const dynamicColor = (ports) => {
    if (ports >= 20) return "#ff4d4d"; // Crítico
    if (ports >= 10) return "#ffc107"; // Medio
    return "#0dcaf0"; // Bajo
  };

  return (
    <div className="card bg-dark p-3 shadow-sm h-100">
      <h5 className="text-center mb-3">
        <i className="bi bi-hdd-network text-info me-2"></i>
        Puertos Abiertos por Host
      </h5>

      {data.length === 0 ? (
        <p className="text-center text-muted mb-0">Sin datos disponibles</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis
              dataKey="name"
              stroke="#ccc"
              tick={{ fill: "#aaa", fontSize: 12 }}
              angle={-40}
              textAnchor="end"
              interval={0}
              height={60}
            />

            <YAxis
              stroke="#ccc"
              tick={{ fill: "#aaa", fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{ background: "#222", border: "1px solid #555" }}
              labelStyle={{ color: "#fff", fontWeight: "bold" }}
              formatter={(value, key, item) => {
                if (key === "ports") return [`${value} puertos abiertos`, "Puertos"];
                return value;
              }}
              labelFormatter={(label, items) => {
                const host = items?.[0]?.payload;
                return `${label} (${host.hostname || "Sin hostname"})`;
              }}
            />

            <Bar
              dataKey="ports"
              radius={[5, 5, 0, 0]}
              fill="#0dcaf0"
              // colorear cada barra según criticidad
              shape={(props) => {
                const { x, y, width, height, value } = props;
                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={dynamicColor(value)}
                    rx={4}
                    ry={4}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}


