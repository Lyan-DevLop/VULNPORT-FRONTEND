import axiosClient from "./axiosClient";

export async function getMyHosts() {
  return (await axiosClient.get("/hosts/me")).data;
}

export async function getAllHosts() {
  return (await axiosClient.get("/hosts")).data;
}



