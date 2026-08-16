import axiosClient from "../api/axiosClient";

export const analyzeComplaint = async (payload) => {
  const { data } = await axiosClient.post("/ai/analyze-complaint", payload);
  return data;
};