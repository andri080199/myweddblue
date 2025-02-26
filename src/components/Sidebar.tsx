"use client";

import { useState } from "react";
import SidebarButton from './SiderbarButton'; // Import SidebarButton

interface SidebarProps {
  onSelect: (selection: "attendance" | "guestbook" | "invitation") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [activeMenu, setActiveMenu] = useState<"attendance" | "guestbook" | "invitation">("attendance");

  const handleSelect = (menu: "attendance" | "guestbook" | "invitation") => {
    setActiveMenu(menu);
    onSelect(menu);
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 hidden lg:block">
      <h2 className="text-xl font-semibold mb-6">Dashboard</h2>

      {/* Tombol Kehadiran */}
      <SidebarButton
        label="Kehadiran"
        isActive={activeMenu === "attendance"}
        onClick={() => handleSelect("attendance")}
      />

      {/* Tombol Ucapan Doa */}
      <SidebarButton
        label="Ucapan Doa"
        isActive={activeMenu === "guestbook"}
        onClick={() => handleSelect("guestbook")}
      />

      {/* Tombol Laporan */}
      <SidebarButton
        label="Invitation"
        isActive={activeMenu === "invitation"}
        onClick={() => handleSelect("invitation")}
      />
    </div>
  );
};

export default Sidebar;
