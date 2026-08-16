import axiosClient from "../api/axiosClient";

export const getAdminComplaints = async (params = {}) => {
  const { data } = await axiosClient.get("/admin-panel/complaints", { params });
  return data;
};

export const getAdminComplaintDetails = async (id) => {
  const { data } = await axiosClient.get(`/admin-panel/complaints/${id}`);
  return data;
};

export const updateAdminComplaint = async (id, payload) => {
  const { data } = await axiosClient.put(`/admin-panel/complaints/${id}`, payload);
  return data;
};

export const getAdminDepartments = async () => {
  const { data } = await axiosClient.get("/admin-panel/departments");
  return data;
};