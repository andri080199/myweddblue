import { useState } from 'react';

type Guest = {
  id: string;
  url: string;
};

const GuestActions = ({ guest, onDelete }: { guest: Guest; onDelete: (guestId: string) => void }) => {
  const [showModal, setShowModal] = useState(false);

  const shareToWhatsApp = (url: string) => {
    const message = `Lihat undangan saya di: ${url}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const copyUrlToClipboard = (url: string) => {
    const fullUrl = `http://localhost:3000/${url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      alert('URL telah disalin ke clipboard!');
    });
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const confirmDelete = () => {
    onDelete(guest.id);
    setShowModal(false);
  };

  return (
    <div>
      <button
        onClick={() => shareToWhatsApp(guest.url)}
        className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
      >
        Bagikan ke WhatsApp
      </button>
      <button
        onClick={() => copyUrlToClipboard(guest.url)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
      >
        Salin URL
      </button>
      <button
        onClick={handleDeleteClick}
        className="bg-red-500 text-white px-4 py-2 rounded-md"
      >
        Hapus
      </button>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-bold mb-4">Konfirmasi Hapus</h2>
            <p>Apakah Anda yakin ingin menghapus undangan ini?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Yes
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestActions;
