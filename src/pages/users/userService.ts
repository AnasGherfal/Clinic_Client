import httpClient from "../../services/http-client";
import { UserCreate } from "./model";

export const getUsers = async (token: string) => {
  try {
    const response = await httpClient.get(`users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data; 
  } catch (error) {
    throw error; 
  }
};

export const createUser = async (userData: UserCreate, token: string) => {
  try {
    const response = await httpClient.post(`user`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data; 
  } catch (error) {
    throw error; 
  }
};

export const getUserById = async (userId: string, token: string) => {
  try {
    const response = await httpClient.get(`user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data; 
  } catch (error) {
    throw error; 
  }
};

export const updateUser = async (
  userId: string,
  updatedUserData: UserCreate,
  token: string
) => {
  try {
    const response = await httpClient.put(`user/${userId}`, updatedUserData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response?.data; 
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (
  userId: string,
  requestingUserId: string,
  token: string
) => {
  try {
    const response = await httpClient.delete(`user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        requestingUserId: requestingUserId,
      },
    });

    return response?.data;
  } catch (error) {
    throw error;
  }
};
