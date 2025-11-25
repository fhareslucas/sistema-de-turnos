'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { getProfile, logout } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Settings, LogOut, ClipboardList, LayoutDashboard } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getProfile());
    } else if (!token) {
      router.push('/login');
    }
  }, [dispatch, router, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <ClipboardList className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Sistema de Turnos</h1>
              <p className="text-sm text-primary-100">Panel de Administración</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-semibold">{user?.nombre}</p>
              <p className="text-xs text-primary-100 capitalize">{user?.rol}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1">
            <Link href="/dashboard">
              <Button variant="ghost" className="flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/turnos">
              <Button variant="ghost" className="flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Turnos
              </Button>
            </Link>
            <Link href="/dashboard/mesas">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Mesas
              </Button>
            </Link>
            <Link href="/dashboard/servicios">
              <Button variant="ghost" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Servicios
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © 2024 Sistema de Turnos. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
