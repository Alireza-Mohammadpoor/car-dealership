import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchAllCars,
  fetchCarById,
  fetchDashboardStats,
  fetchLatestCars,
  searchCars,
  createCar,
  updateCar,
  deleteCar,
} from '@/services/cars';
import type { CarFormValues } from '@/types/car';

export function useCarsList() {
  return useQuery({
    queryKey: ['cars'],
    queryFn: fetchAllCars,
  });
}

export function useCarSearch(query: string) {
  return useQuery({
    queryKey: ['cars', 'search', query],
    queryFn: () => searchCars(query),
  });
}

export function useCar(id: string | undefined) {
  return useQuery({
    queryKey: ['cars', id],
    queryFn: () => fetchCarById(id as string),
    enabled: !!id,
  });
}

export function useLatestCars(limit = 8) {
  return useQuery({
    queryKey: ['cars', 'latest', limit],
    queryFn: () => fetchLatestCars(limit),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['cars', 'stats'],
    queryFn: fetchDashboardStats,
  });
}

export function useCreateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: CarFormValues) => createCar(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}

export function useUpdateCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: CarFormValues }) => updateCar(id, values),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      queryClient.invalidateQueries({ queryKey: ['cars', variables.id] });
    },
  });
}

export function useDeleteCar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
    },
  });
}
