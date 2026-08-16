import axiosClient from "../api/axiosClient";

export const analyzePriority = async (payload) => {
  const { data } = await axiosClient.post("/priority/analyze", payload);
  return data;
};

export const getHighRiskComplaints = async () => {
  const { data } = await axiosClient.get("/priority/high-risk");
  return data;
};

export const getPriorityByComplaintId = async (complaintId) => {
  const { data } = await axiosClient.get(`/priority/${complaintId}`);
  return data;
};