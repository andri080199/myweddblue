import { useState } from 'react';

const GuestForm = ({ onAddGuest }: { onAddGuest: (guestName: string) => void }) => {
  const [guestName, setGuestName] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim() === '') return;
    onAddGuest(guestName);
    setGuestName('');
  };

  return (
    <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Buat Undangan Digital</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          placeholder="Masukkan nama tamu..."
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-md">
          Buat Undangan
        </button>
      </form>
      <div className="mt-4">
        <label htmlFor="whatsAppNumber" className="block font-semibold">
          Nomor WhatsApp
        </label>
        <input
          type="text"
          id="whatsAppNumber"
          value={whatsAppNumber}
          onChange={(e) => setWhatsAppNumber(e.target.value)}
          placeholder="Masukkan nomor WhatsApp"
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default GuestForm;
