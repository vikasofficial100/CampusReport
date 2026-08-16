import axiosClient from "../api/axiosClient";

export const submitFeedback = async (payload) => {
  const { data } = await axiosClient.post("/feedback", payload);
  return data;
};

export const getMyFeedbacks = async () => {
  const { data } = await axiosClient.get("/feedback/my");
  return data;
};

export const getAllFeedbacks = async () => {
  const { data } = await axiosClient.get("/feedback/all");
  return data;
};