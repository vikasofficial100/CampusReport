import axiosClient from "../api/axiosClient";

export const sendForgotPasswordOTP = async (payload) => {
  const { data } = await axiosClient.post("/otp/forgot-password", payload);
  return data;
};

export const resetPasswordWithOTP = async (payload) => {
  const { data } = await axiosClient.post("/otp/reset-password", payload);
  return data;
};

export const sendComplaintTrackingOTP = async (payload) => {
  const { data } = await axiosClient.post("/otp/track-complaint/send", payload);
  return data;
};

export const verifyComplaintTrackingOTP = async (payload) => {
  const { data } = await axiosClient.post("/otp/track-complaint/verify", payload);
  return data;
};