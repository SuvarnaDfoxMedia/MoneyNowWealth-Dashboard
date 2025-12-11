

// import axios, { AxiosInstance } from "axios";

// export interface QueryParams {
//   [key: string]: string | number | boolean | undefined | null;
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   total?: number;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// export const axiosInstance: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const message =
//       error?.response?.data?.message || error.message || "Network error";
//     return Promise.reject(new Error(message));
//   }
// );

// export const axiosApi = {
//   async get<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
//     const res = await axiosInstance.get(endpoint, { params });
//     return res.data;
//   },

//   async getList<T>(endpoint: string, params?: QueryParams): Promise<ApiResponse<T>> {
//     const res = await axiosInstance.get(endpoint, { params });
//     return res.data;
//   },

//   async getOne<T>(endpoint: string): Promise<ApiResponse<T>> {
//     const res = await axiosInstance.get(endpoint);
//     return res.data;
//   },

//   async create<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
//     const isFormData = payload instanceof FormData;
//     const res = await axiosInstance.post(endpoint, payload, {
//       headers: isFormData
//         ? { "Content-Type": "multipart/form-data" }
//         : { "Content-Type": "application/json" },
//     });
//     return res.data;
//   },

//   async post<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
//     return this.create<T>(endpoint, payload);
//   },

//   async update<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
//     const isFormData = payload instanceof FormData;
//     const res = await axiosInstance.put(endpoint, payload, {
//       headers: isFormData
//         ? { "Content-Type": "multipart/form-data" }
//         : { "Content-Type": "application/json" },
//     });
//     return res.data;
//   },

//   async patch<T>(endpoint: string, payload: any): Promise<ApiResponse<T>> {
//     const res = await axiosInstance.patch(endpoint, payload, {
//       headers: { "Content-Type": "application/json" },
//     });
//     return res.data;
//   },

//   async remove<T>(endpoint: string): Promise<ApiResponse<T>> {
//     const res = await axiosInstance.delete(endpoint);
//     return res.data;
//   },
// };

// export default axiosInstance;


// import axios, { AxiosInstance } from "axios";
// import { refreshAuthUser, logoutAuth } from "../context/AuthContext"; // helper functions to refresh/logout
// import { toast } from "react-hot-toast";

// export interface QueryParams {
//   [key: string]: string | number | boolean | undefined | null;
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   total?: number;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// export const axiosInstance: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true, // important for HttpOnly JWT cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Response interceptor for auto logout on 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Session expired or invalid token
//       try {
//         await refreshAuthUser(); // try to refresh user
//       } catch {
//         await logoutAuth(); // force logout if refresh fails
//         toast.error("Session expired. Please login again.");
//         window.location.href = "/signin"; // redirect
//       }
//     }
//     const message =
//       error?.response?.data?.message || error.message || "Network error";
//     return Promise.reject(new Error(message));
//   }
// );

// const handleRequest = async <T>(request: Promise<any>): Promise<ApiResponse<T>> => {
//   try {
//     const res = await request;
//     return res.data;
//   } catch (err: any) {
//     throw new Error(err.message || "Request failed");
//   }
// };

// export const axiosApi = {
//   get: <T>(endpoint: string, params?: QueryParams) =>
//     handleRequest<T>(axiosInstance.get(endpoint, { params })),

//   getList: <T>(endpoint: string, params?: QueryParams) =>
//     handleRequest<T>(axiosInstance.get(endpoint, { params })),

//   getOne: <T>(endpoint: string) =>
//     handleRequest<T>(axiosInstance.get(endpoint)),

//   create: <T>(endpoint: string, payload: any) => {
//     const isFormData = payload instanceof FormData;
//     return handleRequest<T>(
//       axiosInstance.post(endpoint, payload, {
//         headers: isFormData
//           ? { "Content-Type": "multipart/form-data" }
//           : { "Content-Type": "application/json" },
//       })
//     );
//   },

//   post: <T>(endpoint: string, payload: any) => axiosApi.create<T>(endpoint, payload),

//   update: <T>(endpoint: string, payload: any) => {
//     const isFormData = payload instanceof FormData;
//     return handleRequest<T>(
//       axiosInstance.put(endpoint, payload, {
//         headers: isFormData
//           ? { "Content-Type": "multipart/form-data" }
//           : { "Content-Type": "application/json" },
//       })
//     );
//   },

//   patch: <T>(endpoint: string, payload: any) =>
//     handleRequest<T>(
//       axiosInstance.patch(endpoint, payload, { headers: { "Content-Type": "application/json" } })
//     ),

//   remove: <T>(endpoint: string) => handleRequest<T>(axiosInstance.delete(endpoint)),
// };

// export default axiosInstance;




// import axios, { AxiosInstance } from "axios";
// import { refreshAuthUser, logoutAuth } from "../context/AuthContext"; // helper functions
// import { toast } from "react-hot-toast";

// export interface QueryParams {
//   [key: string]: string | number | boolean | undefined | null;
// }

