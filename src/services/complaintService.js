import axiosClient from "../api/axiosClient";

export const createComplaint = async (complaintData) => {
  const { data } = await axiosClient.post("/complaints", complaintData);
  return data;
};

export const getMyComplaints = async () => {
  const { data } = await axiosClient.get("/complaints/my");
  return data;
};

export const getComplaintById = async (id) => {
  const { data } = await axiosClient.get(`/complaints/${id}`);
  return data;
};

export const getAllComplaints = async () => {
  const { data } = await axiosClient.get("/complaints/all");
  return data;
};

export const updateComplaintStatus = async (id, statusData) => {
  const { data } = await axiosClient.put(`/complaints/${id}/status`, statusData);
  return data;
};

export const getComplaintByComplaintId = async (complaintId) => {
  const { data } = await axiosClient.get(`/complaints/track/${complaintId}`);
  return data;
};