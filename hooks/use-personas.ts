import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiService";
import { PersonaRequest, PersonaResponse, PersonasResponse } from "@/openapi-types";

const staleTime = 1000 * 60 * 5; // 5 minutes

export function usePersonas() {
  return useQuery({
    queryKey: ['personas'],
    queryFn: async () => {
      const response = await apiClient.get('/personas') as typeof PersonasResponse._type;
      return response;
    },
    staleTime,
  });
}

export const usePersona = (slug  : string) => {
  return useQuery({
    queryKey: ['persona', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/personas/${slug}`) as typeof PersonaResponse._type;
      return response;
    },
    staleTime,
  });
}

export const useUpdatePersona = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({slug,data}:{slug: string, data: typeof PersonaRequest._type}) => {
      const response = await apiClient.put(`/personas/${slug}`, data);
      return response;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    }
  })
}

export const useCreatePersona = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof PersonaRequest._type) => {
      const response = await apiClient.post(`/personas`, data);
      return response;
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    }
  })
}

export const useDeletePersona = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slug: string) => {
      const response = await apiClient.delete(`/personas/${slug}`);
      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['personas'] });
    }
  })
}
