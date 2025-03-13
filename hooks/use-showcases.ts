import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiService";
import { ShowcaseRequest, ShowcaseResponse, ShowcasesResponse } from "@/openapi-types";

const staleTime = 1000 * 60 * 5; // 5 minutes

export function useShowcases() {
  return useQuery({
    queryKey: ['showcases'],
    queryFn: async () => {
      const response = await apiClient.get('/showcases') as typeof ShowcasesResponse._type;
      return response;
    },
    staleTime,
  });
}

export const useShowcase = (slug  : string) => {
  return useQuery({
    queryKey: ['showcase', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/showcases/${slug}`) as typeof ShowcaseResponse._type;
      return response;
    },
    staleTime,
  });
}

export const useUpdateShowcase = (slug: string) => {
  return useMutation({
    mutationFn: async (data: typeof ShowcaseRequest._type) => {
      const response = await apiClient.put(`/showcases/${slug}`, data);
      return response;
    },
  })
}

export const useCreateShowcase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: typeof ShowcaseRequest._type) => {
      const response = await apiClient.post(`/showcases`, data);
      return response;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['showcases'] });
    }
  })
}