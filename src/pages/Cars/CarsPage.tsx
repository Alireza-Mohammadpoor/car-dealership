import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PlusCircle, SearchX } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SearchBar } from '@/components/cars/SearchBar';
import { CarCard } from '@/components/cars/CarCard';
import { CarTable } from '@/components/cars/CarTable';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCarSearch } from '@/hooks/useCars';

export default function CarsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    const urlQuery = searchParams.get('q') ?? '';
    if (urlQuery !== query) setQuery(urlQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function handleChange(value: string) {
    setQuery(value);
    if (value) {
      setSearchParams({ q: value }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  const { data: cars, isLoading } = useCarSearch(query);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-navy-900">خودروها</h1>
          <p className="mt-1 text-sm text-navy-400">جستجو و مدیریت خودروهای نمایشگاه</p>
        </div>
        <button
          onClick={() => navigate('/cars/new')}
          className="flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-navy-800"
        >
          <PlusCircle className="h-4 w-4" />
          افزودن خودرو جدید
        </button>
      </div>

      <div className="mb-4">
        <SearchBar value={query} onChange={handleChange} autoFocus />
      </div>

      {isLoading ? (
        <LoadingState label="در حال بارگذاری خودروها..." />
      ) : !cars || cars.length === 0 ? (
        <EmptyState
          icon={<SearchX className="h-6 w-6" />}
          title={query ? 'خودرویی با این مشخصات پیدا نشد.' : 'هنوز خودرویی ثبت نشده است.'}
          description={query ? undefined : 'برای شروع، اولین خودروی نمایشگاه را ثبت کنید.'}
          action={
            <button
              onClick={() => navigate('/cars/new')}
              className="mt-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
            >
              {query ? 'افزودن خودرو جدید' : 'افزودن اولین خودرو'}
            </button>
          }
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-navy-500">{toPersianCount(cars.length)} خودرو پیدا شد</p>
          <div className="hidden lg:block">
            <CarTable cars={cars} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:hidden">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function toPersianCount(n: number): string {
  return new Intl.NumberFormat('fa-IR').format(n);
}
