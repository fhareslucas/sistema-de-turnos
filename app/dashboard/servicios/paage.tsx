"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchServicios,
  createServicio,
  updateServicio,
  deleteServicio,
} from "@/lib/redux/slices/serviciosSlice";
import {
  createServicioSchema,
  type CreateServicioFormData,
} from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { TipoServicio } from "@/types";

export default function ServiciosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { servicios, loading } = useSelector(
    (state: RootState) => state.servicios
  );

  const [showModal, setShowModal] = useState(false);
  const [editingServicio, setEditingServicio] = useState<TipoServicio | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateServicioFormData>({
    resolver: zodResolver(createServicioSchema),
    defaultValues: {
      color: "#54243C",
      tiempo_estimado: 15,
      activo: true,
    },
  });

  useEffect(() => {
    dispatch(fetchServicios());
  }, [dispatch]);

  const onSubmit = async (data: CreateServicioFormData) => {
    if (editingServicio) {
      await dispatch(updateServicio({ id: editingServicio.id, data }));
    } else {
      await dispatch(createServicio(data));
    }
    setShowModal(false);
    setEditingServicio(null);
    reset();
    dispatch(fetchServicios());
  };

  const handleEdit = (servicio: TipoServicio) => {
    setEditingServicio(servicio);
    setValue("nombre", servicio.nombre);
    setValue("codigo", servicio.codigo);
    setValue("descripcion", servicio.descripcion || "");
    setValue("color", servicio.color);
    setValue("tiempo_estimado", servicio.tiempo_estimado);
    setValue("activo", servicio.activo);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar este servicio?")) {
      await dispatch(deleteServicio(id));
      dispatch(fetchServicios());
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Tipos de Servicio
          </h2>
          <p className="text-muted-foreground">
            Administra los tipos de servicio disponibles
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Servicio
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => (
            <Card
              key={servicio.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="h-10 w-10 rounded-lg text-white flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: servicio.color }}
                  >
                    {servicio.codigo}
                  </div>
                  <CardTitle className="text-lg">{servicio.nombre}</CardTitle>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(servicio)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(servicio.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">
                  {servicio.descripcion}
                </CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{servicio.tiempo_estimado} min</span>
                  <span className="ml-auto">
                    {servicio.activo ? "✅ Activo" : "❌ Inactivo"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          {servicios.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No hay servicios registrados
            </div>
          )}
        </div>
      )}

      {/* Modal Crear/Editar Servicio */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingServicio ? "Editar Servicio" : "Nuevo Servicio"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    {...register("nombre")}
                    placeholder="Inscripción"
                  />
                  {errors.nombre && (
                    <p className="text-sm text-destructive">
                      {errors.nombre.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="codigo">Código *</Label>
                  <Input
                    id="codigo"
                    {...register("codigo")}
                    placeholder="INS"
                    maxLength={10}
                  />
                  {errors.codigo && (
                    <p className="text-sm text-destructive">
                      {errors.codigo.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <textarea
                    id="descripcion"
                    {...register("descripcion")}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Descripción del servicio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    type="color"
                    {...register("color")}
                    defaultValue="#54243C"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempo_estimado">
                    Tiempo Estimado (minutos)
                  </Label>
                  <Input
                    id="tiempo_estimado"
                    type="number"
                    {...register("tiempo_estimado", { valueAsNumber: true })}
                    placeholder="15"
                    defaultValue={15}
                  />
                  {errors.tiempo_estimado && (
                    <p className="text-sm text-destructive">
                      {errors.tiempo_estimado.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="activo"
                    {...register("activo")}
                    className="h-4 w-4"
                    defaultChecked
                  />
                  <Label htmlFor="activo">Servicio activo</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingServicio ? "Actualizar" : "Crear"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false);
                      setEditingServicio(null);
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
