import axios from "@/axios";
import EventUserStatus from "@/enums/eventUserStatus";

export const addUserToEvent = async (eventId: string, userId: string) => {
  const response = await axios.post(`/eventUsers/register`, null, {
    params: {
      eventId,
      userId,
    },
  });

  return response.data;
};

export const unjoinEvent = async (eventId: string, userId: string) => {
  const response = await axios.delete(`/eventUsers/${eventId}/${userId}`);
  return response.data;
}


export const getNrOfSpotsLeft = async (eventId: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('eventId', eventId);
  const response = await axios.get(`/eventUsers/nrOfSpotsLeft?${queryParams.toString()}`);

  return response.data;
};

export const getUsersWaitingForApproval = async (eventId: string) => {
  const response = await axios.get(`/eventUsers/approveNeeded?eventId=${eventId}`);
  return response.data;
}

export const sendInvitationCode = async (eventId: string, userId: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('eventId', eventId);
  queryParams.append('userId', userId);

  const response = await axios.post(`/invitation/create?${queryParams.toString()}`);
  return response.data;
}

export const validateCodeAndAddUser = async (eventId: string, userId: string, code: string) => {
  const queryParams = new URLSearchParams();
  queryParams.append('userId', userId);
  queryParams.append('code', code);

  const response = await axios.get(`/invitation/validate?${queryParams.toString()}`);
  return response.data;
}

export const deleteInvitation = async (code: string) => {
  const response = await axios.delete(`/invitation/delete?code=${code}`);
  return response.data;
}

export const changeEventUserStatus = async (eventId: string, userId: string, status: EventUserStatus) => {
  const response = await axios.patch(
    `/eventUsers/${eventId}/${userId}`,
    null,
    {
      params: { status },
    }
  );
  return response.data;
}