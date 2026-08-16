import axiosClient from "../api/axiosClient";

export const getAnalyticsSummary = async () => {
  const { data } = await axiosClient.get("/analytics/summary");
  return data;
};

export const getDashboardAnalytics = async () => {
  const { data } = await axiosClient.get("/analytics/dashboard");
  return data;
};

export const getRecentAnalyticsComplaints = async () => {
  const { data } = await axiosClient.get("/analytics/recent");
  return data;
};