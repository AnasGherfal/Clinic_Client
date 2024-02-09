import httpClient from "../../services/http-client";

export const createAppointment = async (appointmentData: any, token: string) => {
  try {
    const response = await httpClient.post('appointments/create', appointmentData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (token: string) => {
  try {
    const response = await httpClient.get(`appointments`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointmentById = async (appointmentId: string, token: string) => {
  try {
    const response = await httpClient.get(
      `appointments/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const scheduleAppointment = async (
  userId: string,
  appointmentId: string,
  appointmentData: any,
  token: string
) => {
  try {
    const response = await httpClient.post(
      `appointments/${userId}/schedule-appointment/${appointmentId}`,
      appointmentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const cancelAppointment = async (
  userId: string,
  appointmentId: string,
  token: string
) => {
  try {
    const response = await httpClient.delete(
      `appointments/${userId}/cancel-appointment/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
