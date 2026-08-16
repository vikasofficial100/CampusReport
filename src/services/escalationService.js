import axiosClient from "../api/axiosClient";

export const getEscalations = async () => {
  const { data } = await axiosClient.get("/escalations");
  return data;
};

export const runAutoEscalationCheck = async () => {
  const { data } = await axiosClient.post("/escalations/run-check");
  return data;
};

export const manualEscalateComplaint = async (id, payload) => {
  const { data } = await axiosClient.post(`/escalations/complaints/${id}/manual`, payload);
  return data;
};

export const updateEscalationStatus = async (id, payload) => {
  const { data } = await axiosClient.put(`/escalations/${id}`, payload);
  return data;
};