'use client';
// src/app/dashboard/page.tsx
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Dashboard from "../../components/Dashboard";
import Guestbook from "../../components/Guestbook";

const DashboardPage = () => {
  const [selected, setSelected] = useState<"attendance" | "guestbook" | "invitation">("attendance");
  
  const handleSelect = (selection: "attendance" | "guestbook" | "invitation") => {
    setSelected(selection);
  };

  return (
    <div className="flex h-screen">
      <Sidebar onSelect={handleSelect} />
      <div className="flex-1 p-6">
        {selected === "attendance" && (
          <>
            <Dashboard />
          </>
        )}
        {selected === "guestbook" && <Guestbook />}
      </div>
    </div>
  );
};

export default DashboardPage;
