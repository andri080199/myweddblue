"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import SidebarButton from '@/components/ui/SiderbarButton';

interface SidebarProps {
  onSelect: (selection: "attendance" | "guestbook" | "invitation" | "edit-content") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const params = useParams();
  const clientSlug = params?.clientSlug as string;
  const [activeMenu, setActiveMenu] = useState<"attendance" | "guestbook" | "invitation" | "edit-content">("attendance");

  const handleSelect = (menu: "attendance" | "guestbook" | "invitation" | "edit-content") => {
    setActiveMenu(menu);
    onSelect(menu);
  };

  const handlePreviewUndangan = () => {
    const previewUrl = `/undangan/${clientSlug}/preview-undangan`;
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4 hidden lg:block overflow-auto custom-scrollbar">
      <h2 className="text-xl font-semibold mb-6">Reservasi</h2>

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

      {/* Tombol Edit Undangan */}
      <SidebarButton
        label="Edit Undangan"
        isActive={activeMenu === "edit-content"}
        onClick={() => handleSelect("edit-content")}
      />

      {/* Divider */}
      <hr className="border-gray-600 my-4" />

      {/* Tombol Preview Undangan */}
      <button
        onClick={handlePreviewUndangan}
        className="w-full text-left py-3 px-4 mb-2 rounded-md transition-all bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Preview Undangan
      </button>
    </div>
  );
};

export default Sidebar;
