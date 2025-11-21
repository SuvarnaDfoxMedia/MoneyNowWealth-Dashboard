

import axios, { AxiosInstance } from "axios";

export interface QueryParams {
  [key: string]: string | number | boolean | undefined | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE;

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message || error.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

export const axiosApi = {
  async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    const res = await axiosInstance.get(endpoint, { params });
    return res.data;
  },

  async getList<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
    const res = await axiosInstance.get(endpoint, { params });
    return res.data;
  },

  async getOne<T>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await axiosInstance.get(endpoint);
    return res.data;
  },

  async create<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    const isFormData = payload instanceof FormData;
    const res = await axiosInstance.post(endpoint, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });
    return res.data;
  },

  async post<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    return this.create<T>(endpoint, payload);
  },

  async update<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    const isFormData = payload instanceof FormData;
    const res = await axiosInstance.put(endpoint, payload, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });
    return res.data;
  },

  async patch<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
    const res = await axiosInstance.patch(endpoint, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  async remove<T>(endpoint: string): Promise<ApiResponse<T>> {
    const res = await axiosInstance.delete(endpoint);
    return res.data;
  },
};

export default axiosInstance;
