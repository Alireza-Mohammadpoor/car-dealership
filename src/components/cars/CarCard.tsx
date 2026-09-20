import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import type { Car } from '@/types/car';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPrice, formatMileage } from '@/utils/format';

export function CarCard({ car }: { car: Car }) {
  const primaryImage =
    car.car_images?.find((img) => img.is_primary)?.public_url ?? car.car_images?.[0]?.public_url;

  return (
    <Link
      to={`/cars/${car.id}`}
      className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {primaryImage ? (
          <img src={primaryImage} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-300">
            <ImageOff className="h-6 w-6" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <p className="truncate text-sm font-semibold text-navy-900">
            {car.brand} {car.model} {car.trim ? `(${car.trim})` : ''}
          </p>
          <p className="mt-0.5 text-xs text-navy-400">
            {car.year} · {car.color ?? '—'} · {formatMileage(car.mileage)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-navy-900">{formatPrice(car.price)} تومان</p>
          <StatusBadge status={car.status} />
        </div>
      </div>
    </Link>
  );
}
