import React from "react";

interface SidebarButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`w-full text-left py-2 px-4 mb-2 rounded-md transition-all ${
        isActive
          ? "bg-textprimary text-white scale-105 shadow-sm shadow-primarylight"
          : "bg-primary text-textprimary hover:bg-darkprimary hover:text-white"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default SidebarButton;
