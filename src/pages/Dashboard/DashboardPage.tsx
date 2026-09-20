import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, CheckCircle2, Clock, DollarSign, PlusCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/cars/SearchBar';
import { CarCard } from '@/components/cars/CarCard';
import { CarTable } from '@/components/cars/CarTable';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useDashboardStats, useLatestCars } from '@/hooks/useCars';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: latestCars, isLoading: carsLoading } = useLatestCars(8);

  function handleSearchChange(value: string) {
    setSearchValue(value);
    if (value.trim()) {
      navigate(`/cars?q=${encodeURIComponent(value.trim())}`);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-navy-900">داشبورد</h1>
        <p className="mt-1 text-sm text-navy-400">خلاصه وضعیت نمایشگاه شما</p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="جستجوی خودرو بر اساس برند، مدل، پلاک، شماره تماس، VIN و ..."
        />
      </div>

      <StatCards stats={stats} loading={statsLoading} />

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy-900">آخرین خودروهای ثبت‌شده</h2>
          <button
            onClick={() => navigate('/cars/new')}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-navy-700 hover:bg-slate-100"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            افزودن خودرو
          </button>
        </div>

        {carsLoading ? (
          <LoadingState label="در حال بارگذاری خودروها..." />
        ) : !latestCars || latestCars.length === 0 ? (
          <EmptyState
            title="هنوز خودرویی ثبت نشده است."
            description="برای شروع، اولین خودروی نمایشگاه را ثبت کنید."
            action={
              <button
                onClick={() => navigate('/cars/new')}
                className="mt-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                افزودن اولین خودرو
              </button>
            }
          />
        ) : (
          <>
            <div className="hidden lg:block">
              <CarTable cars={latestCars} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
              {latestCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function StatCards({
  stats,
  loading,
}: {
  stats?: { total: number; available: number; reserved: number; sold: number };
  loading: boolean;
}) {
  const cards = [
    { label: 'تعداد کل خودروها', value: stats?.total, icon: Car, color: 'text-navy-700 bg-navy-50' },
    { label: 'خودروهای موجود', value: stats?.available, icon: CheckCircle2, color: 'text-emerald-700 bg-emerald-50' },
    { label: 'خودروهای رزرو شده', value: stats?.reserved, icon: Clock, color: 'text-amber-700 bg-amber-50' },
    { label: 'خودروهای فروخته شده', value: stats?.sold, icon: DollarSign, color: 'text-slate-700 bg-slate-100' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4">
          <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${card.color}`}>
            <card.icon className="h-[18px] w-[18px]" />
          </div>
          <p className="text-2xl font-bold text-navy-900">{loading ? '—' : card.value ?? 0}</p>
          <p className="mt-1 text-xs text-navy-400">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
