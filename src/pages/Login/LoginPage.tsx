import { useState, type FormEvent } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CarFront, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
  const { user, signIn, loading } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    const from = (location.state as { from?: string })?.from ?? '/dashboard';
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('لطفاً ایمیل و رمز عبور را وارد کنید.');
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError(signInError);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy-900 text-white">
            <CarFront className="h-7 w-7" />
          </div>
          <h1 className="text-lg font-bold text-navy-900">ورود به پنل نمایشگاه</h1>
          <p className="text-sm text-navy-400">برای مدیریت خودروها وارد شوید</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700">ایمیل</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none ltr-field focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                placeholder="admin@example.com"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-navy-700">رمز عبور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 pe-10 text-sm outline-none ltr-field focus:border-navy-400 focus:ring-2 focus:ring-navy-100"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              ورود
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
