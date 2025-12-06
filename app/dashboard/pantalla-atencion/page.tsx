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

  return (
    <PantallaLayout title="Pantalla de Atención">
      <div className="h-full w-full p-8 bg-slate-100 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 content-start">
          {turnosEnAtencion.length === 0 ? (
            <div className="col-span-full flex items-center justify-center h-[80vh]">
              <p className="text-4xl text-muted-foreground font-light">
                No hay turnos en atención
              </p>
            </div>
          ) : (
            turnosEnAtencion.map((turno) => (
              <Card
                key={turno.id}
                className="overflow-hidden border-l-8 border-l-blue-500 shadow-lg h-64 flex flex-col transform transition-all hover:scale-[1.02]"
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

                  <div className="bg-blue-50 -mx-6 -mb-6 p-4 text-center border-t border-blue-100">
                    <p className="text-blue-900 text-xl font-bold truncate">
                      {turno.mesa ? turno.mesa.nombre : "Mesa --"}
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
