import { Mesa } from "@/types";
import { cn } from "@/lib/utils";
import { Users, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MesaCardProps {
  mesa: Mesa;
  onSelect?: (mesa: Mesa) => void;
  isSelected?: boolean;
  onEdit?: (mesa: Mesa) => void;
  onDelete?: (mesa: Mesa) => void;
}

export default function MesaCard({
  mesa,
  onSelect,
  isSelected,
  onEdit,
  onDelete,
}: MesaCardProps) {
  const isAvailable = mesa.estado === "disponible";
  const isOccupied = mesa.estado === "ocupada";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all duration-200",
        isAvailable
          ? "bg-customGreen/10 border-customGreen/30 hover:shadow-md hover:border-customGreen/50"
          : "bg-yellow-50 border-yellow-200 opacity-90",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <div className="absolute top-2 right-2 flex gap-1">
        {onEdit && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-white/50"
            onClick={() => onEdit(mesa)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-red-100 text-destructive hover:text-destructive"
            onClick={() => onDelete(mesa)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div
          className={cn(
            "h-16 w-16 rounded-full flex items-center justify-center",
            isAvailable
              ? "bg-customGreen/20 text-customGreen-900"
              : "bg-yellow-100 text-yellow-700"
          )}
        >
          {isOccupied ? (
            <Users className="h-8 w-8" />
          ) : (
            <span className="text-2xl font-bold">{mesa.numero}</span>
          )}
        </div>

        <div>
          <h3 className="font-bold text-lg text-foreground">{mesa.nombre}</h3>
          <p
            className={cn(
              "text-sm font-medium",
              isAvailable ? "text-customGreen-600 font-bold" : "text-yellow-600"
            )}
          >
            {isAvailable ? "Disponible" : "Ocupada"}
          </p>
        </div>

        {isAvailable && onSelect && (
          <Button
            onClick={() => onSelect(mesa)}
            variant={isSelected ? "default" : "outline"}
            className={cn(
              "w-full",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "border-primary/20 text-primary hover:bg-primary/5"
            )}
          >
            {isSelected ? "Seleccionada" : "Seleccionar"}
          </Button>
        )}

        {isOccupied && (
          <div className="absolute inset-0 bg-white/10 cursor-not-allowed" />
        )}
      </div>
    </div>
  );
}
