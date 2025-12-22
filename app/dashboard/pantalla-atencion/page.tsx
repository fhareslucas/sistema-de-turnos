"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchTurnos } from "@/lib/redux/slices/turnosSlice";
import PantallaLayout from "@/components/PantallaLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function PantallaAtencionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { turnos } = useSelector((state: RootState) => state.turnos);

  useEffect(() => {
    dispatch(fetchTurnos());
    const interval = setInterval(() => {
      dispatch(fetchTurnos());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const turnosEnAtencion = turnos.filter((t) => t.estado === "en_atencion");

  const turnosEnEspera = turnos
    .filter((t) => t.estado === "en_espera")
    .sort((a, b) => {
      const prioA = a.prioridad === true || a.prioridad === 1;
      const prioB = b.prioridad === true || b.prioridad === 1;

      if (prioA && !prioB) return -1;
      if (!prioA && prioB) return 1;

      const fechaA = a.createdAt || a.created_at || "";
      const fechaB = b.createdAt || b.created_at || "";
      return new Date(fechaA).getTime() - new Date(fechaB).getTime();
    })
    .slice(0, 8);

  return (
    <PantallaLayout title="Pantalla de Turnos">
      <div className="h-full w-full flex flex-col md:flex-row bg-slate-50 overflow-hidden">
        {/* SECCIÓN EN ATENCIÓN (50%) */}
        <div className="flex-1 p-4 border-r border-slate-200 overflow-y-auto no-scrollbar flex flex-col gap-4 bg-slate-50">
          <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-3 border-b border-blue-200 mb-2">
            <h2 className="text-2xl font-bold text-customGreen text-center uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              En Atención
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {turnosEnAtencion.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                <p className="text-lg text-slate-400 font-medium">
                  Esperando llamados...
                </p>
              </div>
            ) : (
              turnosEnAtencion.map((turno) => (
                <Card
                  key={turno.id}
                  className="overflow-hidden bg-white shadow-sm border border-slate-200 rounded-xl h-32 flex flex-row relative group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-600"></div>
                  <CardContent className="p-0 flex w-full">
                    {/* Código */}
                    <div className="w-[40%] flex flex-col justify-center items-center p-2 border-r border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Turno
                      </span>
                      <span className="text-5xl font-black text-slate-800 tracking-tighter whitespace-nowrap">
                        {turno.codigo}
                      </span>
                    </div>

                    {/* Mesa */}
                    <div className="w-[60%] flex flex-col justify-center items-center p-2 bg-blue-100/30">
                      <p className="text-blue-500 font-semibold uppercase text-xs tracking-wider mb-1">
                        Pasar A
                      </p>
                      <div className="text-center leading-none w-full px-2">
                        <span className="block text-3xl font-bold text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis">
                          {turno.mesa
                            ? `Mesa ${turno.mesa.numero}`
                            : "Recepción"}
                        </span>
                        {turno.mesa && (
                          <span className="text-sm font-medium text-slate-500 block mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            {turno.mesa.nombre}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* SECCIÓN EN ESPERA (50%) */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col gap-4 bg-slate-50">
          <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-10 py-3 border-b border-yellow-200 mb-2">
            <h2 className="text-2xl font-bold text-customGreen text-center uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
              En Espera
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {turnosEnEspera.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                <p className="text-lg text-slate-400 font-medium">
                  No hay espera
                </p>
              </div>
            ) : (
              turnosEnEspera.map((turno) => (
                <Card
                  key={turno.id}
                  className="overflow-hidden bg-white shadow-sm border border-slate-200 rounded-xl h-32 flex flex-row relative group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-yellow-500"></div>
                  <CardContent className="p-0 flex w-full">
                    {/* Código */}
                    <div className="w-[40%] flex flex-col justify-center items-center p-2 border-r border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Turno
                      </span>
                      <span className="text-5xl font-black text-slate-800 tracking-tighter whitespace-nowrap">
                        {turno.codigo}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="w-[60%] flex flex-col justify-center items-center p-2 bg-yellow-50/30">
                      <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider mb-1">
                        Servicio
                      </p>
                      <div className="text-center leading-none w-full px-2">
                        <span className="block text-2xl font-bold text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
                          {turno.tipo_servicio
                            ? turno.tipo_servicio.nombre
                            : "General"}
                        </span>
                        <span className="text-xs font-medium text-slate-400 block mt-2 whitespace-nowrap">
                          En cola...
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </PantallaLayout>
  );
}
