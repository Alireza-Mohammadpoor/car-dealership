import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import type { CarImage } from '@/types/car';

export function ImageGallery({ images, alt }: { images: CarImage[]; alt: string }) {
  const sorted = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
  const [active, setActive] = useState(sorted[0]?.public_url);

  if (images.length === 0) {
    return (
      <div className="flex h-72 w-full items-center justify-center rounded-xl bg-slate-100 text-navy-300 sm:h-96">
        <ImageOff className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div>
      <div className="h-72 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-96">
        <img src={active} alt={alt} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img) => (
            <button
              key={img.id}
              onClick={() => setActive(img.public_url)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                active === img.public_url ? 'border-navy-800' : 'border-transparent'
              }`}
            >
              <img src={img.public_url} alt={alt} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
