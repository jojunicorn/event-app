import axios from "@/axios";


export const getNotificationsForUser = async (id: string) => {
    const response = await axios.get(`/notifications?userId=${id}`);
    return response.data;
};

export const deleteNotificationById = async (id: string) => {
    const response = await axios.delete(`/notifications/${id}`);
    return response.data;
};

export const updateStatus = async (id: string) => {
    const response = await axios.put(`/notifications/${id}`);
    return response.data;
};