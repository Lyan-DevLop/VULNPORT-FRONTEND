import {
  downloadPDFLatest,
  downloadExcelLatest,
} from "../../api/reports.api";
import { useState } from "react";

export default function Reports() {
  const [loadingPDF, setLoadingPDF] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePDF = async () => {
    try {
      setLoadingPDF(true);
      const blob = await downloadPDFLatest();
      downloadBlob(blob, "vulnports_reporte.pdf");
    } catch (error) {
      console.error("Error descargando PDF:", error);
    } finally {
      setLoadingPDF(false);
    }
  };

  const handleExcel = async () => {
    try {
      setLoadingExcel(true);
      const blob = await downloadExcelLatest();
      downloadBlob(blob, "vulnports_reporte.xlsx");
    } catch (error) {
      console.error("Error descargando Excel:", error);
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <div className="container-fluid text-white mt-4">
      {/* TÍTULO */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          <i className="bi bi-clipboard-data text-info me-2"></i>
          Reportes del Sistema
        </h2>
        <p className="text-muted">
          Generá reportes avanzados de vulnerabilidades con un solo clic.
        </p>
      </div>

      <div className="row g-4">

        {/* CARD PDF */}
        <div className="col-md-6">
          <div
            className="card bg-dark border border-secondary shadow-lg p-4 h-100 position-relative"
            style={{ borderRadius: "12px" }}
          >
            {/* Icono grande decorativo */}
            <div
              className="position-absolute"
              style={{
                top: "-18px",
                right: "-18px",
                opacity: 0.07,
                fontSize: "9rem",
              }}
            >
              <i className="bi bi-filetype-pdf"></i>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="bg-danger bg-opacity-25 text-danger rounded p-3 me-3 shadow-sm">
                <i className="bi bi-filetype-pdf" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <div>
                <h4 className="m-0 fw-bold text-white">Reporte PDF</h4>
                <small className="text-muted">
                  Formato profesional listo para impresión
                </small>
              </div>
            </div>

            <p className="text-secondary mb-4">
              Incluye diagramas, tablas, métricas clave, hosts analizados, puertos,
              CVEs detectadas, análisis de riesgo y recomendaciones.
            </p>

            <button
              className="btn btn-outline-danger w-100 fw-bold py-2"
              onClick={handlePDF}
              disabled={loadingPDF}
            >
              {loadingPDF ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generando PDF...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-down-fill me-2"></i>
                  Descargar PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* CARD EXCEL */}
        <div className="col-md-6">
          <div
            className="card bg-dark border border-secondary shadow-lg p-4 h-100 position-relative"
            style={{ borderRadius: "12px" }}
          >
            {/* Icono decorativo */}
            <div
              className="position-absolute"
              style={{
                top: "-18px",
                right: "-18px",
                opacity: 0.06,
                fontSize: "9rem",
              }}
            >
              <i className="bi bi-file-earmark-spreadsheet"></i>
            </div>

            <div className="d-flex align-items-center mb-3">
              <div className="bg-success bg-opacity-25 text-success rounded p-3 me-3 shadow-sm">
                <i
                  className="bi bi-file-earmark-spreadsheet"
                  style={{ fontSize: "2.5rem" }}
                ></i>
              </div>
              <div>
                <h4 className="m-0 fw-bold text-white">Reporte Excel</h4>
                <small className="text-muted">
                  Formato ideal para analistas técnicos
                </small>
              </div>
            </div>

            <p className="text-secondary mb-4">
              Exporta listas completas: hosts, puertos, servicios detectados,
              vulnerabilidades, CVSS, estados y tendencias.
            </p>

            <button
              className="btn btn-outline-success w-100 fw-bold py-2"
              onClick={handleExcel}
              disabled={loadingExcel}
            >
              {loadingExcel ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generando Excel...
                </>
              ) : (
                <>
                  <i className="bi bi-cloud-arrow-down-fill me-2"></i>
                  Descargar Excel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

