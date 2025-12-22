"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

export default function PantallaLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        // El navegador maneja ESC por defecto, pero actualizamos estado por si acaso
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-background w-screen h-screen overflow-hidden flex flex-col">
        {/* Botón discreto para salir */}
        <Button
          onClick={toggleFullscreen}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity bg-black/20 text-white hover:bg-black/40 rounded-full"
        >
          <Minimize2 className="h-6 w-6" />
        </Button>
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <h1 className="text-2xl font-bold text-[#aec235]">{title}</h1>
        <Button onClick={toggleFullscreen} variant="outline" className="gap-2">
          <Maximize2 className="h-4 w-4" />
          Pantalla Completa
        </Button>
      </div>
      <div className="flex-1 overflow-hidden relative bg-background">
        {children}
      </div>
    </div>
  );
}
