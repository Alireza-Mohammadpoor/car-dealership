import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Pencil, Trash2, Phone, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { ImageGallery } from '@/components/cars/ImageGallery';
import { useCar, useDeleteCar } from '@/hooks/useCars';
import { formatPrice, formatMileage, formatDate, formatDateTime } from '@/utils/format';
import { deleteAllCarImages } from '@/services/storage';
import { useToast } from '@/hooks/useToast';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: car, isLoading } = useCar(id);
  const deleteCar = useDeleteCar();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState label="در حال بارگذاری اطلاعات خودرو..." />
      </DashboardLayout>
    );
  }

  if (!car) {
    return (
      <DashboardLayout>
        <EmptyState title="خودرو مورد نظر پیدا نشد." />
      </DashboardLayout>
    );
  }

  async function handleDelete() {
    if (!car) return;
    try {
      if (car.car_images && car.car_images.length > 0) {
        await deleteAllCarImages(car.car_images);
      }
      await deleteCar.mutateAsync(car.id);
      showToast('خودرو با موفقیت حذف شد.', 'success');
      navigate('/cars');
    } catch (err) {
      showToast('حذف خودرو با خطا مواجه شد.', 'error');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setConfirmOpen(false);
    }
  }

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate('/cars')}
        className="mb-4 flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ImageGallery images={car.car_images ?? []} alt={`${car.brand} ${car.model}`} />
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div>
                <h1 className="text-lg font-bold text-navy-900">
                  {car.brand} {car.model} {car.trim ? `(${car.trim})` : ''}
                </h1>
                <p className="text-sm text-navy-400">{car.year}</p>
              </div>
              <StatusBadge status={car.status} />
            </div>

            <p className="text-2xl font-bold text-navy-900">{formatPrice(car.price)} <span className="text-sm font-normal text-navy-400">تومان</span></p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/cars/${car.id}/edit`)}
                className="flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-medium text-white hover:bg-navy-800"
              >
                <Pencil className="h-4 w-4" />
                ویرایش خودرو
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                حذف خودرو
              </button>
            </div>
          </div>

          <Section title="مشخصات خودرو">
            <InfoRow label="برند" value={car.brand} />
            <InfoRow label="مدل" value={car.model} />
            <InfoRow label="تیپ" value={car.trim} />
            <InfoRow label="سال" value={String(car.year)} ltr />
            <InfoRow label="رنگ" value={car.color} />
            <InfoRow label="کارکرد" value={formatMileage(car.mileage)} />
            <InfoRow label="پلاک" value={car.license_plate} ltr />
            <InfoRow label="VIN" value={car.vin} ltr />
          </Section>

          <Section title="اطلاعات مالک">
            <InfoRow label="نام مالک" value={car.owner_name} icon={<User className="h-3.5 w-3.5" />} />
            <div className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
              <span className="flex items-center gap-1.5 text-navy-400">
                <Phone className="h-3.5 w-3.5" />
                شماره تماس
              </span>
              {car.owner_phone ? (
                <a href={`tel:${car.owner_phone}`} className="ltr-field font-medium text-accent-600 hover:underline">
                  {car.owner_phone}
                </a>
              ) : (
                <span className="text-navy-300">—</span>
              )}
            </div>
          </Section>

          {car.description && (
            <Section title="توضیحات">
              <p className="whitespace-pre-line text-sm leading-7 text-navy-700">{car.description}</p>
            </Section>
          )}

          <Section title="تاریخچه">
            <InfoRow label="تاریخ ثبت" value={formatDate(car.created_at)} />
            <InfoRow label="آخرین بروزرسانی" value={formatDateTime(car.updated_at)} />
          </Section>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        title="آیا از حذف این خودرو مطمئن هستید؟"
        description="این عملیات قابل بازگشت نیست و تمامی تصاویر مرتبط نیز حذف خواهند شد."
        confirmLabel="حذف خودرو"
        cancelLabel="انصراف"
        loading={deleteCar.isPending}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-2 text-sm font-bold text-navy-900">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  ltr,
  icon,
}: {
  label: string;
  value?: string | null;
  ltr?: boolean;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="flex items-center gap-1.5 text-navy-400">
        {icon}
        {label}
      </span>
      <span className={`font-medium text-navy-800 ${ltr ? 'ltr-field' : ''}`}>{value || '—'}</span>
    </div>
  );
}
