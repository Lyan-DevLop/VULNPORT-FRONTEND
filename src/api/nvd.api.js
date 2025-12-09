import axiosClient from "./axiosClient";

export async function searchCVE(query) {
  const res = await axiosClient.get("/nvd/search", {
    params: { q: query },
  });
  return res.data; 
}

