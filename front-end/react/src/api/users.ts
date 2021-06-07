import axios from "axios";
import { getSessionCookie } from "../session";

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sessionToken: string;
  isAdmin: boolean;
}

export interface IApiResponse {
  message?: string;
  error?: string;
}

export interface ISignInData {
  email: string;
  password: string;
}

export interface ISignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ISignOutData {
  sessionToken: string;
}

export interface SuccessResponse {
  success: boolean;
}

const userUuid = getSessionCookie();

export const signIn = async (data: ISignInData): Promise<IUser> => {
  const response = await axios.post("/user/login", data);

  return response.data;
};

export const signUp = async (data: ISignUpData): Promise<IApiResponse> => {
  const response = await axios.post("/user/register", data);

  return response.data;
};

export const signOut = async (
  sessionToken: ISignOutData
): Promise<SuccessResponse> => {
  const response = await axios.post("/user/logout", sessionToken);

  return response.data;
};

export const getUserByUuid = async (): Promise<IUser> => {
  const response = await axios.get(`/user/${userUuid}`);

  return response.data;
};

export const registerAdmin = async (
  data: ISignUpData,
  sessionToken: string
): Promise<IApiResponse> => {
  const response = await axios.post(
    `/user/register/admin/${sessionToken}`,
    data
  );

  return response.data;
};
