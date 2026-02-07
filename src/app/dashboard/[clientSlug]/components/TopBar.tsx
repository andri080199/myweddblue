"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";

interface TopbarProps {
  onSelect: (selection: "attendance" | "guestbook" | "invitation" | "edit-content") => void;
}

const Topbar: React.FC<TopbarProps> = ({ onSelect }) => {
  const params = useParams();
  const clientSlug = params?.clientSlug as string;
  const [activeMenu, setActiveMenu] = useState<"attendance" | "guestbook" | "invitation" | "edit-content">("attendance");
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (menu: "attendance" | "guestbook" | "invitation" | "edit-content") => {
    setActiveMenu(menu);
    onSelect(menu);
    setMenuOpen(false);
  };

  const handlePreviewUndangan = () => {
    const previewUrl = `/undangan/${clientSlug}/preview-undangan`;
    window.open(previewUrl, '_blank');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="lg:hidden bg-gray-800 text-white p-4 top-0 left-0 right-0 z-50 flex items-center justify-between fixed">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      
      <div className="flex items-center gap-3">
        {/* Tombol Preview */}
        <button
          onClick={handlePreviewUndangan}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center gap-1 transition-colors duration-200"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview
        </button>

      <div className="relative" ref={dropdownRef}>
        <button
          className="bg-darkprimary px-3 py-2 rounded-md border-2 border-primarylight text-sm focus:outline-none flex items-center gap-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {activeMenu === "attendance"
            ? "Reservasi"
            : activeMenu === "guestbook"
            ? "Ucapan Doa"
            : activeMenu === "invitation"
            ? "Invitation"
            : "Edit Undangan"}

          {/* SVG Icon with Rotation */}
          <svg
            className={`w-4 h-4 transform transition-transform duration-300 ${
              menuOpen ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`absolute right-0 mt-2 w-40 bg-primarylight text-gray-900 rounded-md shadow-lg z-50 transform transition-all duration-500 origin-top ${
            menuOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          }`}
        >
          <button
            className="block w-full text-left px-4 py-2 text-gray-900 font-medium hover:bg-darkprimary hover:text-white hover:rounded-t-md"
            onClick={() => handleSelect("attendance")}
          >
            Reservasi
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-gray-900 font-medium hover:bg-darkprimary hover:text-white"
            onClick={() => handleSelect("guestbook")}
          >
            Ucapan Doa
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-gray-900 font-medium hover:bg-darkprimary hover:text-white"
            onClick={() => handleSelect("invitation")}
          >
            Invitation
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-gray-900 font-medium hover:bg-darkprimary hover:text-white hover:rounded-b-md"
            onClick={() => handleSelect("edit-content")}
          >
            Edit Undangan
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Topbar;
