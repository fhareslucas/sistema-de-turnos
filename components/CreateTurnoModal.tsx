"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  createTurno,
  llamarTurno,
  fetchTurnos,
} from "@/lib/redux/slices/turnosSlice";
import { fetchServicios } from "@/lib/redux/slices/serviciosSlice";
import { fetchMesas } from "@/lib/redux/slices/mesasSlice";
import {
  createTurnoSchema,
  CreateTurnoFormData,
} from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CreateTurnoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateTurnoModal({
  open,
  onOpenChange,
}: CreateTurnoModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { servicios } = useSelector((state: RootState) => state.servicios);
  const { mesas } = useSelector((state: RootState) => state.mesas);
  const [selectedMesaId, setSelectedMesaId] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateTurnoFormData>({
    resolver: zodResolver(createTurnoSchema),
    defaultValues: {
      prioridad: false,
    },
  });

  const prioridad = watch("prioridad");

  useEffect(() => {
    if (open) {
      dispatch(fetchServicios());
      dispatch(fetchMesas({ activo: true }));
    }
  }, [open, dispatch]);

  const onSubmit = async (data: CreateTurnoFormData) => {
    try {
      const resultAction = await dispatch(
        createTurno({
          ...data,
          prioridad: data.prioridad ? 1 : 0,
        })
      );

      if (createTurno.fulfilled.match(resultAction)) {
        const newTurno = resultAction.payload;

        if (
          selectedMesaId &&
          availableMesas.some((m) => m.id === selectedMesaId)
        ) {
          await dispatch(
            llamarTurno({
              id: newTurno.id,
              data: { mesa_id: selectedMesaId },
            })
          );
        }

        dispatch(fetchTurnos());
        onOpenChange(false);
        reset();
        setSelectedMesaId("");
      }
    } catch (error) {
      console.error("Error creating turno:", error);
    }
  };

  const availableMesas = mesas.filter(
    (m) => m.activo && m.estado === "disponible"
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-primary text-xl font-bold">
            Crear Nuevo Turno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo_servicio_id">Tipo de Servicio *</Label>
              <select
                id="tipo_servicio_id"
                {...register("tipo_servicio_id")}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.tipo_servicio_id
                    ? "border-destructive"
                    : "border-input"
                }`}
              >
                <option value="">Seleccione un servicio</option>
                {servicios
                  .filter((s) => s.activo)
                  .map((servicio) => (
                    <option key={servicio.id} value={servicio.id}>
                      {servicio.nombre} ({servicio.codigo})
                    </option>
                  ))}
              </select>
              {errors.tipo_servicio_id && (
                <p className="text-sm text-destructive">
                  {errors.tipo_servicio_id.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mesa_id">Asignar Mesa (Opcional)</Label>
              {availableMesas.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-2">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">
                      Todas las mesas están ocupadas.
                    </span>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1 ml-6">
                    El turno entrará automáticamente en cola de espera.
                  </p>
                </div>
              )}
              <select
                id="mesa_id"
                value={selectedMesaId}
                onChange={(e) => setSelectedMesaId(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={availableMesas.length === 0}
              >
                <option value="">
                  {availableMesas.length === 0
                    ? "No hay mesas disponibles"
                    : "En espera (Sin mesa)"}
                </option>
                {availableMesas.map((mesa) => (
                  <option key={mesa.id} value={mesa.id}>
                    {mesa.nombre} (Mesa {mesa.numero})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre_cliente">
                Nombre del Cliente (Opcional)
              </Label>
              <Input
                id="nombre_cliente"
                {...register("nombre_cliente")}
                placeholder="Nombre completo"
                className={errors.nombre_cliente ? "border-destructive" : ""}
              />
              {errors.nombre_cliente && (
                <p className="text-sm text-destructive">
                  {errors.nombre_cliente.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
              <textarea
                id="observaciones"
                {...register("observaciones")}
                className={`flex min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  errors.observaciones ? "border-destructive" : "border-input"
                }`}
                placeholder="Notas adicionales"
              />
              {errors.observaciones && (
                <p className="text-sm text-destructive">
                  {errors.observaciones.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="prioridad"
                checked={prioridad}
                onCheckedChange={(checked) =>
                  setValue("prioridad", checked === true)
                }
              />
              <Label
                htmlFor="prioridad"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Turno prioritario
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  reset();
                  setSelectedMesaId("");
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Creando..." : "Crear Turno"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
