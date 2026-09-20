import { supabase } from '@/lib/supabase';
import type { Car, CarFormValues, DashboardStats } from '@/types/car';

const CAR_SELECT = '*, car_images(*)';

export async function fetchAllCars(): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select(CAR_SELECT)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Car[];
}

export async function fetchLatestCars(limit = 8): Promise<Car[]> {
  const { data, error } = await supabase
    .from('cars')
    .select(CAR_SELECT)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as unknown as Car[];
}

export async function fetchCarById(id: string): Promise<Car | null> {
  const { data, error } = await supabase
    .from('cars')
    .select(CAR_SELECT)
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as unknown as Car | null;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data, error } = await supabase.from('cars').select('status');
  if (error) throw error;

  const rows = (data ?? []) as { status: string }[];
  return {
    total: rows.length,
    available: rows.filter((r) => r.status === 'available').length,
    reserved: rows.filter((r) => r.status === 'reserved').length,
    sold: rows.filter((r) => r.status === 'sold').length,
  };
}

export async function createCar(values: CarFormValues): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .insert({
      brand: values.brand,
      model: values.model,
      trim: values.trim || null,
      year: values.year,
      color: values.color || null,
      mileage: values.mileage ?? null,
      price: values.price,
      license_plate: values.license_plate || null,
      vin: values.vin || null,
      owner_name: values.owner_name || null,
      owner_phone: values.owner_phone || null,
      status: values.status,
      description: values.description || null,
    })
    .select(CAR_SELECT)
    .single();

  if (error) throw error;
  return data as unknown as Car;
}

export async function updateCar(id: string, values: CarFormValues): Promise<Car> {
  const { data, error } = await supabase
    .from('cars')
    .update({
      brand: values.brand,
      model: values.model,
      trim: values.trim || null,
      year: values.year,
      color: values.color || null,
      mileage: values.mileage ?? null,
      price: values.price,
      license_plate: values.license_plate || null,
      vin: values.vin || null,
      owner_name: values.owner_name || null,
      owner_phone: values.owner_phone || null,
      status: values.status,
      description: values.description || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(CAR_SELECT)
    .single();

  if (error) throw error;
  return data as unknown as Car;
}

export async function deleteCar(id: string): Promise<void> {
  const { error } = await supabase.from('cars').delete().eq('id', id);
  if (error) throw error;
}

/**
 * Global search across every relevant car field.
 * Uses Postgres ILIKE for partial, case-insensitive matching on text fields,
 * and casts numeric fields (year, price, mileage) to text so numeric queries
 * like "2022" or "0912..." also match.
 */
export async function searchCars(query: string): Promise<Car[]> {
  const trimmed = query.trim();
  if (!trimmed) return fetchAllCars();

  const pattern = `%${trimmed}%`;

  const { data, error } = await supabase
    .from('cars')
    .select(CAR_SELECT)
    .or(
      [
        `brand.ilike.${pattern}`,
        `model.ilike.${pattern}`,
        `trim.ilike.${pattern}`,
        `color.ilike.${pattern}`,
        `license_plate.ilike.${pattern}`,
        `vin.ilike.${pattern}`,
        `owner_name.ilike.${pattern}`,
        `owner_phone.ilike.${pattern}`,
        `description.ilike.${pattern}`,
        `year::text.ilike.${pattern}`,
        `price::text.ilike.${pattern}`,
        `mileage::text.ilike.${pattern}`,
      ].join(',')
    )
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as unknown as Car[];
}

export async function setPrimaryImage(carId: string, imageId: string): Promise<void> {
  // Unset any existing primary image for this car, then set the chosen one.
  const { error: clearError } = await supabase
    .from('car_images')
    .update({ is_primary: false })
    .eq('car_id', carId);
  if (clearError) throw clearError;

  const { error: setError } = await supabase
    .from('car_images')
    .update({ is_primary: true })
    .eq('id', imageId);
  if (setError) throw setError;
}
