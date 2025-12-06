"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchEstadisticas, fetchTurnos } from "@/lib/redux/slices/turnosSlice";
import { Turno } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle, Users, User } from "lucide-react";

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { estadisticas, turnos } = useSelector(
    (state: RootState) => state.turnos
  );

  useEffect(() => {
    dispatch(fetchEstadisticas());
    dispatch(fetchTurnos());
  }, [dispatch]);

  const stats = [
    {
      title: "En Espera",
      value: estadisticas?.hoy.en_espera || 0,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "En Atención",
      value: estadisticas?.hoy.en_atencion || 0,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completados",
      value: estadisticas?.hoy.completados || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Hoy",
      value: estadisticas?.hoy.total || 0,
      icon: Users,
      color: "text-primary-600",
      bgColor: "bg-primary-50",
    },
  ];

  const turnosEnAtencion = turnos.filter((t) => t.estado === "en_atencion");
  const turnosEnEspera = turnos.filter((t) => t.estado === "en_espera");

  const formatTime = (dateString: string | null | undefined) => {
    if (!dateString) return "--";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "--";
      return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "--";
    }
  };

  const getTurnoDate = (turno: Turno) => {
    return turno.createdAt || turno.created_at || turno.hora_llamado || "";
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Vista general del sistema de turnos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Turnos Actuales
            </CardTitle>
            <CardDescription>
              {turnosEnAtencion.length}{" "}
              {turnosEnAtencion.length === 1 ? "turno" : "turnos"} siendo
              atendido{turnosEnAtencion.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {turnosEnAtencion.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[200px] text-center py-8 text-muted-foreground">
                <div>
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No hay turnos en atención</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {turnosEnAtencion.map((turno) => (
                  <div
                    key={turno.id}
                    className="flex items-center justify-between p-2.5 rounded-md border bg-blue-50/50 border-blue-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-md flex items-center justify-center font-bold text-white text-xs shadow-sm"
                        style={{ backgroundColor: turno.tipo_servicio?.color }}
                      >
                        {turno.tipo_servicio?.codigo}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{turno.codigo}</p>
                        <p className="text-xs text-muted-foreground">
                          {turno.tipo_servicio?.nombre}
                        </p>
                        {turno.nombre_cliente && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <User className="h-2.5 w-2.5" />
                            {turno.nombre_cliente}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {turno.mesa && (
                        <p className="text-xs font-semibold text-blue-700">
                          {turno.mesa.nombre}
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {formatTime(turno.hora_atencion || getTurnoDate(turno))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              Turnos en Espera
            </CardTitle>
            <CardDescription>
              {turnosEnEspera.length}{" "}
              {turnosEnEspera.length === 1 ? "turno" : "turnos"} esperando
              atención
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {turnosEnEspera.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[200px] text-center py-8 text-muted-foreground">
                <div>
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p>No hay turnos en espera</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {turnosEnEspera.slice(0, 10).map((turno) => (
                  <div
                    key={turno.id}
                    className="flex items-center justify-between p-2.5 rounded-md border bg-yellow-50/50 border-yellow-200 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-md flex items-center justify-center font-bold text-white text-xs shadow-sm"
                        style={{ backgroundColor: turno.tipo_servicio?.color }}
                      >
                        {turno.tipo_servicio?.codigo}
                      </div>
                      <div>
                        <p className="font-bold text-sm">{turno.codigo}</p>
                        <p className="text-xs text-muted-foreground">
                          {turno.tipo_servicio?.nombre}
                        </p>
                        {turno.nombre_cliente && (
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <User className="h-2.5 w-2.5" />
                            {turno.nombre_cliente}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {turno.prioridad && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800 mb-1">
                          Prioritario
                        </span>
                      )}
                      <p className="text-[10px] text-muted-foreground">
                        {formatTime(getTurnoDate(turno))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
