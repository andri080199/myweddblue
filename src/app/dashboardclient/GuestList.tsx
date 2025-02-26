import GuestActions from './GuestActions';

const GuestList = ({ guests, onDelete }: { guests: any[]; onDelete: (guestId: string) => void }) => {
  return (
    <div className="mt-8 w-full md:w-1/2 text-textprimary font-mono">
      <h2 className="text-xl font-semibold mb-4">Daftar Undangan</h2>
      <table className="min-w-full bg-white border border-gray-300 shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Nama Tamu</th>
            <th className="px-4 py-2 border-b">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest, index) => (
            <tr key={index}>
              <td className="px-4 py-2 border-b">{guest.name}</td>
              <td className="px-4 py-2 border-b">
                <GuestActions guest={guest} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GuestList;
