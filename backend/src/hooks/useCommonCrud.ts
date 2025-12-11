
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { axiosApi } from "../api/axios";
// import { toast } from "react-hot-toast";

// export interface CommonCrudProps {
//   module: string;
//   role?: string;
//   searchValue?: string;
//   page?: number;
//   limit?: number;
//   sortField?: string;
//   sortOrder?: "asc" | "desc";
//   listKey?: string; // Optional override for array key in response
// }

// export interface ApiMessage {
//   success?: boolean;
//   message?: string;
//   data?: any;
// }

// export interface CrudResponse<T> {
//   total?: number;
//   limit?: number;
//   currentPage?: number;
//   totalPages?: number;
//   [key: string]: any; // dynamic keys like clusters, items, topics
// }

// export const useCommonCrud = <T>({
//   module,
//   role,
//   page = 1,
//   limit = 10,
//   searchValue = "",
//   sortField = "",
//   sortOrder = "asc",
//   listKey,
// }: CommonCrudProps) => {
//   const queryClient = useQueryClient();
//   const defaultListKey = listKey ?? `${module}s`; // fallback to plural
//   const queryKey = [module, "list", { page, limit, searchValue, sortField, sortOrder }];

//   // Helper to safely extract list
//   const extractList = (data?: CrudResponse<T>): T[] => {
//     if (!data) return [];
//     const list = data[defaultListKey] ?? data.items ?? [];
//     return Array.isArray(list) ? (list as T[]) : [];
//   };

//   // Query
//   const { data, isLoading, refetch } = useQuery<CrudResponse<T>>({
//     queryKey,
//     queryFn: async () => {
//       const res = await axiosApi.getList<CrudResponse<T>>(`/${module}`, {
//         page,
//         limit,
//         search: searchValue,
//         sortBy: sortField,
//         sortOrder,
//       });
//       // Return a safe object so React Query never gets undefined
//       return res ?? { total: 0, limit, currentPage: page, totalPages: 1, [defaultListKey]: [] };
//     },
//     placeholderData: { total: 0, limit, currentPage: page, totalPages: 1, [defaultListKey]: [] },
//     retry: false,
//   });

//   // Get one record
//   const getOne = async (id: string) => {
//     try {
//       const res = await axiosApi.getOne<T>(`/${module}/${id}`);
//       return res ?? null;
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to fetch record");
//       throw err;
//     }
//   };

//   // Create
//   const createMutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       if (!role) throw new Error("Role missing for create operation");
//       const res = await axiosApi.post<ApiMessage>(`/${role}/${module}/create`, formData);
//       return res;
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Created successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => toast.error(err?.message || "Create failed"),
//   });
//   const createRecord = (formData: FormData) => createMutation.mutateAsync(formData);

//   // Update
//   const updateMutation = useMutation({
//     mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
//       if (!role) throw new Error("Role missing for update operation");
//       const res = await axiosApi.update<ApiMessage>(`/${role}/${module}/edit/${id}`, formData);
//       return res;
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Updated successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => toast.error(err?.message || "Update failed"),
//   });
//   const updateRecord = (id: string, formData: FormData) =>
//     updateMutation.mutateAsync({ id, formData });

//   // Delete
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       if (!role) throw new Error("Role missing for delete operation");
//       const res = await axiosApi.remove<ApiMessage>(`/${role}/${module}/delete/${id}`);
//       return res;
//     },
//     onMutate: async (id: string) => {
//       await queryClient.cancelQueries({ queryKey });
//       const previous = queryClient.getQueryData<CrudResponse<T>>(queryKey);

//       queryClient.setQueryData(queryKey, (old: any) => {
//         if (!old) return old;
//         const list = extractList(old);
//         const updated = list.filter((item: any) => item._id !== id);
//         return { ...old, [defaultListKey]: updated, total: Math.max((old.total || 1) - 1, 0) };
//       });

//       return { previous };
//     },
//     onError: (err: any, _id, ctx) => {
//       toast.error(err?.message || "Delete failed");
//       if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey }),
//   });
//   const deleteRecord = async (id: string) => {
//     try {
//       const res = await deleteMutation.mutateAsync(id);
//       return { success: true, data: res };
//     } catch (err: any) {
//       return { success: false, message: err?.message };
//     }
//   };

//   return {
//     data: data ?? { total: 0, limit, currentPage: page, totalPages: 1, [defaultListKey]: [] },
//     isLoading,
//     refetch,
//     extractList: extractList(data),
//     getOne,
//     createRecord,
//     updateRecord,
//     deleteRecord,
//   };
// };




// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { axiosApi } from "../api/axios";
// import { toast } from "react-hot-toast";

// export interface CommonCrudProps {
//   module: string;
//   role?: string;
//   searchValue?: string;
//   page?: number;
//   limit?: number;
//   sortField?: string;
//   sortOrder?: "asc" | "desc";
//   listKey?: string; // Optional override for array key in response
// }

// export interface ApiMessage {
//   success?: boolean;
//   message?: string;
//   data?: any;
// }

