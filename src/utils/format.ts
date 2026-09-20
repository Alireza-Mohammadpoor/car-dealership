export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(price);
}

export function formatMileage(mileage: number | null | undefined): string {
  if (mileage === null || mileage === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(mileage) + ' کیلومتر';
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return '—';
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  } catch {
    return dateString;
  }
}
