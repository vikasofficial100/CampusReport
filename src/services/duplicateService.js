import axiosClient from "../api/axiosClient";

export const checkDuplicateComplaint = async (payload) => {
  const { data } = await axiosClient.post("/duplicates/check", payload);
  return data;
};