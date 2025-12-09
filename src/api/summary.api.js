import axiosClient from "./axiosClient";

export async function getSummary() {
  return (await axiosClient.get("/summary")).data;
}

