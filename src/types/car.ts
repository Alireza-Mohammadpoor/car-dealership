export type CarStatus = 'available' | 'reserved' | 'sold';

export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  available: 'موجود',
  reserved: 'رزرو شده',
  sold: 'فروخته شده',
};

export const CAR_STATUS_OPTIONS: { value: CarStatus; label: string }[] = [
  { value: 'available', label: 'موجود' },
  { value: 'reserved', label: 'رزرو شده' },
  { value: 'sold', label: 'فروخته شده' },
];

export interface CarImage {
  id: string;
  car_id: string;
  storage_path: string;
  public_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Car {
  id: string;
  brand: string;
  model: string;
  trim: string | null;
  year: number;
  color: string | null;
  mileage: number | null;
  price: number;
  license_plate: string | null;
  vin: string | null;
  owner_name: string | null;
  owner_phone: string | null;
  status: CarStatus;
  description: string | null;
  created_at: string;
  updated_at: string;
  car_images?: CarImage[];
}

export interface CarWithPrimaryImage extends Car {
  primaryImageUrl?: string;
}

// Shape used by the Add/Edit car form (before persistence)
export interface CarFormValues {
  brand: string;
  model: string;
  trim?: string;
  year: number;
  color?: string;
  mileage?: number;
  price: number;
  license_plate?: string;
  vin?: string;
  owner_name?: string;
  owner_phone?: string;
  status: CarStatus;
  description?: string;
}

export interface DashboardStats {
  total: number;
  available: number;
  reserved: number;
  sold: number;
}
