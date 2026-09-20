import { Link } from 'react-router-dom';
import { ImageOff, Eye } from 'lucide-react';
import type { Car } from '@/types/car';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatPrice, formatMileage } from '@/utils/format';

export function CarTable({ cars }: { cars: Car[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full min-w-[720px] text-right text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-navy-400">
            <th className="px-4 py-3 font-medium">عکس</th>
            <th className="px-4 py-3 font-medium">خودرو</th>
            <th className="px-4 py-3 font-medium">سال</th>
            <th className="px-4 py-3 font-medium">رنگ</th>
            <th className="px-4 py-3 font-medium">کارکرد</th>
            <th className="px-4 py-3 font-medium">قیمت (تومان)</th>
            <th className="px-4 py-3 font-medium">وضعیت</th>
            <th className="px-4 py-3 font-medium">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {cars.map((car) => {
            const primaryImage =
              car.car_images?.find((img) => img.is_primary)?.public_url ??
              car.car_images?.[0]?.public_url;
            return (
              <tr key={car.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="h-12 w-14 overflow-hidden rounded-lg bg-slate-100">
                    {primaryImage ? (
                      <img src={primaryImage} alt={car.model} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-navy-300">
                        <ImageOff className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-navy-900">
                    {car.brand} {car.model}
                  </p>
                  <p className="text-xs text-navy-400">{car.trim ?? ''}</p>
                </td>
                <td className="px-4 py-3 text-navy-700">{car.year}</td>
                <td className="px-4 py-3 text-navy-700">{car.color ?? '—'}</td>
                <td className="px-4 py-3 text-navy-700">{formatMileage(car.mileage)}</td>
                <td className="px-4 py-3 font-medium text-navy-900">{formatPrice(car.price)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={car.status} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    to={`/cars/${car.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-slate-100"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    مشاهده جزئیات
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
