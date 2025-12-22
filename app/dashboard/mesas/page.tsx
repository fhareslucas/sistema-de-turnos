"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchMesas } from "@/lib/redux/slices/mesasSlice";
import MesaCard from "@/components/MesaCard";
import EditMesaModal from "@/components/EditMesaModal";
import AddMesaModal from "@/components/AddMesaModal";
import DeleteMesaModal from "@/components/DeleteMesaModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Mesa } from "@/types";

export default function MesasPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { mesas, loading } = useSelector((state: RootState) => state.mesas);
  const [editingMesa, setEditingMesa] = useState<Mesa | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deletingMesa, setDeletingMesa] = useState<Mesa | null>(null);

  useEffect(() => {
    dispatch(fetchMesas({ activo: true }));
  }, [dispatch]);

  const activeMesas = mesas.filter((m) => m.activo !== false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#aec235]">
            Gestión de Mesas
          </h2>
          <p className="text-muted-foreground">
            Visualiza el estado de todas las mesas
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Agregar Mesa
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeMesas.map((mesa) => (
            <MesaCard
              key={mesa.id}
              mesa={mesa}
              onEdit={(mesa) => setEditingMesa(mesa)}
              onDelete={(mesa) => setDeletingMesa(mesa)}
            />
          ))}
          {activeMesas.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No hay mesas configuradas
            </div>
          )}
        </div>
      )}

      {editingMesa && (
        <EditMesaModal
          open={!!editingMesa}
          onOpenChange={(open) => !open && setEditingMesa(null)}
          mesa={editingMesa}
        />
      )}

      <AddMesaModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

      {deletingMesa && (
        <DeleteMesaModal
          open={!!deletingMesa}
          onOpenChange={(open) => !open && setDeletingMesa(null)}
          mesa={deletingMesa}
        />
      )}
    </div>
  );
}
