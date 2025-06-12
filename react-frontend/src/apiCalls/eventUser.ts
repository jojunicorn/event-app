import axios from "@/axios";
// import AccessTypes from "@/enums/accessTypes";
// import {Event} from "@/models/event";

export const addUserToEvent = async (eventId: string, userId: string) => {
  const response = await axios.post(`/eventUsers/register`, null, {
    params: {
      eventId,
      userId,
    },
  });

  return response.data;
};

export const getNrOfSpotsLeft = async (eventId: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('eventId', eventId);
  const response = await axios.get(`/eventUsers/nrOfSpotsLeft?${queryParams.toString()}`);

  return response.data;
};