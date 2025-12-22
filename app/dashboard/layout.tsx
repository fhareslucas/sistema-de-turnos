"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { getProfile, logout } from "@/lib/redux/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  ClipboardList,
  Facebook,
  Linkedin,
  Github,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Spinner from "@/components/Spinner";
import Image from "next/image";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-linear-to-r from-[#134075] to-[#0f3460] text-white border-b-4 border-[#aec235] shadow-xl relative z-20">
          <div className="container mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <div className="bg-white/10 p-2.5 rounded-lg backdrop-blur-sm border border-white/10">
                <ClipboardList className="h-9 w-9 " />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Sistema de <span className="text-[#aec235]">Turnos</span>
                </h1>
                <p className="text-sm text-white/60 flex items-center gap-2 mt-1">
                  <span className="h-2 w-2 rounded-full bg-[#aec235] animate-pulse"></span>
                  Panel de Administración Profesional
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-lg leading-none">{user?.nombre}</p>
                <p className="text-xs text-[#aec235] mt-1 font-medium uppercase tracking-wider">
                  {user?.rol}
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-[#aec235] hover:bg-[#9db02e] text-[#134075] font-bold border-none transition-all hover:scale-105 active:scale-95 shadow-md"
              >
                <LogOut className="h-5 w-5" />
                <span>Salir</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>

        <footer className="bg-[#050a14] text-white/50 py-4 px-6 border-t border-white/5 mt-auto">
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Minimal Brand Section */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-white flex items-center justify-center overflow-hidden shrink-0">
                <Image
                  src="/RS-no-fondo.png"
                  alt="logo"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="text-sm font-bold tracking-tight text-white">
                Román<span className="text-[#afc235]">Soft</span>
              </span>
              <span className="hidden md:inline text-xs border-l border-white/10 pl-3">
                Desarrollo profesional de software
              </span>
            </div>

            {/* Compact Social & Copyright */}
            <div className="flex items-center gap-6">
              <p className="text-[10px] uppercase tracking-wider">
                © 2025 • Hecho en Guatemala
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
