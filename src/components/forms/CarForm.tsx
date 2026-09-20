import type { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import type { CarFormValues } from '@/types/car';
import { CAR_STATUS_OPTIONS } from '@/types/car';

const currentYear = new Date().getFullYear() + 1;

const carSchema = z.object({
  brand: z.string().min(1, 'وارد کردن برند خودرو الزامی است.'),
  model: z.string().min(1, 'وارد کردن مدل خودرو الزامی است.'),
  trim: z.string().optional(),
  year: z
    .number({ invalid_type_error: 'سال تولید باید عدد باشد.' })
    .int('سال تولید باید عدد صحیح باشد.')
    .min(1300, 'سال تولید معتبر نیست.')
    .max(currentYear, 'سال تولید معتبر نیست.'),
  color: z.string().optional(),
  mileage: z
    .number({ invalid_type_error: 'کارکرد باید عدد باشد.' })
    .min(0, 'کارکرد نمی‌تواند منفی باشد.')
    .optional(),
  price: z
    .number({ invalid_type_error: 'قیمت باید عدد باشد.' })
    .min(1, 'وارد کردن قیمت الزامی است.'),
  license_plate: z.string().optional(),
  vin: z.string().optional(),
  owner_name: z.string().optional(),
  owner_phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[0-9+\-\s]{7,15}$/.test(val), {
      message: 'شماره تماس معتبر نیست.',
    }),
  status: z.enum(['available', 'reserved', 'sold']),
  description: z.string().optional(),
});

interface CarFormProps {
  defaultValues?: Partial<CarFormValues>;
  onSubmit: (values: CarFormValues) => void;
  submitLabel?: string;
  submitting?: boolean;
}

export function CarForm({ defaultValues, onSubmit, submitLabel = 'ذخیره', submitting = false }: CarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CarFormValues>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      status: 'available',
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Section title="اطلاعات خودرو">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="برند" error={errors.brand?.message} required>
            <input {...register('brand')} className={inputClass(!!errors.brand)} placeholder="مثلاً پراید" />
          </Field>
          <Field label="مدل" error={errors.model?.message} required>
            <input {...register('model')} className={inputClass(!!errors.model)} placeholder="مثلاً ۱۳۱" />
          </Field>
          <Field label="تیپ">
            <input {...register('trim')} className={inputClass(false)} placeholder="مثلاً SE" />
          </Field>
          <Field label="سال" error={errors.year?.message} required>
            <input
              type="number"
              {...register('year', { valueAsNumber: true })}
              className={inputClass(!!errors.year) + ' ltr-field'}
              placeholder="۱۴۰۲"
            />
          </Field>
          <Field label="رنگ">
            <input {...register('color')} className={inputClass(false)} placeholder="مثلاً سفید" />
          </Field>
          <Field label="کارکرد (کیلومتر)" error={errors.mileage?.message}>
            <input
              type="number"
              {...register('mileage', { valueAsNumber: true })}
              className={inputClass(!!errors.mileage) + ' ltr-field'}
              placeholder="مثلاً ۵۰۰۰۰"
            />
          </Field>
          <Field label="قیمت (تومان)" error={errors.price?.message} required>
            <input
              type="number"
              {...register('price', { valueAsNumber: true })}
              className={inputClass(!!errors.price) + ' ltr-field'}
              placeholder="مثلاً ۵۰۰۰۰۰۰۰۰"
            />
          </Field>
          <Field label="پلاک">
            <input {...register('license_plate')} className={inputClass(false) + ' ltr-field'} placeholder="مثلاً ۱۲ ط ۳۴۵ ایران ۶۶" />
          </Field>
          <Field label="شماره شاسی / VIN">
            <input {...register('vin')} className={inputClass(false) + ' ltr-field'} placeholder="VIN" />
          </Field>
        </div>
      </Section>

      <Section title="اطلاعات مالک">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="نام مالک">
            <input {...register('owner_name')} className={inputClass(false)} placeholder="نام و نام خانوادگی" />
          </Field>
          <Field label="شماره تماس مالک" error={errors.owner_phone?.message}>
            <input
              {...register('owner_phone')}
              className={inputClass(!!errors.owner_phone) + ' ltr-field'}
              placeholder="۰۹۱۲۱۲۳۴۵۶۷"
            />
          </Field>
        </div>
      </Section>

      <Section title="اطلاعات تکمیلی">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="وضعیت خودرو" required>
            <select {...register('status')} className={inputClass(false)}>
              {CAR_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="توضیحات">
          <textarea
            {...register('description')}
            rows={4}
            className={inputClass(false)}
            placeholder="توضیحات تکمیلی درباره خودرو..."
          />
        </Field>
      </Section>

      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-6">
        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60 sm:w-auto"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? 'در حال ذخیره...' : submitLabel}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
      <h3 className="mb-4 text-sm font-bold text-navy-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-navy-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border px-3 py-2.5 text-sm text-navy-900 outline-none placeholder:text-navy-300 focus:ring-2 ${
    hasError
      ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
      : 'border-slate-200 focus:border-navy-400 focus:ring-navy-100'
  }`;
}
