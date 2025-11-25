'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchEstadisticas, fetchTurnos } from '@/lib/redux/slices/turnosSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle, Users } from 'lucide-react';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { estadisticas, turnos, loading } = useSelector((state: RootState) => state.turnos);

  useEffect(() => {
    dispatch(fetchEstadisticas());
    dispatch(fetchTurnos({ estado: 'en_espera' }));
  }, [dispatch]);

  const stats = [
    {
      title: 'En Espera',
      value: estadisticas?.hoy.en_espera || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'En Atención',
      value: estadisticas?.hoy.en_atencion || 0,
      icon: AlertCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completados',
      value: estadisticas?.hoy.completados || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Hoy',
      value: estadisticas?.hoy.total || 0,
      icon: Users,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ];

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

      <Card>
        <CardHeader>
          <CardTitle>Turnos en Espera</CardTitle>
          <CardDescription>
            {turnos.filter(t => t.estado === 'en_espera').length} turnos esperando atención
          </CardDescription>
        </CardHeader>
        <CardContent>
          {turnos.filter(t => t.estado === 'en_espera').length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay turnos en espera
            </div>
          ) : (
            <div className="space-y-2">
              {turnos
                .filter(t => t.estado === 'en_espera')
                .slice(0, 5)
                .map((turno) => (
                  <div
                    key={turno.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: turno.tipo_servicio?.color }}
                      >
                        {turno.tipo_servicio?.codigo}
                      </div>
                      <div>
                        <p className="font-semibold">{turno.codigo}</p>
                        <p className="text-sm text-muted-foreground">
                          {turno.tipo_servicio?.nombre}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(turno.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}