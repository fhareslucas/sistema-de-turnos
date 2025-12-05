"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { deleteMesa, fetchMesas } from "@/lib/redux/slices/mesasSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Mesa } from "@/types";

interface DeleteMesaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mesa: Mesa;
}

export default function DeleteMesaModal({
  open,
  onOpenChange,
  mesa,
}: DeleteMesaModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    setError(null);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const resultAction = await dispatch(deleteMesa(mesa.id));

      if (deleteMesa.fulfilled.match(resultAction)) {
        await dispatch(fetchMesas({ activo: true }));
        handleClose();
      } else {
        const errorMessage = resultAction.payload as string;
        setError(errorMessage || "Error al eliminar la mesa");
      }
    } catch (error) {
      console.error("Error deleting mesa:", error);
      setError("Error inesperado al eliminar la mesa");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive text-xl font-bold">
            Eliminar Mesa
          </CardTitle>
          <CardDescription>
            ¿Estás seguro que deseas eliminar esta mesa? Esta acción no se puede
            deshacer.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <p className="font-medium">Mesa #{mesa.numero}</p>
            <p className="text-sm text-muted-foreground">{mesa.nombre}</p>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar Mesa"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
