// import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
// import { axiosApi } from "../api/axios";
// import { toast } from "react-hot-toast";

// interface CommonCrudProps {
//   role?: string;
//   module: string;
//   currentPage?: number;
//   recordsPerPage?: number;
//   searchValue?: string;
//   sortField?: string;
//   sortOrder?: "asc" | "desc";
// }

// export const useCommonCrud = ({
//   role,
//   module,
//   currentPage = 1,
//   recordsPerPage = 10,
//   searchValue = "",
//   sortField = "",
//   sortOrder = "asc",
// }: CommonCrudProps) => {
//   const queryClient = useQueryClient();
//   const queryKey = [module, currentPage, searchValue, sortField, sortOrder];

//   const { data, isLoading, refetch } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const res = await axiosApi.getList(`/${module}`, {
//         page: currentPage,
//         limit: recordsPerPage,
//         search: searchValue,
//         sortField,
//         sortOrder,
//         includeInactive: true,
//       });
//       return res?.data || res;
//     },
//     placeholderData: keepPreviousData,
//     retry: false,
//     onError: (err: any) => {
//       toast.error(err?.message || "Failed to fetch data");
//     },
//   });

//   const getOne = async (id: string) => {
//     try {
//       const res = await axiosApi.getOne(`/${module}/${id}`);
//       return res?.data || res;
//     } catch (err: any) {
//       toast.error(err?.message || "Failed to fetch record");
//       throw err;
//     }
//   };

//   const createMutation = useMutation({
//     mutationFn: async (formData: FormData) => {
//       const res = await axiosApi.post(`/${role}/${module}/create`, formData);
//       return res?.data || res;
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Created successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Failed to create");
//     },
//   });

//   const createRecord = async (formData: FormData) => {
//     if (!role) return toast.error("Invalid role");
//     return createMutation.mutateAsync(formData);
//   };

//   const updateMutation = useMutation({
//     mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
//       const res = await axiosApi.update(`/${role}/${module}/edit/${id}`, formData);
//       return res?.data || res;
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Updated successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Failed to update");
//     },
//   });

//   const updateRecord = async (id: string, formData: FormData) => {
//     if (!role) return toast.error("Invalid role");
//     return updateMutation.mutateAsync({ id, formData });
//   };

//   const statusMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await axiosApi.patch(`/${role}/${module}/change/${id}/status`, {});
//       return res?.data || res;
//     },
//     onMutate: async (id: string) => {
//       await queryClient.cancelQueries({ queryKey });
//       const previousData = queryClient.getQueryData<any>(queryKey);
//       queryClient.setQueryData<any>(queryKey, (old: any) => {
//         if (!old?.data) return old;
//         return {
//           ...old,
//           data: old.data.map((item: any) =>
//             item._id === id ? { ...item, is_active: item.is_active ? 0 : 1 } : item
//           ),
//         };
//       });
//       return { previousData };
//     },
//     onError: (err: any, _id, context: any) => {
//       toast.error(err?.message || "Failed to change status");
//       if (context?.previousData) {
//         queryClient.setQueryData(queryKey, context.previousData);
//       }
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Status updated successfully");
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries({ queryKey });
//     },
//   });

//   const toggleStatus = async (id: string) => {
//     if (!role) return toast.error("Invalid role");
//     return statusMutation.mutateAsync(id);
//   };

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await axiosApi.remove(`/${role}/${module}/delete/${id}`);
//       return res?.data || res;
//     },
//     onSuccess: (res) => {
//       toast.success(res?.message || "Deleted successfully");
//       queryClient.invalidateQueries({ queryKey });
//     },
//     onError: (err: any) => {
//       toast.error(err?.message || "Failed to delete");
//     },
//   });

//   const deleteRecord = async (id: string) => {
//     if (!role) return toast.error("Invalid role");
//     try {
//       const res = await deleteMutation.mutateAsync(id);
//       return { success: true, data: res };
//     } catch (err: any) {
//       return { success: false, message: err?.message };
//     }
//   };

