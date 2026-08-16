import axiosClient from "../api/axiosClient";

export const uploadComplaintImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); //

  const { data } = await axiosClient.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data", //[cite: 20]
    },
  });

  return data; //[cite: 20]
};

export const uploadProfileImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile); //[cite: 20]

  const { data } = await axiosClient.post("/upload/profile-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data", //[cite: 20]
    },
  });

  return data; //[cite: 20]
};

export const removeProfileImage = async () => {
  const { data } = await axiosClient.delete("/upload/profile-image"); //[cite: 20]
  return data; //[cite: 20]
};