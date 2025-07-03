import axios from "@/axios";
import { UserRequest, UserUpdateRequest } from "@/models/user";
import { Roles } from "@/enums/roles"


export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`/auth`, data);
  return response.data;
};

export const register = async (userRequest: UserRequest) => {
    const response = await axios.post(`/users/register`, userRequest);
    return response.data;
};

export const getUsers = async () => {
  const response = await axios.get(`/users`);
  return response.data;
}

export const getUserById = async (id: string) => {
    const response = await axios.get(`/users/${id}`);
    return response.data;
};

export const changeUserRole = async (id: string, role: Roles) => {
    const response = await axios.post(`/users/${id}?role=${role}`);
    return response.data;
};

export const getAllOrganizerRequests = async () => {
  const response = await axios.get(`/users/organizerRequests`);
  return response.data;
}

export const deleteUserById = async (id: string) => {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
};

export const updateUser = async (id: string, userRequest: UserUpdateRequest) => {
    const response = await axios.put(`/users/${id}`, userRequest);
    return response.data;
};