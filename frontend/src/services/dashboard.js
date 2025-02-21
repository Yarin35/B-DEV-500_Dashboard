import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

export const createDashboard = async (dashboardData) => {
    try {
        const response = await api.post('/dashboard', dashboardData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDashboards = async (userId) => {
    try {
        const response = await api.get(`/dashboard/${userId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDashboard = async (id, dashboardData) => {
    try {
        await api.put(`/dashboard/${id}`, dashboardData);
    } catch (error) {
        throw error;
    }
};

export const deleteDashboard = async (id) => {
    try {
        await api.delete(`/dashboard/${id}`);
    } catch (error) {
        throw error;
    }
};