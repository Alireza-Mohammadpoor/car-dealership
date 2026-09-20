import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CarForm } from '@/components/forms/CarForm';
import { ImageUploader, type PendingImage } from '@/components/forms/ImageUploader';
import { useCreateCar } from '@/hooks/useCars';
import { uploadCarImage } from '@/services/storage';
import { useToast } from '@/hooks/useToast';
import type { CarFormValues } from '@/types/car';

export default function AddCarPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const createCar = useCreateCar();
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  function handleAddPending(images: PendingImage[]) {
    setPendingImages((prev) => [...prev, ...images]);
  }

  function handleRemovePending(tempId: string) {
    setPendingImages((prev) => {
      const removed = prev.find((p) => p.tempId === tempId);
      const rest = prev.filter((p) => p.tempId !== tempId);
      if (removed?.isPrimary && rest.length > 0) {
        rest[0].isPrimary = true;
      }
      return [...rest];
    });
  }

  function handleSetPrimaryPending(tempId: string) {
    setPendingImages((prev) => prev.map((p) => ({ ...p, isPrimary: p.tempId === tempId })));
  }

  async function handleSubmit(values: CarFormValues) {
    try {
      const car = await createCar.mutateAsync(values);

      if (pendingImages.length > 0) {
        setUploadingImages(true);
        for (const img of pendingImages) {
          await uploadCarImage(car.id, img.file, img.isPrimary);
        }
        setUploadingImages(false);
      }

      showToast('خودرو با موفقیت ثبت شد.', 'success');
      navigate(`/cars/${car.id}`);
    } catch (err) {
      setUploadingImages(false);
      showToast('ثبت خودرو با خطا مواجه شد. لطفاً دوباره تلاش کنید.', 'error');
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <button
          onClick={() => navigate('/cars')}
          className="mb-3 flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست
        </button>
        <h1 className="text-xl font-bold text-navy-900">افزودن خودرو جدید</h1>
        <p className="mt-1 text-sm text-navy-400">اطلاعات خودرو و تصاویر آن را وارد کنید</p>
      </div>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <h3 className="mb-4 text-sm font-bold text-navy-900">تصاویر</h3>
        <ImageUploader
          existingImages={[]}
          pendingImages={pendingImages}
          onAddPending={handleAddPending}
          onRemovePending={handleRemovePending}
          onRemoveExisting={() => {}}
          onSetPrimaryPending={handleSetPrimaryPending}
          onSetPrimaryExisting={() => {}}
          uploading={uploadingImages}
        />
      </div>

      <CarForm
        onSubmit={handleSubmit}
        submitting={createCar.isPending || uploadingImages}
        submitLabel="ثبت خودرو"
      />
    </DashboardLayout>
  );
}
