import axiosClient from "./axiosClient";

export async function getVulnerabilities() {
  return (await axiosClient.get("/vulnerabilities")).data;
}

export async function getVulnerabilitiesByPort(portId) {
  return (await axiosClient.get(`/vulnerabilities/${portId}`)).data;
}