// export interface CrudResponse<T> {
//   total?: number;
//   limit?: number;
//   currentPage?: number;
//   totalPages?: number;
//   [key: string]: any; // dynamic keys – clusters, items, etc.
// }

// export const useCommonCrud = <T>({
//   module,
//   role,
//   page = 1,
//   limit = 10,
//   searchValue = "",
//   sortField = "",
//   sortOrder = "asc",
//   listKey,
// }: CommonCrudProps) => {
//   const queryClient = useQueryClient();
//   const defaultListKey = listKey ?? `${module}s`;
//   const queryKey = [module, "list", { page, limit, searchValue, sortField, sortOrder }];

//   // Extract list safely
//   const extractListFromData = (data?: CrudResponse<T>): T[] => {
//     if (!data) return [];
//     const list = data[defaultListKey] ?? data.items ?? [];
//     return Array.isArray(list) ? (list as T[]) : [];
//   };

//   // Main List Query
//   const { data, isLoading, refetch } = useQuery<CrudResponse<T>>({
//     queryKey,
//     queryFn: async () => {
//       const res = await axiosApi.getList<CrudResponse<T>>(`/${module}`, {
//         page,
//         limit,
//         search: searchValue,
//         sortBy: sortField,
//         sortOrder,
//       });

//       return (
//         res ?? {
//           total: 0,
//           limit,
//           currentPage: page,
//           totalPages: 1,
//           [defaultListKey]: [],
//         }
//       );
//     },
//     placeholderData: {
//       total: 0,
//       limit,
//       currentPage: page,
//       totalPages: 1,
//       [defaultListKey]: [],
//     },
//     retry: false,
//   });

//   // GET ONE
//   const getOne = async (id: string) => {
//     try {
//       const res = await axiosApi.getOne<T>(`/${module}/${id}`);
//       return res ?? null;
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to fetch record");
//       throw err;
//     }
//   };

//   // CREATE
//   const createMutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       if (!role) throw new Error("Role missing for create operation");
//       const res = await axiosApi.post<ApiMessage>(`/${role}/${module}/create`, formData);
//       return res;
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Created successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => toast.error(err?.message || "Create failed"),
//   });

//   const createRecord = (formData: FormData) => createMutation.mutateAsync(formData);

//   // UPDATE
//   const updateMutation = useMutation({
//     mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
//       if (!role) throw new Error("Role missing for update operation");
//       return axiosApi.update<ApiMessage>(`/${role}/${module}/edit/${id}`, formData);
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Updated successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => toast.error(err?.message || "Update failed"),
//   });

//   const updateRecord = (id: string, formData: FormData) =>
//     updateMutation.mutateAsync({ id, formData });

//   // DELETE
//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       if (!role) throw new Error("Role missing for delete operation");
//       return axiosApi.remove<ApiMessage>(`/${role}/${module}/delete/${id}`);
//     },
//     onMutate: async (id) => {
//       await queryClient.cancelQueries({ queryKey });

//       const previous = queryClient.getQueryData<CrudResponse<T>>(queryKey);

//       queryClient.setQueryData(queryKey, (old: any) => {
//         if (!old) return old;

//         const updated = extractListFromData(old).filter((item: any) => item._id !== id);

//         return {
//           ...old,
//           [defaultListKey]: updated,
//           total: Math.max((old.total || 1) - 1, 0),
//         };
//       });

//       return { previous };
//     },
//     onError: (err, _id, ctx) => {
//       toast.error(err?.message || "Delete failed");
//       if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
//     },
//     onSettled: () => queryClient.invalidateQueries({ queryKey }),
//   });

//   const deleteRecord = async (id: string) => {
//     try {
//       const res = await deleteMutation.mutateAsync(id);
//       return { success: true, data: res };
//     } catch (err: any) {
//       return { success: false, message: err?.message };
//     }
//   };

//   // ✅ TOGGLE STATUS (FIXED)
//   const toggleStatusMutation = useMutation({
//     mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
//       if (!role) throw new Error("Role missing for toggle operation");

//       // PATCH request with backend-compatible URL
//       return axiosApi.patch<ApiMessage>(`/${role}/${module}/change/${id}/status`, {
//         status,
//       });
//     },

//     onMutate: async ({ id, status }) => {
//       await queryClient.cancelQueries({ queryKey });

//       const previous = queryClient.getQueryData(queryKey);

//       queryClient.setQueryData(queryKey, (old: any) => {
//         if (!old) return old;

//         const updated = extractListFromData(old).map((item: any) =>
//           item._id === id ? { ...item, is_active: status } : item
//         );

//         return { ...old, [defaultListKey]: updated };
//       });

//       return { previous };
//     },

//     onError: (err: any, _vars, ctx) => {
//       toast.error(err?.message || "Failed to update status");
//       if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
//     },

//     onSuccess: (res) => toast.success(res?.message || "Status updated"),

//     onSettled: () => queryClient.invalidateQueries({ queryKey }),
//   });

//   const toggleStatus = (id: string, status: boolean) =>
//     toggleStatusMutation.mutateAsync({ id, status });

//   // Return final object
//   return {
//     data:
//       data ?? ({

