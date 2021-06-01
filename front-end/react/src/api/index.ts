import { AxiosError } from 'axios';

export * from './users';
export * from './meetings';

export const extractError = (error: AxiosError) => {
  return error?.response?.data?.message || error?.message;
};
