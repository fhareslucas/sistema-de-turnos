"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getProfile, logout } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import { LogOut, ClipboardList } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      dispatch(getProfile());
    } else if (!token) {
      router.push("/auth/login");
    }
  }, [dispatch, router, user]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-primary text-white shadow-lg">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ClipboardList className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Sistema de Turnos</h1>
                <p className="text-sm text-primary-100">
                  Panel de Administración
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-semibold">{user?.nombre}</p>
                <p className="text-xs text-primary-100 capitalize">
                  {user?.rol}
                </p>
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

        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>

        <footer className="bg-white border-t mt-auto">
          <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
            © 2024 Sistema de Turnos. Todos los derechos reservados.
          </div>
        </footer>
      </div>
    </div>
  );
}
