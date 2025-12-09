import axiosClient from "./axiosClient";

export async function downloadPDFLatest() {
  const res = await axiosClient.get("/reports/pdf/latest", {
    responseType: "blob",
  });
  return res.data;
}

export async function downloadExcelLatest() {
  const res = await axiosClient.get("/reports/excel/latest", {
    responseType: "blob",
  });
  return res.data;
}

export async function getLatestPDF() {
  return axiosClient.get("/reports/pdf/latest", {
    responseType: "blob",
  });
}

export async function getHostPDF(hostId) {
  return axiosClient.get(`/reports/pdf/history/${hostId}`, {
    responseType: "blob",
  });
}

export async function getLatestExcel() {
  return axiosClient.get("/reports/excel/latest", { 
    responseType: "blob",
  });
}

export async function getHostExcel(hostId) {
  return axiosClient.get(`/reports/excel/history/${hostId}`, {
    responseType: "blob",
  });
}
