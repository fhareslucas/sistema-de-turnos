"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchTurnos,
  createTurno,
  llamarTurno,
  completarTurno,
  cancelarTurno,
} from "@/lib/redux/slices/turnosSlice";
import { fetchServicios } from "@/lib/redux/slices/serviciosSlice";
import { fetchMesas } from "@/lib/redux/slices/mesasSlice";
import {
  createTurnoSchema,
  type CreateTurnoFormData,
} from "@/lib/validations/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Phone, CheckCircle, XCircle, User } from "lucide-react";
import { Turno } from "@/types";

export default function TurnosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { turnos, loading } = useSelector((state: RootState) => state.turnos);
  const { servicios } = useSelector((state: RootState) => state.servicios);
  const { mesas } = useSelector((state: RootState) => state.mesas);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showLlamarModal, setShowLlamarModal] = useState(false);
  const [selectedMesaId, setSelectedMesaId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTurnoFormData>({
    resolver: zodResolver(createTurnoSchema),
  });

  useEffect(() => {
    dispatch(fetchTurnos({}));
    dispatch(fetchServicios());
    dispatch(fetchMesas());
  }, [dispatch]);

  const onCreateTurno = async (data: CreateTurnoFormData) => {
    await dispatch(
      createTurno({
        ...data,
        prioridad: data.prioridad ?? false,
      })
    );
    setShowCreateModal(false);
    reset();
    dispatch(fetchTurnos({}));
  };

  const handleLlamarTurno = async () => {
    if (selectedTurno && selectedMesaId) {
      await dispatch(
        llamarTurno({ id: selectedTurno.id, data: { mesa_id: selectedMesaId } })
      );
      setShowLlamarModal(false);
      setSelectedTurno(null);
      setSelectedMesaId("");
      dispatch(fetchTurnos({}));
    }
  };

  const handleCompletarTurno = async (id: string) => {
    await dispatch(completarTurno({ id }));
    dispatch(fetchTurnos({}));
  };

  const handleCancelarTurno = async (id: string) => {
    await dispatch(cancelarTurno({ id }));
    dispatch(fetchTurnos({}));
  };

  const filteredTurnos = filtroEstado
    ? turnos.filter((t) => t.estado === filtroEstado)
    : turnos;

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      en_espera: { text: "En Espera", class: "bg-yellow-100 text-yellow-800" },
      en_atencion: { text: "En Atención", class: "bg-blue-100 text-blue-800" },
      completado: { text: "Completado", class: "bg-green-100 text-green-800" },
      cancelado: { text: "Cancelado", class: "bg-red-100 text-red-800" },
    };
    return badges[estado] || badges.en_espera;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Gestión de Turnos
          </h2>
          <p className="text-muted-foreground">
            Administra y controla todos los turnos
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuevo Turno
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Button
              variant={filtroEstado === "" ? "default" : "outline"}
              onClick={() => setFiltroEstado("")}
            >
              Todos
            </Button>
            <Button
              variant={filtroEstado === "en_espera" ? "default" : "outline"}
              onClick={() => setFiltroEstado("en_espera")}
            >
              En Espera
            </Button>
            <Button
              variant={filtroEstado === "en_atencion" ? "default" : "outline"}
              onClick={() => setFiltroEstado("en_atencion")}
            >
              En Atención
            </Button>
            <Button
              variant={filtroEstado === "completado" ? "default" : "outline"}
              onClick={() => setFiltroEstado("completado")}
            >
              Completados
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredTurnos.map((turno) => {
            const badge = getEstadoBadge(turno.estado);
            return (
              <Card
                key={turno.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-16 w-16 rounded-lg flex items-center justify-center font-bold text-white text-lg"
                        style={{ backgroundColor: turno.tipo_servicio?.color }}
                      >
                        {turno.codigo.split("-")[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{turno.codigo}</h3>
                        <p className="text-sm text-muted-foreground">
                          {turno.tipo_servicio?.nombre}
                        </p>
                        {turno.nombre_cliente && (
                          <p className="text-sm flex items-center gap-1 mt-1">
                            <User className="h-3 w-3" />
                            {turno.nombre_cliente}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.class}`}
                        >
                          {badge.text}
                        </span>
                        {turno.mesa && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {turno.mesa.nombre}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(turno.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {turno.estado === "en_espera" && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedTurno(turno);
                              setShowLlamarModal(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Phone className="h-4 w-4" />
                            Llamar
                          </Button>
                        )}
                        {turno.estado === "en_atencion" && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleCompletarTurno(turno.id)}
                            className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Completar
                          </Button>
                        )}
                        {(turno.estado === "en_espera" ||
                          turno.estado === "en_atencion") && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelarTurno(turno.id)}
                            className="flex items-center gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {filteredTurnos.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No hay turnos para mostrar
            </div>
          )}
        </div>
      )}

      {/* Modal Crear Turno */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Crear Nuevo Turno</CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onCreateTurno)}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="tipo_servicio_id">Tipo de Servicio *</Label>
                  <select
                    id="tipo_servicio_id"
                    {...register("tipo_servicio_id")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
                  <Label htmlFor="nombre_cliente">
                    Nombre del Cliente (Opcional)
                  </Label>
                  <Input
                    id="nombre_cliente"
                    {...register("nombre_cliente")}
                    placeholder="Nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observaciones">
                    Observaciones (Opcional)
                  </Label>
                  <textarea
                    id="observaciones"
                    {...register("observaciones")}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Notas adicionales"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="prioridad"
                    {...register("prioridad")}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="prioridad">Turno prioritario</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Crear Turno
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateModal(false);
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

      {/* Modal Llamar Turno */}
      {showLlamarModal && selectedTurno && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Llamar Turno {selectedTurno.codigo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mesa_select">Seleccionar Mesa *</Label>
                <select
                  id="mesa_select"
                  value={selectedMesaId}
                  onChange={(e) => setSelectedMesaId(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Seleccione una mesa</option>
                  {mesas
                    .filter((m) => m.activo && m.estado === "disponible")
                    .map((mesa) => (
                      <option key={mesa.id} value={mesa.id}>
                        {mesa.nombre} (Mesa {mesa.numero})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleLlamarTurno}
                  className="flex-1"
                  disabled={!selectedMesaId}
                >
                  Llamar Turno
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLlamarModal(false);
                    setSelectedTurno(null);
                    setSelectedMesaId("");
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
