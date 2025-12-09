import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

/* ======================
   EXPORTAR A EXCEL
====================== */
export function exportExcel(data, fileName = "export.xlsx") {
  if (!data || data.length === 0) return alert("No hay datos para exportar");

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  XLSX.writeFile(workbook, fileName);
}


/* ======================
   EXPORTAR A PDF
====================== */
export function exportPDF(data, title = "Reporte") {
  if (!data || data.length === 0) return alert("No hay datos para exportar");

  const doc = new jsPDF("p", "pt");

  doc.setFontSize(18);
  doc.text(title, 40, 40);

  const headers = Object.keys(data[0]).map((h) => ({ title: h, dataKey: h }));

  doc.autoTable({
    head: [headers.map((h) => h.title)],
    body: data.map((row) => Object.values(row)),
    startY: 70,
    theme: "grid",
    styles: { fontSize: 9 },
    headStyles: { fillColor: [52, 58, 64] },
  });

  doc.save(`${title}.pdf`);
}
