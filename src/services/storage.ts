import { supabase, CAR_IMAGES_BUCKET } from '@/lib/supabase';
import type { CarImage } from '@/types/car';

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Resizes/compresses an image file in the browser before upload, to keep
 * storage usage and load times reasonable. Falls back to the original file
 * if compression fails for any reason.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/webp', JPEG_QUALITY)
    );
    if (!blob) return file;

    const newName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
    return new File([blob], newName, { type: 'image/webp' });
  } catch {
    return file;
  }
}

export function validateImageFile(file: File): string | null {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSizeBytes = 10 * 1024 * 1024; // 10MB before compression

  if (!allowedTypes.includes(file.type)) {
    return 'فرمت تصویر مجاز نیست. لطفاً از JPG، PNG یا WebP استفاده کنید.';
  }
  if (file.size > maxSizeBytes) {
    return 'حجم تصویر بیش از حد مجاز است (حداکثر ۱۰ مگابایت).';
  }
  return null;
}

export async function uploadCarImage(
  carId: string,
  file: File,
  isPrimary: boolean
): Promise<CarImage> {
  const compressed = await compressImage(file);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const storagePath = `${carId}/${uniqueName}`;

  const { error: uploadError } = await supabase.storage
    .from(CAR_IMAGES_BUCKET)
    .upload(storagePath, compressed, {
      cacheControl: '3600',
      upsert: false,
      contentType: compressed.type || 'image/webp',
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData } = supabase.storage
    .from(CAR_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  const { data, error } = await supabase
    .from('car_images')
    .insert({
      car_id: carId,
      storage_path: storagePath,
      public_url: publicUrlData.publicUrl,
      is_primary: isPrimary,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CarImage;
}

export async function deleteCarImage(image: CarImage): Promise<void> {
  const { error: storageError } = await supabase.storage
    .from(CAR_IMAGES_BUCKET)
    .remove([image.storage_path]);
  // Continue even if storage removal fails (e.g. already deleted) so the
  // database stays consistent; log for visibility.
  if (storageError) {
    // eslint-disable-next-line no-console
    console.warn('Could not remove image from storage:', storageError.message);
  }

  const { error } = await supabase.from('car_images').delete().eq('id', image.id);
  if (error) throw error;
}

export async function deleteAllCarImages(images: CarImage[]): Promise<void> {
  if (images.length === 0) return;
  const paths = images.map((img) => img.storage_path);
  const { error: storageError } = await supabase.storage.from(CAR_IMAGES_BUCKET).remove(paths);
  if (storageError) {
    // eslint-disable-next-line no-console
    console.warn('Could not remove images from storage:', storageError.message);
  }
  // car_images rows are removed automatically via ON DELETE CASCADE when the car is deleted.
}
