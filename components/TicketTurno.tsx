import React from "react";
import { Turno } from "@/types";
import { User, Calendar, Clock } from "lucide-react";

interface TicketTurnoProps {
  turno: Turno;
}

export const TicketTurno = React.forwardRef<HTMLDivElement, TicketTurnoProps>(
  ({ turno }, ref) => {
    return (
      <>
        <style type="text/css" media="print">
          {`
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          `}
        </style>
        <div
          ref={ref}
          className="flex flex-col items-center justify-start mt-2 p-4 bg-white border-gray-400 border-2 border-dashed text-black w-[80mm] min-h-[100px] mx-auto"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider">
              Su Turno
            </h2>
            <p className="text-sm text-gray-500 mt-1">Sistema de Gestión</p>
          </div>

          <div className="text-center mb-8 border-y-2 border-black py-6 w-full">
            <h1 className="text-6xl font-black tracking-tighter">
              {turno.codigo}
            </h1>
            <p className="text-xl font-medium mt-2 uppercase tracking-wide">
              {turno.tipo_servicio?.nombre}
            </p>
          </div>

          <div className="w-full space-y-3 mb-6">
            {turno.nombre_cliente && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="font-semibold">Cliente:</span>
                </div>
                <span className="font-medium">{turno.nombre_cliente}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-semibold">Fecha:</span>
              </div>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Hora:</span>
              </div>
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="text-center w-full border-t border-gray-300 pt-4 mt-auto">
            <p className="text-xs text-gray-400">
              ¡Gracias por esperar!
              <br />
              Por favor, esté atento a la pantalla.
            </p>
          </div>
        </div>
      </>
    );
  }
);

TicketTurno.displayName = "TicketTurno";

export default TicketTurno;
