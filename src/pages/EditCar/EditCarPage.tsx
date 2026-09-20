import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CarForm } from '@/components/forms/CarForm';
import { ImageUploader, type PendingImage } from '@/components/forms/ImageUploader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { useCar, useUpdateCar } from '@/hooks/useCars';
import { uploadCarImage, deleteCarImage } from '@/services/storage';
import { setPrimaryImage } from '@/services/cars';
import { useToast } from '@/hooks/useToast';
import { useQueryClient } from '@tanstack/react-query';
import type { CarFormValues, CarImage } from '@/types/car';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data: car, isLoading } = useCar(id);
  const updateCar = useUpdateCar();

  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [newPrimaryExistingId, setNewPrimaryExistingId] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState label="در حال بارگذاری اطلاعات خودرو..." />
      </DashboardLayout>
    );
  }

  if (!car || !id) {
    return (
      <DashboardLayout>
        <EmptyState title="خودرو مورد نظر پیدا نشد." />
      </DashboardLayout>
    );
  }

  const visibleExistingImages = (car.car_images ?? []).filter(
    (img) => !removedImageIds.includes(img.id)
  );

  function handleAddPending(images: PendingImage[]) {
    setPendingImages((prev) => [...prev, ...images]);
  }

  function handleRemovePending(tempId: string) {
    setPendingImages((prev) => prev.filter((p) => p.tempId !== tempId));
  }

  function handleSetPrimaryPending(tempId: string) {
    setPendingImages((prev) => prev.map((p) => ({ ...p, isPrimary: p.tempId === tempId })));
    setNewPrimaryExistingId(null);
  }

  function handleRemoveExisting(image: CarImage) {
    setRemovedImageIds((prev) => [...prev, image.id]);
  }

  function handleSetPrimaryExisting(image: CarImage) {
    setNewPrimaryExistingId(image.id);
    setPendingImages((prev) => prev.map((p) => ({ ...p, isPrimary: false })));
  }

  async function handleSubmit(values: CarFormValues) {
    if (!car || !id) return;
    try {
      await updateCar.mutateAsync({ id, values });

      // Remove images marked for deletion
      const imagesToRemove = (car.car_images ?? []).filter((img) => removedImageIds.includes(img.id));
      for (const img of imagesToRemove) {
        await deleteCarImage(img);
      }

      // Upload newly added images
      if (pendingImages.length > 0) {
        setUploadingImages(true);
        for (const img of pendingImages) {
          await uploadCarImage(id, img.file, img.isPrimary);
        }
        setUploadingImages(false);
      }

      // Update primary image selection if an existing image was chosen
      if (newPrimaryExistingId) {
        await setPrimaryImage(id, newPrimaryExistingId);
      }

      queryClient.invalidateQueries({ queryKey: ['cars', id] });
      showToast('اطلاعات خودرو با موفقیت بروزرسانی شد.', 'success');
      navigate(`/cars/${id}`);
    } catch (err) {
      setUploadingImages(false);
      showToast('بروزرسانی خودرو با خطا مواجه شد. لطفاً دوباره تلاش کنید.', 'error');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={() => navigate(`/cars/${id}`)}
          className="mb-3 flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </button>
        <h1 className="text-xl font-bold text-navy-900">ویرایش خودرو</h1>
        <p className="mt-1 text-sm text-navy-400">
          {car.brand} {car.model}
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-bold text-navy-900">تصاویر</h3>
        <ImageUploader
          existingImages={visibleExistingImages.map((img) =>
            img.id === newPrimaryExistingId ? { ...img, is_primary: true } : { ...img, is_primary: img.is_primary && !newPrimaryExistingId }
          )}
          pendingImages={pendingImages}
          onAddPending={handleAddPending}
          onRemovePending={handleRemovePending}
          onRemoveExisting={handleRemoveExisting}
          onSetPrimaryPending={handleSetPrimaryPending}
          onSetPrimaryExisting={handleSetPrimaryExisting}
          uploading={uploadingImages}
        />
      </div>

      <CarForm
        defaultValues={{
          brand: car.brand,
          model: car.model,
          trim: car.trim ?? undefined,
          year: car.year,
          color: car.color ?? undefined,
          mileage: car.mileage ?? undefined,
          price: car.price,
          license_plate: car.license_plate ?? undefined,
          vin: car.vin ?? undefined,
          owner_name: car.owner_name ?? undefined,
          owner_phone: car.owner_phone ?? undefined,
          status: car.status,
          description: car.description ?? undefined,
        }}
        onSubmit={handleSubmit}
        submitting={updateCar.isPending || uploadingImages}
        submitLabel="ذخیره تغییرات"
      />
    </DashboardLayout>
  );
}
