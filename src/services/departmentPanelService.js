import axiosClient from "../api/axiosClient";

export const getDepartmentPerformance = async () => {
  const { data } = await axiosClient.get("/department-panel/performance");
  return data;
};

export const getAssignedDepartmentComplaints = async (params = {}) => {
  const { data } = await axiosClient.get("/department-panel/complaints", { params });
  return data;
};

export const getAssignedDepartmentComplaintDetails = async (id) => {
  const { data } = await axiosClient.get(`/department-panel/complaints/${id}`);
  return data;
};

export const updateDepartmentComplaintStatus = async (id, payload) => {
  const { data } = await axiosClient.put(
    `/department-panel/complaints/${id}/status`,
    payload
  );
  return data;
};

export const uploadDepartmentProof = async (id, imageFile, payload = {}) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("proofType", payload.proofType || "before");
  formData.append("workRemark", payload.workRemark || "");

  const { data } = await axiosClient.post(
    `/department-panel/complaints/${id}/proof`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};