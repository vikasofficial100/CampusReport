import axiosClient from "../api/axiosClient";

export const getSuperAdminStats = async () => {
  const { data } = await axiosClient.get("/super-admin-panel/stats");
  return data;
};

export const getSuperAdminUsers = async (params = {}) => {
  const { data } = await axiosClient.get("/super-admin-panel/users", { params });
  return data;
};

export const updateSuperAdminUser = async (id, payload) => {
  const { data } = await axiosClient.put(`/super-admin-panel/users/${id}`, payload);
  return data;
};

export const getSuperAdminDepartments = async () => {
  const { data } = await axiosClient.get("/super-admin-panel/departments");
  return data;
};

export const createSuperAdminDepartment = async (payload) => {
  const { data } = await axiosClient.post("/super-admin-panel/departments", payload);
  return data;
};

export const updateSuperAdminDepartment = async (id, payload) => {
  const { data } = await axiosClient.put(`/super-admin-panel/departments/${id}`, payload);
  return data;
};