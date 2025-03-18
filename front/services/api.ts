import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" }
});

export interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export interface AppointmentCreatePayload {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  client_id?: number | null;
  status?: string;
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const response = await axios.get(`${API_URL}/services/`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    return [];
  }
}

export async function fetchClients(search?: string): Promise<Client[]> {
  try {
    let url = `${API_URL}/clients/`;
    if (search) {
      url += `?search=${encodeURIComponent(search)}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
}

export async function createAppointment(
  appointmentData: AppointmentCreatePayload
): Promise<boolean> {
  try {
    console.log("Enviando para API:", appointmentData);

    const requiredFields = ["service", "date", "time", "name", "phone"];
    for (const field of requiredFields) {
      if (!appointmentData[field as keyof AppointmentCreatePayload]) {
        console.error(`Campo obrigatório não preenchido: ${field}`);
        return false;
      }
    }

    // Format data properly for the API
    const formattedData = {
      ...appointmentData,
      date: appointmentData.date,
      time: appointmentData.time,
      // Explicitly set client_id to null if it's undefined
      client_id:
        appointmentData.client_id === undefined
          ? null
          : appointmentData.client_id,
      status: appointmentData.status || "pending"
    };

    console.log("Dados formatados para API:", formattedData);

    const response = await axios.post(
      `${API_URL}/appointments/`,
      formattedData
    );
    console.log("Resposta do servidor:", response.data);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    if (axios.isAxiosError(error) && error.response) {
      console.error("Detalhes do erro:", error.response.data);
      console.error("Status do erro:", error.response.status);
    }
    throw error; // Re-throw the error so it can be handled by the component
  }
}
