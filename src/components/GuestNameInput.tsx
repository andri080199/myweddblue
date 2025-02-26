'use client';
import GuestForm from '@/app/dashboardclient/GuestForm';
import GuestList from '@/app/dashboardclient/GuestList';
import { useState, useEffect } from 'react';

interface Guest {
  id: string;
  name: string;
  url: string;
}


const GuestNameInput = () => {
  const [guests, setGuests] = useState<Guest[]>([]);

  const fetchGuestNames = async () => {
    try {
      const response = await fetch('/api/guestNames');
      const data = await response.json();
      if (Array.isArray(data)) {
        setGuests(data);
      }
    } catch (error) {
      console.error('Gagal mengambil data tamu:', error);
    }
  };

  useEffect(() => {
    fetchGuestNames();
  }, []);

  const addGuest = async (guestName: string) => {
    const response = await fetch('/api/guestNames', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestName }),
    });

    if (response.ok) {
      fetchGuestNames(); // Refresh daftar setelah menambah tamu
    } else {
      console.error('Gagal menambahkan tamu');
    }
  };

  const deleteGuest = async (guestId: string) => {
    try {
      const response = await fetch(`/api/guestNames?guestId=${guestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGuests((prevGuests) => prevGuests.filter((guest) => guest.id !== guestId));
      } else {
        console.error('Gagal menghapus tamu');
      }
    } catch (error) {
      console.error('Gagal menghapus tamu:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      
      <GuestForm onAddGuest={addGuest} />
      <GuestList guests={guests} onDelete={deleteGuest} />
    </div>
  );
};

export default GuestNameInput;
