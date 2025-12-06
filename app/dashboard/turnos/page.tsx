"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  fetchTurnos,
  llamarTurno,
  completarTurno,
  cancelarTurno,
} from "@/lib/redux/slices/turnosSlice";

import { fetchMesas } from "@/lib/redux/slices/mesasSlice";
import CreateTurnoModal from "@/components/CreateTurnoModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Phone,
  CheckCircle,
  XCircle,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Turno } from "@/types";
import { fetchServicios } from "@/lib/redux/slices/serviciosSlice";

const ITEMS_PER_PAGE = 10;

export default function TurnosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { turnos } = useSelector((state: RootState) => state.turnos);
  const { mesas } = useSelector((state: RootState) => state.mesas);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showLlamarModal, setShowLlamarModal] = useState(false);
  const [selectedMesaId, setSelectedMesaId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTurnos());
    dispatch(fetchServicios());
    dispatch(fetchMesas());
  }, [dispatch]);

  const handleLlamarTurno = async () => {
    if (selectedTurno && selectedMesaId) {
      await dispatch(
        llamarTurno({ id: selectedTurno.id, data: { mesa_id: selectedMesaId } })
      );
      setShowLlamarModal(false);
      setSelectedTurno(null);
      setSelectedMesaId("");
      // El turno ya se actualiza en el slice, no necesitas fetchTurnos
      await dispatch(fetchMesas()); // Solo actualizamos mesas
    }
  };

  const handleCompletarTurno = async (id: string) => {
    await dispatch(completarTurno({ id }));
    // El turno ya se actualiza en el slice, no necesitas fetchTurnos
    await dispatch(fetchMesas()); // Solo actualizamos mesas
  };

  const handleCancelarTurno = async (id: string) => {
    await dispatch(cancelarTurno({ id }));
    // El turno ya se actualiza en el slice, no necesitas fetchTurnos
    await dispatch(fetchMesas()); // Solo actualizamos mesas
  };

  const sortedTurnos = useMemo(() => {
    const turnosCopy = [...turnos];

    return turnosCopy.sort((a, b) => {
      const esActivoA = a.estado === "en_espera" || a.estado === "en_atencion";
      const esActivoB = b.estado === "en_espera" || b.estado === "en_atencion";

      // Activos primero
      if (esActivoA && !esActivoB) return -1;
      if (!esActivoA && esActivoB) return 1;

      // Entre activos: prioritarios primero
      if (esActivoA && esActivoB) {
        const prioA = a.prioridad === true || a.prioridad === 1;
        const prioB = b.prioridad === true || b.prioridad === 1;

        if (prioA && !prioB) return -1;
        if (!prioA && prioB) return 1;

        // Si AMBOS son prioritarios, poner En Atención antes que En Espera
        if (prioA && prioB) {
          if (a.estado === "en_atencion" && b.estado === "en_espera") return -1;
          if (a.estado === "en_espera" && b.estado === "en_atencion") return 1;
        }
      }

      // Más reciente primero
      const fechaA = a.createdAt || a.created_at || "";
      const fechaB = b.createdAt || b.created_at || "";
      return new Date(fechaB).getTime() - new Date(fechaA).getTime();
    });
  }, [turnos]);

  const filteredTurnos = filtroEstado
    ? sortedTurnos.filter((t) => t.estado === filtroEstado)
    : sortedTurnos;

  const totalPages = Math.ceil(filteredTurnos.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTurnos = filteredTurnos.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleFiltroChange = (estado: string) => {
    setFiltroEstado(estado);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const getEstadoBadge = (estado: string) => {
    const badges: Record<string, { text: string; class: string }> = {
      en_espera: { text: "En Espera", class: "bg-yellow-100 text-yellow-800" },
      en_atencion: { text: "En Atención", class: "bg-blue-100 text-blue-800" },
      completado: { text: "Completado", class: "bg-green-100 text-green-800" },
      cancelado: { text: "Cancelado", class: "bg-red-100 text-red-800" },
    };
    return badges[estado] || badges.en_espera;
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "--";
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--";
    }
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
              onClick={() => handleFiltroChange("")}
            >
              Todos
            </Button>
            <Button
              variant={filtroEstado === "en_espera" ? "default" : "outline"}
              onClick={() => handleFiltroChange("en_espera")}
            >
              En Espera
            </Button>
            <Button
              variant={filtroEstado === "en_atencion" ? "default" : "outline"}
              onClick={() => handleFiltroChange("en_atencion")}
            >
              En Atención
            </Button>
            <Button
              variant={filtroEstado === "completado" ? "default" : "outline"}
              onClick={() => handleFiltroChange("completado")}
            >
              Completados
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {currentTurnos.map((turno) => {
          const badge = getEstadoBadge(turno.estado);
          return (
            <Card key={turno.id} className="hover:shadow-md transition-shadow">
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
                        {formatDate(
                          turno.createdAt ||
                            turno.created_at ||
                            turno.hora_llamado ||
                            turno.updated_at
                        )}
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
        {currentTurnos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No hay turnos para mostrar
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1}-
                {Math.min(endIndex, filteredTurnos.length)} de{" "}
                {filteredTurnos.length} turnos
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-1 text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }

                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageClick(page as number)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateTurnoModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />

      {showLlamarModal && selectedTurno && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl border-2 bg-background">
            <CardHeader>
              <CardTitle>Llamar Turno {selectedTurno.codigo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mesas.filter((m) => m.activo && m.estado === "disponible")
                .length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-center">
                  <p className="text-yellow-800 font-medium">
                    ⚠️ No hay mesas disponibles
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    Todas las mesas están ocupadas en este momento
                  </p>
                </div>
              ) : (
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
              )}

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