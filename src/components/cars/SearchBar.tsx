import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'جستجوی خودرو بر اساس برند، مدل، پلاک، شماره تماس، VIN و ...',
  autoFocus,
}: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-navy-400" />
      <input
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pe-12 ps-11 text-sm text-navy-900 shadow-sm outline-none placeholder:text-navy-300 focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-navy-400 hover:bg-slate-100"
          aria-label="پاک کردن جستجو"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