//   return {
//     data,
//     isLoading,
//     refetch,
//     getOne,
//     createRecord,
//     updateRecord,
//     toggleStatus,
//     deleteRecord,
//   };
// };


import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosApi } from "../api/axios";
import { toast } from "react-hot-toast";

interface CommonCrudProps {
  role?: string;
  module: string;
  currentPage?: number;
  recordsPerPage?: number;
  searchValue?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export const useCommonCrud = ({
  role,
  module,
  currentPage = 1,
  recordsPerPage = 10,
  searchValue = "",
  sortField = "",
  sortOrder = "asc",
}: CommonCrudProps) => {
  const queryClient = useQueryClient();
  const queryKey = [module, currentPage, recordsPerPage, searchValue, sortField, sortOrder];

  // ============================
  // FETCH LIST
  // ============================
  const { data, isLoading, refetch } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await axiosApi.getList(`/${module}`, {
        page: currentPage,
        limit: recordsPerPage,
        search: searchValue,
        sortField,
        sortOrder,
        includeInactive: true,
      });
      return res?.data || res;
    },
    keepPreviousData: true,
    retry: false,
    onError: (err: any) => {
      toast.error(err?.message || "Failed to fetch data");
    },
  });

  // ============================
  // GET SINGLE RECORD
  // ============================
  const getOne = async (id: string) => {
    try {
      const res = await axiosApi.getOne(`/${module}/${id}`);
      return res?.data || res;
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch record");
      throw err;
    }
  };

  // ============================
  // CREATE RECORD
  // ============================
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!role) throw new Error("Invalid role");
      const res = await axiosApi.post(`/${role}/${module}/create`, formData);
      return res?.data || res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Created successfully");
      queryClient.invalidateQueries({ queryKey }); // ✅ fix here
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to create");
    },
  });

  const createRecord = async (formData: FormData) => createMutation.mutateAsync(formData);

  // ============================
  // UPDATE RECORD
  // ============================
  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      if (!role) throw new Error("Invalid role");
      const res = await axiosApi.update(`/${role}/${module}/edit/${id}`, formData);
      return res?.data || res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Updated successfully");
      queryClient.invalidateQueries({ queryKey }); // ✅ fix here
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to update");
    },
  });

  const updateRecord = async (id: string, formData: FormData) =>
    updateMutation.mutateAsync({ id, formData });

  // ============================
  // TOGGLE STATUS
  // ============================
  const statusMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!role) throw new Error("Invalid role");
      const res = await axiosApi.patch(`/${role}/${module}/change/${id}/status`, {});
      return res?.data || res;
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData<any>(queryKey);
      queryClient.setQueryData<any>(queryKey, (old: any) => {
        if (!old?.clusters) return old;
        return {
          ...old,
          clusters: old.clusters.map((item: any) =>
            item._id === id ? { ...item, is_active: item.is_active ? 0 : 1 } : item
          ),
        };
      });
      return { previousData };
    },
    onError: (err: any, _id, context: any) => {
      toast.error(err?.message || "Failed to change status");
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey }); // ✅ fix here
    },
  });

  const toggleStatus = async (id: string) => statusMutation.mutateAsync(id);

  // ============================
  // DELETE RECORD
  // ============================
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!role) throw new Error("Invalid role");
      const res = await axiosApi.remove(`/${role}/${module}/delete/${id}`);
      return res?.data || res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "Deleted successfully");
      queryClient.invalidateQueries({ queryKey }); // ✅ fix here
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to delete");
    },
  });

  const deleteRecord = async (id: string) => {
    try {
      const res = await deleteMutation.mutateAsync(id);
      return { success: true, data: res };
    } catch (err: any) {
      return { success: false, message: err?.message };
    }
  };

  return {
    data,
    isLoading,
    refetch,
    getOne,
    createRecord,
    updateRecord,
    toggleStatus,
    deleteRecord,
  };
};
