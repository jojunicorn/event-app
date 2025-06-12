import axios from "@/axios";
import AccessTypes from "@/enums/accessTypes";
import {Event} from "@/models/event";

interface GetEventsParams {
  organizerId?: string;
  eventType?: string;
  accessType?: AccessTypes;
  location?: string;
  startDateTime?: string;
  page?: number;
  size?: number;
}

export const getEvents = async (params: GetEventsParams) => {
  try {
    const queryParams = new URLSearchParams();

    if (params.organizerId) queryParams.append('organizerId', params.organizerId);
    if (params.eventType) queryParams.append('eventType', params.eventType);
    if (params.accessType) queryParams.append('accessType', params.accessType);
    if (params.location) queryParams.append('location', params.location);
    if (params.startDateTime) queryParams.append('startDateTime', params.startDateTime);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.size) queryParams.append('size', params.size.toString());

    const response = await axios.get(`/events?${queryParams.toString()}`, {
      headers: { skipAuth: true }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventTypes = async () => {
  const response = await axios.get(`/eventType`, {
      headers: { skipAuth: true }
    });
  return response.data;
}

export const addEventType = async (eventTypeName: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('eventTypeName', eventTypeName);
  const response = await axios.post(`/eventType?${queryParams.toString()}`);
  return response.data;
};

export const deleteEventType = async (id: string) => {
    const response = await axios.delete(`/eventType/${id}`);
    return response.data;
};

export const createEvent = async (eventRequest: Event) => {
  const response = await axios.post(`/events`, eventRequest);
  return response.data;
};

export const deleteEventById = async (id: string) => {
    const response = await axios.delete(`/events/${id}`);
    return response.data;
};

export const getEventsForUser = async (userId: string) => {
  const response = await axios.get(`/eventUsers/${userId}`);
  return response.data;
}