// export interface ApiResponse<T = any> {
//   success: boolean;
//   message?: string;
//   data?: T;
//   total?: number;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// // Create Axios instance
// export const axiosInstance: AxiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// // Response interceptor for auto logout on 401
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       try {
//         await refreshAuthUser();
//       } catch {
//         await logoutAuth();
//         toast.error("Session expired. Please login again.");
//         window.location.href = "/signin";
//       }
//     }
//     const message = error?.response?.data?.message || error.message || "Network error";
//     return Promise.reject(new Error(message));
//   }
// );

// // Central request handler
// const handleRequest = async <T>(request: Promise<any>): Promise<ApiResponse<T>> => {
//   try {
//     const res = await request;
//     return res.data;
//   } catch (err: any) {
//     throw new Error(err?.response?.data?.message || err.message || "Request failed");
//   }
// };

// // Axios helper
// export const axiosApi = {
//   get: <T>(endpoint: string, params?: QueryParams) =>
//     handleRequest<T>(axiosInstance.get(endpoint, { params })),

//   // GET list with searchValue → search mapping
//   getList: <T>(endpoint: string, params?: QueryParams) => {
//     const queryParams = { ...params };
//     if ("searchValue" in queryParams) {
//       queryParams.search = queryParams.searchValue;
//       delete queryParams.searchValue;
//     }
//     return handleRequest<T>(axiosInstance.get(endpoint, { params: queryParams }));
//   },

//   getOne: <T>(endpoint: string) => handleRequest<T>(axiosInstance.get(endpoint)),

//   create: <T>(endpoint: string, payload: any) => {
//     const isFormData = payload instanceof FormData;
//     return handleRequest<T>(
//       axiosInstance.post(endpoint, payload, {
//         headers: isFormData
//           ? { "Content-Type": "multipart/form-data" }
//           : { "Content-Type": "application/json" },
//       })
//     );
//   },

//   post: <T>(endpoint: string, payload: any) => axiosApi.create<T>(endpoint, payload),

//   update: <T>(endpoint: string, payload: any) => {
//     const isFormData = payload instanceof FormData;
//     return handleRequest<T>(
//       axiosInstance.put(endpoint, payload, {
//         headers: isFormData
//           ? { "Content-Type": "multipart/form-data" }
//           : { "Content-Type": "application/json" },
//       })
//     );
//   },

//   patch: <T>(endpoint: string, payload: any) =>
//     handleRequest<T>(
//       axiosInstance.patch(endpoint, payload, { headers: { "Content-Type": "application/json" } })
//     ),

//   remove: <T>(endpoint: string) => handleRequest<T>(axiosInstance.delete(endpoint)),
// };

// export default axiosInstance;




import axios, { AxiosInstance } from "axios";
import { refreshAuthUser, logoutAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

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

// Axios instance with cookies
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // crucial for cookie auth
  headers: { "Content-Type": "application/json" },
});

// Response interceptor: auto-refresh or logout
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await refreshAuthUser(); // try to refresh session
        return Promise.reject(error); // optionally retry request after refresh
      } catch {
        await logoutAuth(); // logout if refresh fails
        toast.error("Session expired. Please login again.");
        window.location.href = "/signin";
      }
    }
    const message = error?.response?.data?.message || error.message || "Network error";
    return Promise.reject(new Error(message));
  }
);

// Central request handler
const handleRequest = async <T>(request: Promise<any>): Promise<ApiResponse<T>> => {
  try {
    const res = await request;
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || err.message || "Request failed");
  }
};

// Axios helper
export const axiosApi = {
  get: <T>(endpoint: string, params?: QueryParams) =>
    handleRequest<T>(axiosInstance.get(endpoint, { params })),

  getList: <T>(endpoint: string, params?: QueryParams) => {
    const queryParams = { ...params };
    if ("searchValue" in queryParams) {
      queryParams.search = queryParams.searchValue;
      delete queryParams.searchValue;
    }
    return handleRequest<T>(axiosInstance.get(endpoint, { params: queryParams }));
  },

  getOne: <T>(endpoint: string) => handleRequest<T>(axiosInstance.get(endpoint)),

  create: <T>(endpoint: string, payload: any) => {
    const isFormData = payload instanceof FormData;
    return handleRequest<T>(
      axiosInstance.post(endpoint, payload, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      })
    );
  },

  post: <T>(endpoint: string, payload: any) => axiosApi.create<T>(endpoint, payload),

  update: <T>(endpoint: string, payload: any) => {
    const isFormData = payload instanceof FormData;
    return handleRequest<T>(
      axiosInstance.put(endpoint, payload, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      })
    );
  },

  patch: <T>(endpoint: string, payload: any) =>
    handleRequest<T>(
      axiosInstance.patch(endpoint, payload, { headers: { "Content-Type": "application/json" } })
    ),

  remove: <T>(endpoint: string) => handleRequest<T>(axiosInstance.delete(endpoint)),
};

export default axiosInstance;
