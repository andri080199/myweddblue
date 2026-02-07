'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Dashboard from "./components/Dashboard";
import Guestbook from "./components/Guestbook";
import AddGuestForm from "./components/AddGuestForm";
import GuestList from "./components/GuestList";
import EditableInvitation from "./components/EditableInvitation";
import WhatsAppMessageEditor from "./components/WhatsAppMessageEditor";

const DashboardPage = () => {
  const params = useParams();
  const clientSlug = params?.clientSlug as string;
  const [selected, setSelected] = useState<"attendance" | "guestbook" | "invitation" | "edit-content" | "whatsapp-template">("attendance");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleGuestAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Listen to route changes via custom events or URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (['attendance', 'guestbook', 'invitation', 'edit-content', 'whatsapp-template'].includes(hash)) {
        setSelected(hash as any);
      }
    };

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check initial hash

    // Listen for custom events from layout
    const handleSectionChange = (event: CustomEvent) => {
      setSelected(event.detail);
    };

    window.addEventListener('sectionChange', handleSectionChange as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('sectionChange', handleSectionChange as EventListener);
    };
  }, []);

  // Update layout's active section
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('updateActiveSection', { detail: selected }));
  }, [selected]);

  const renderContent = () => {
    switch (selected) {
      case "attendance":
        return <Dashboard clientSlug={clientSlug} />;
      
      case "guestbook":
        return <Guestbook clientSlug={clientSlug} />;
      
      case "invitation":
        return (
          <div className="max-w-6xl mx-auto mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Add Guest Form */}
              <div className="">
                <AddGuestForm onGuestAdded={handleGuestAdded} clientSlug={clientSlug} />
              </div>

              {/* Guest List */}
              <div className="">
                <GuestList key={refreshKey} clientSlug={clientSlug} />
              </div>
            </div>
          </div>
        );
      
      case "edit-content":
        return <EditableInvitation clientSlug={clientSlug} />;
      
      case "whatsapp-template":
        return <WhatsAppMessageEditor clientSlug={clientSlug} />;
      
      default:
        return <Dashboard clientSlug={clientSlug} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderContent()}
    </div>
  );
};

export default DashboardPage;
