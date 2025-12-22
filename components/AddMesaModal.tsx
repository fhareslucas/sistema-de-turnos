"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { createMesa, fetchMesas } from "@/lib/redux/slices/mesasSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { z } from "zod";

const addMesaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  numero: z.number().min(1, "El número debe ser mayor a 0"),
});

type AddMesaFormData = z.infer<typeof addMesaSchema>;

interface AddMesaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddMesaModal({
  open,
  onOpenChange,
}: AddMesaModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [backendError, setBackendError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddMesaFormData>({
    resolver: zodResolver(addMesaSchema),
    defaultValues: {
      nombre: "",
      numero: undefined,
    },
  });

  const handleClose = () => {
    onOpenChange(false);
    reset();
    setBackendError(null);
    setSuccessMessage(null);
  };

  const onSubmit = async (data: AddMesaFormData) => {
    setBackendError(null);
    setSuccessMessage(null);

    try {
      const resultAction = await dispatch(createMesa(data));

      if (createMesa.fulfilled.match(resultAction)) {
        await dispatch(fetchMesas({ activo: true }));

        setSuccessMessage("Mesa creada exitosamente");

        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        const errorMessage = resultAction.payload as string;
        setBackendError(errorMessage || "Error al crear la mesa");
      }
    } catch (error) {
      console.error("Error creating mesa:", error);
      setBackendError("Error inesperado al crear la mesa");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-primary text-xl font-bold">
            Agregar Nueva Mesa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {backendError && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {backendError}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="numero">Número de Mesa *</Label>
              <Input
                id="numero"
                type="number"
                {...register("numero", { valueAsNumber: true })}
                className={errors.numero ? "border-destructive" : ""}
                placeholder="Ej. 1"
              />
              {errors.numero && (
                <p className="text-sm text-destructive">
                  {errors.numero.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Mesa *</Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej. Mesa Principal"
                className={errors.nombre ? "border-destructive" : ""}
              />
              {errors.nombre && (
                <p className="text-sm text-destructive">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? "Creando..." : "Crear Mesa"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
