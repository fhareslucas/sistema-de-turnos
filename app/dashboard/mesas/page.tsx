"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchMesas,
  createMesa,
  updateMesa,
  deleteMesa,
} from "@/lib/redux/slices/mesasSlice";
import {
  createMesaSchema,
  type CreateMesaFormData,
} from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Mesa } from "@/types";

export default function MesasPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { mesas, loading } = useSelector((state: RootState) => state.mesas);

  const [showModal, setShowModal] = useState(false);
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateMesaFormData>({
    resolver: zodResolver(createMesaSchema),
  });

  useEffect(() => {
    dispatch(fetchMesas());
  }, [dispatch]);

  const onSubmit = async (data: CreateMesaFormData) => {
    // Provide defaults for optional fields
    const mesaData = {
      ...data,
      estado: data.estado ?? ("disponible" as const),
      activo: data.activo ?? true,
    };

    if (editingMesa) {
      await dispatch(updateMesa({ id: editingMesa.id, data: mesaData }));
    } else {
      await dispatch(createMesa(mesaData));
    }
    setShowModal(false);
    setEditingMesa(null);
    reset();
    dispatch(fetchMesas());
  };

  const handleEdit = (mesa: Mesa) => {
    setEditingMesa(mesa);
    setValue("numero", mesa.numero);
    setValue("nombre", mesa.nombre);
    setValue("estado", mesa.estado);
    setValue("activo", mesa.activo);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta mesa?")) {
      await dispatch(deleteMesa(id));
      dispatch(fetchMesas());
    }
  };

  const getEstadoColor = (estado: string) => {
    const colors: Record<string, string> = {
      disponible: "bg-green-100 text-green-800",
      ocupada: "bg-blue-100 text-blue-800",
      inactiva: "bg-gray-100 text-gray-800",
    };
    return colors[estado] || colors.disponible;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Mesas
          </h2>
          <p className="text-muted-foreground">
            Administra las mesas/ventanillas de atención
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Mesa
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mesas.map((mesa) => (
            <Card key={mesa.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">
                    {mesa.numero}
                  </div>
                  <CardTitle className="text-lg">{mesa.nombre}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(mesa)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(mesa.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(
                      mesa.estado
                    )}`}
                  >
                    {mesa.estado.charAt(0).toUpperCase() + mesa.estado.slice(1)}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {mesa.activo ? "Activa" : "Inactiva"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {mesas.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No hay mesas registradas
            </div>
          )}
        </div>
      )}

      {/* Modal Crear/Editar Mesa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingMesa ? "Editar Mesa" : "Nueva Mesa"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    type="number"
                    {...register("numero", { valueAsNumber: true })}
                    placeholder="1"
                  />
                  {errors.numero && (
                    <p className="text-sm text-destructive">
                      {errors.numero.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...register("nombre")}
                    placeholder="Mesa 1 - Atención General"
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive">
                      {errors.nombre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <select
                    id="estado"
                    {...register("estado")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="inactiva">Inactiva</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="activo"
                    {...register("activo")}
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <Label htmlFor="activo">Mesa activa</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingMesa ? "Actualizar" : "Crear"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setEditingMesa(null);
                      reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
