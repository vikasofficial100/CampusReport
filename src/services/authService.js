import axiosClient from "../api/axiosClient";

export const registerUser = async (userData) => {
  const { data } = await axiosClient.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await axiosClient.post("/auth/login", credentials);
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosClient.post("/auth/logout");
  return data;
};

export const getMyProfile = async () => {
  const { data } = await axiosClient.get("/auth/me");
  return data;
};

export const updateMyProfile = async (profileData) => {
  const { data } = await axiosClient.put("/auth/me", profileData);
  return data;
};

export const changeMyPassword = async (passwordData) => {
  const { data } = await axiosClient.put("/auth/change-password", passwordData);
  return data;
};