import { useRef } from 'react';
import { Upload, X, Star, ImageOff, Loader2 } from 'lucide-react';
import type { CarImage } from '@/types/car';
import { validateImageFile } from '@/services/storage';
import { useToast } from '@/hooks/useToast';

export interface PendingImage {
  tempId: string;
  file: File;
  previewUrl: string;
  isPrimary: boolean;
}

interface ImageUploaderProps {
  existingImages: CarImage[];
  pendingImages: PendingImage[];
  onAddPending: (images: PendingImage[]) => void;
  onRemovePending: (tempId: string) => void;
  onRemoveExisting: (image: CarImage) => void;
  onSetPrimaryPending: (tempId: string) => void;
  onSetPrimaryExisting: (image: CarImage) => void;
  uploading?: boolean;
}

export function ImageUploader({
  existingImages,
  pendingImages,
  onAddPending,
  onRemovePending,
  onRemoveExisting,
  onSetPrimaryPending,
  onSetPrimaryExisting,
  uploading = false,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const hasAnyPrimary =
    existingImages.some((img) => img.is_primary) || pendingImages.some((img) => img.isPrimary);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    const valid: PendingImage[] = [];

    for (const file of files) {
      const error = validateImageFile(file);
      if (error) {
        showToast(error, 'error');
        continue;
      }
      valid.push({
        tempId: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isPrimary: false,
      });
    }

    if (valid.length > 0 && !hasAnyPrimary) {
      valid[0].isPrimary = true;
    }

    onAddPending(valid);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-navy-400 hover:bg-slate-100"
      >
        <Upload className="h-6 w-6 text-navy-400" />
        <p className="text-sm font-medium text-navy-700">برای انتخاب تصاویر کلیک کنید یا فایل را بکشید</p>
        <p className="text-xs text-navy-400">فرمت‌های مجاز: JPG، PNG، WebP — حداکثر ۱۰ مگابایت</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-navy-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          در حال آپلود تصاویر...
        </div>
      )}

      {(existingImages.length > 0 || pendingImages.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {existingImages.map((img) => (
            <div key={img.id} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
              <img src={img.public_url} alt="" className="h-full w-full object-cover" />
              {img.is_primary && (
                <span className="absolute right-1 top-1 rounded-full bg-navy-900/90 p-1 text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-current" />
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-navy-950/0 opacity-0 transition-all group-hover:bg-navy-950/40 group-hover:opacity-100">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => onSetPrimaryExisting(img)}
                    className="rounded-full bg-white p-1.5 text-navy-700 hover:bg-amber-100"
                    title="انتخاب به عنوان تصویر اصلی"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemoveExisting(img)}
                  className="rounded-full bg-white p-1.5 text-red-600 hover:bg-red-50"
                  title="حذف تصویر"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {pendingImages.map((img) => (
            <div key={img.tempId} className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200">
              <img src={img.previewUrl} alt="" className="h-full w-full object-cover" />
              {img.isPrimary && (
                <span className="absolute right-1 top-1 rounded-full bg-navy-900/90 p-1 text-amber-300">
                  <Star className="h-3.5 w-3.5 fill-current" />
                </span>
              )}
              <span className="absolute bottom-1 left-1 rounded bg-navy-900/80 px-1.5 py-0.5 text-[10px] text-white">
                جدید
              </span>
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-navy-950/0 opacity-0 transition-all group-hover:bg-navy-950/40 group-hover:opacity-100">
                {!img.isPrimary && (
                  <button
                    type="button"
                    onClick={() => onSetPrimaryPending(img.tempId)}
                    className="rounded-full bg-white p-1.5 text-navy-700 hover:bg-amber-100"
                    title="انتخاب به عنوان تصویر اصلی"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemovePending(img.tempId)}
                  className="rounded-full bg-white p-1.5 text-red-600 hover:bg-red-50"
                  title="حذف تصویر"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {existingImages.length === 0 && pendingImages.length === 0 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-navy-400">
          <ImageOff className="h-4 w-4" />
          هنوز تصویری اضافه نشده است.
        </div>
      )}
    </div>
  );
}
