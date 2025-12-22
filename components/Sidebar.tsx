"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Armchair,
  Menu,
  ChevronLeft,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isCollapsed,
  isActive,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group relative",
        isActive
          ? "bg-white/10 text-white shadow-sm"
          : "text-white/70 hover:bg-white/5 hover:text-white",
        isCollapsed ? "justify-center" : ""
      )}
      title={isCollapsed ? label : undefined}
    >
      {isActive && (
        <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#aec235] rounded-r-full" />
      )}
      <Icon
        className={cn("h-5 w-5 shrink-0", isActive ? "text-[#aec235]" : "")}
      />
      {!isCollapsed && (
        <span
          className={cn(
            "truncate font-medium text-sm",
            isActive ? "text-white" : ""
          )}
        >
          {label}
        </span>
      )}
    </Link>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: ClipboardList,
      label: "Turnos",
      href: "/dashboard/turnos",
    },
    {
      icon: Armchair,
      label: "Mesas",
      href: "/dashboard/mesas",
    },
    {
      icon: Monitor,
      label: "Pantalla Atención",
      href: "/dashboard/pantalla-atencion",
    },
  ];

  return (
    <aside
      className={cn(
        "bg-primary flex flex-col h-screen sticky top-0 transition-all duration-300 shadow-xl z-50",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-14 w-14 rounded flex items-center mt-2 justify-center shrink-0 bg-white">
              <Image
                src="/RS.png"
                alt="Sistema Turnos Logo"
                width={56}
                height={56}
                className="object-contain"
              />
            </div>
            <span className="font-bold text-[#aec235] truncate">
              Sistema Turnos
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn(
            "text-white hover:bg-white/10 h-8 w-8",
            isCollapsed ? "mx-auto" : ""
          )}
        >
          {isCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 py-6 px-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}
