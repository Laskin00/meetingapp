import axios from "axios";
import { IApiResponse } from ".";
import { IUser } from "./users";

export interface IComment {
  content: string;
  user: IUser;
}

export interface IMeeting {
  id: string;
  inviteToken: string;
  description: string;
  location: string;
  date: string;
  time: string;
  comments: IComment[];
}

export interface IMeetingData {
  sessionToken: string;
  description: string;
  location: string;
  date: string;
  time: string;
}

export interface IMeetingResponse {
  meetingUuid: string;
}

export interface IMeetingInviteTokenResponse {
  inviteToken: string;
}

export const createMeeting = async (
  data: IMeetingData
): Promise<IMeetingResponse> => {
  const response = await axios.post("/meeting/create", data);

  return response.data;
};

export const getMeetingInviteToken = async (
  meetingUuid: string
): Promise<IMeetingInviteTokenResponse> => {
  const response = await axios.get(`/meeting/${meetingUuid}/inviteToken`);

  return response.data;
};

export const joinMeeting = async (
  meetingUuid: string,
  sessionToken: string
): Promise<IApiResponse> => {
  const response = await axios.post(`/meeting/join/${meetingUuid}`, {
    sessionToken: sessionToken,
  });

  return response.data;
};

export const getUserMeetings = async (
  sessionToken: string
): Promise<IMeeting[]> => {
  const response = await axios.get(`/user/meetings/${sessionToken}`);

  return response.data;
};

export const getMeetingUsers = async (
  meetingUuid: string
): Promise<IUser[]> => {
  const response = await axios.get(`/meeting/${meetingUuid}/users`);

  return response.data;
};

export const getMeetingOwner = async (meetingUuid: string): Promise<IUser> => {
  const response = await axios.get(`/meeting/owner/${meetingUuid}`);

  return response.data;
};

export const leaveMeeting = async (
  meetingUuid: string,
  sessionToken: string
): Promise<IApiResponse> => {
  const response = await axios.post(`/meeting/leave/${meetingUuid}`, {
    sessionToken: sessionToken,
  });

  return response.data;
};

export const deleteMeeting = async (
  meetingUuid: string,
  sessionToken: string
): Promise<IApiResponse> => {
  const response = await axios.delete(
    `/meeting/delete/${meetingUuid}/${sessionToken}`
  );

  return response.data;
};

export const createComment = async (
  meetingUuid: string,
  sessionToken: string,
  content: string
): Promise<IApiResponse> => {
  const response = await axios.post(`/meeting/comment/${meetingUuid}`, {
    sessionToken: sessionToken,
    content: content,
  });

  return response.data;
};

export const getMeetingComments = async (
  meetingUuid: string
): Promise<IApiResponse> => {
  const response = await axios.get(`/meeting/comments/${meetingUuid}`);

  return response.data;
};
