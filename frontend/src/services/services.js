import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

export const getServices = async () => {
  try {
    const response = await api.get("/services");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserServices = async (userId) => {
  try {
    const response = await api.get(`/services/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const subscribeService = async (userId, serviceId) => {
  try {
    await api.post("/services/subscribe", { userId, serviceId });
  } catch (error) {
    throw error;
  }
};