//         total: 0,
//         limit,
//         currentPage: page,
//         totalPages: 1,
//         [defaultListKey]: [],
//       } as any),

//     isLoading,
//     refetch,

//     extractList: extractListFromData(data),

//     getOne,
//     createRecord,
//     updateRecord,
//     deleteRecord,

//     toggleStatus,
//   };
// };




// src/hooks/useCommonCrud.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "../api/axios";
import { toast } from "react-hot-toast";

export interface CommonCrudProps {
  module: string;                // e.g., "cluster", "article"
  role?: string;                 // optional role for admin/editor routes
  searchValue?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  listKey?: string;              // optional override for array key in response
}

export interface ApiMessage {
  success?: boolean;
  message?: string;
  data?: any;
}

export interface CrudResponse<T> {
  total?: number;
  limit?: number;
  currentPage?: number;
  totalPages?: number;
  [key: string]: any; // dynamic keys like clusters, articles, items
}

export const useCommonCrud = <T>({
  module,
  role,
  page = 1,
  limit = 10,
  searchValue = "",
  sortField = "",
  sortOrder = "asc",
  listKey,
}: CommonCrudProps) => {
  const queryClient = useQueryClient();
  const defaultListKey = listKey ?? `${module}s`;
  const queryKey = [module, "list", { page, limit, searchValue, sortField, sortOrder }];

  const extractListFromData = (data?: CrudResponse<T>): T[] => {
    if (!data) return [];
    const list = data[defaultListKey] ?? data.items ?? [];
    return Array.isArray(list) ? (list as T[]) : [];
  };

  // ------------------ FETCH LIST ------------------
  const { data, isLoading, refetch } = useQuery<CrudResponse<T>>({
    queryKey,
    queryFn: async () => {
      const res = await axiosApi.getList<CrudResponse<T>>(`/${module}`, {
        page,
        limit,
        search: searchValue,
        sortBy: sortField,
        sortOrder,
      });
      return res ?? { total: 0, limit, currentPage: page, totalPages: 1, [defaultListKey]: [] };
    },
    placeholderData: { total: 0, limit, currentPage: page, totalPages: 1, [defaultListKey]: [] },
    retry: false,
  });

  // ------------------ FETCH ONE ------------------
  const getOne = async (id: string) => {
    try {
      const res = await axiosApi.getOne<T>(`/${module}/${id}`);
      return res ?? null;
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch record");
      throw err;
    }
  };

  // ------------------ CREATE ------------------
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const url = role ? `/${role}/${module}/create` : `/${module}/create`;
      return axiosApi.post<ApiMessage>(url, payload);
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Created successfully");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => toast.error(err?.message || "Create failed"),
  });

  const createRecord = (payload: any) => createMutation.mutateAsync(payload);

  // ------------------ UPDATE ------------------
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const url = role ? `/${role}/${module}/edit/${id}` : `/${module}/edit/${id}`;
      return axiosApi.update<ApiMessage>(url, payload);
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Updated successfully");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => toast.error(err?.message || "Update failed"),
  });

  const updateRecord = (id: string, payload: any) => updateMutation.mutateAsync({ id, payload });

  // ------------------ DELETE ------------------
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const url = role ? `/${role}/${module}/delete/${id}` : `/${module}/delete/${id}`;
      return axiosApi.remove<ApiMessage>(url);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CrudResponse<T>>(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const updated = extractListFromData(old).filter((item: any) => item._id !== id);
        return { ...old, [defaultListKey]: updated, total: Math.max((old.total || 1) - 1, 0) };
      });
      return { previous };
    },
    onError: (err, _id, ctx) => {
      toast.error(err?.message || "Delete failed");
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteRecord = async (id: string) => {
    try {
      const res = await deleteMutation.mutateAsync(id);
      return { success: true, data: res };
    } catch (err: any) {
      return { success: false, message: err?.message };
    }
  };

  // ------------------ TOGGLE STATUS ------------------
  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: boolean }) => {
      const url = role ? `/${role}/${module}/toggle-status/${id}` : `/${module}/toggle-status/${id}`;
      return axiosApi.patch<ApiMessage>(url, { is_active: status ? 1 : 0 });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const updated = extractListFromData(old).map((item: any) =>
          item._id === id ? { ...item, is_active: status ? 1 : 0 } : item
        );
        return { ...old, [defaultListKey]: updated };
      });
      return { previous };
    },
    onError: (err: any, _vars, ctx) => {
      toast.error(err?.message || "Failed to update status");
      if (ctx?.previous) queryClient.setQueryData(queryKey, ctx.previous);
    },
    onSuccess: (res) => toast.success(res?.message || "Status updated"),
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  });

  const toggleStatus = (id: string, status: boolean) =>
    toggleStatusMutation.mutateAsync({ id, status });

  return {
    data: data ?? { total: 0, limit, currentPage: page, totalPages: 1, [defaultListKey]: [] },
    extractList: extractListFromData(data),
    isLoading,
    refetch,
    getOne,
    createRecord,
    updateRecord,
    deleteRecord,
    toggleStatus,
    
  };
};

export default useCommonCrud;
