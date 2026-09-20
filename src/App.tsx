import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/useToast';
import LoginPage from '@/pages/Login/LoginPage';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import CarsPage from '@/pages/Cars/CarsPage';
import AddCarPage from '@/pages/AddCar/AddCarPage';
import CarDetailsPage from '@/pages/CarDetails/CarDetailsPage';
import EditCarPage from '@/pages/EditCar/EditCarPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-navy-400">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars"
        element={
          <ProtectedRoute>
            <CarsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/new"
        element={
          <ProtectedRoute>
            <AddCarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <ProtectedRoute>
            <CarDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cars/:id/edit"
        element={
          <ProtectedRoute>
            <EditCarPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
