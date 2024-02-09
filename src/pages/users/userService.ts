// userService.ts

import httpClient from "../../services/http-client";
import { UserCreate } from "./model";

export const getUsers = async () => {
  try {
    const response = await httpClient.get(`users`);

    return response.data; 
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export const createUser = async (userData: UserCreate) => {
  try {
    const response = await httpClient.post(`user`, userData);

    return response.data; 
  } catch (error) {
    throw error; 
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await httpClient.get(`user/${userId}`);

    return response.data; 
  } catch (error) {
    console.error(error);
    throw error; 
  }
};

export const updateUser = async (
  userId: string,
  updatedUserData: UserCreate
) => {
  try {
    const response = await httpClient.put(`user/${userId}`, updatedUserData);

    return response.data; 
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteUser = async (userId: string,requestingUserId: string) => {
  try {
    const response = await httpClient.delete(`user/${userId}`, { data: { requestingUserId } });

    return response.data; 
  } catch (error) {
    console.error(error);
    throw error; 
  }
};
