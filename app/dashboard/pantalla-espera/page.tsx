"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchTurnos } from "@/lib/redux/slices/turnosSlice";
import PantallaLayout from "@/components/PantallaLayout";
import { Card, CardContent } from "@/components/ui/card";

export default function PantallaEsperaPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { turnos } = useSelector((state: RootState) => state.turnos);

  useEffect(() => {
    dispatch(fetchTurnos());
    const interval = setInterval(() => {
      dispatch(fetchTurnos());
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Filtrar y ordenar turnos en espera
  const turnosEnEspera = turnos
    .filter((t) => t.estado === "en_espera")
    .sort((a, b) => {
      // Prioritarios primero
      const prioA = a.prioridad === true || a.prioridad === 1;
      const prioB = b.prioridad === true || b.prioridad === 1;

      if (prioA && !prioB) return -1;
      if (!prioA && prioB) return 1;

      // Luego por fecha (más antiguos primero en espera, FIFO)
      const fechaA = a.createdAt || a.created_at || "";
      const fechaB = b.createdAt || b.created_at || "";
      return new Date(fechaA).getTime() - new Date(fechaB).getTime();
    });

  // Mostrar un número razonable de turnos
  const displayTurnos = turnosEnEspera.slice(0, 12);

  return (
    <PantallaLayout title="Pantalla de Espera">
      <div className="h-full w-full p-8 bg-slate-100 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
          {displayTurnos.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-[80vh]">
              <p className="text-4xl text-muted-foreground font-light">
                No hay turnos en espera
              </p>
            </div>
          ) : (
            displayTurnos.map((turno) => (
              <Card
                key={turno.id}
                className="overflow-hidden border-l-8 border-l-yellow-500 shadow-lg h-64 flex flex-col transform transition-all hover:scale-[1.02]"
              >
                <CardContent className="p-6 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <span className="text-xl font-medium text-muted-foreground uppercase tracking-wide">
                      Turno
                    </span>
                    {(turno.prioridad === true || turno.prioridad === 1) && (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                        Prioritario
                      </span>
                    )}
                  </div>

                  <div className="text-center flex-1 flex items-center justify-center">
                    <span className="text-7xl font-black text-slate-900 tracking-tighter whitespace-nowrap">
                      {turno.codigo}
                    </span>
                  </div>

                  <div className="bg-yellow-50 -mx-6 -mb-6 p-4 text-center border-t border-yellow-100">
                    <p className="text-yellow-900 text-xl font-bold truncate">
                      {turno.tipo_servicio
                        ? turno.tipo_servicio.nombre
                        : "General"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </PantallaLayout>
  );
}
