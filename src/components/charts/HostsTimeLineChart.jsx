import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function HostsTimelineChart({ hosts = [] }) {
  // Formateo de fechas (YYYY-MM-DD)
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    if (isNaN(d)) return "Fecha inválida";
    return d.toISOString().split("T")[0];
  };

  // Procesar escaneos por día
  const aggregated = hosts
    .map((h) => ({
      date: formatDate(h.scan_date),
      scans: 1,
    }))
    .reduce((acc, curr) => {
      const existing = acc.find((x) => x.date === curr.date);
      if (existing) existing.scans += 1;
      else acc.push(curr);
      return acc;
    }, []);

  // Ordenar cronológicamente
  const data = aggregated.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="card bg-dark p-3 shadow-sm h-100">
      <h5 className="text-center mb-3">
        <i className="bi bi-activity text-warning me-2" /> Actividad Reciente
      </h5>

      {data.length === 0 ? (
        <p className="text-muted text-center mb-0">Sin datos de escaneos</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />

            <XAxis
              dataKey="date"
              stroke="#ccc"
              tick={{ fill: "#aaa" }}
              angle={-30}
              textAnchor="end"
              height={60}
            />

            <YAxis stroke="#ccc" tick={{ fill: "#aaa" }} />

            <Tooltip
              contentStyle={{ background: "#222", border: "1px solid #555" }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`${value} escaneos`, "Escaneos"]}
            />

            <Line
              type="monotone"
              dataKey="scans"
              stroke="#ffcc00"
              strokeWidth={3}
              dot={{ r: 4, stroke: "#ffcc00", strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}


