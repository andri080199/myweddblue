import Link from 'next/link';

const OpenGoogleMapsButton: React.FC = () => {
  // Gantilah dengan alamat yang ingin dicari di Google Maps
  const address = "RT.5/RW.13, Pulo Gebang, Kec. Cakung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13950";
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;

  return (
    <div className="">
      <Link
        href={mapsUrl}
        target="_blank" // Membuka link di tab baru
        className="px-4 py-2 bg-primary text-gold font-bold hover:scale-110 hover:bg-primarylight rounded-lg shadow-md shadow-darkprimary transition-all"
      >
        Google Maps Lokasi
      </Link>
    </div>
  );
};

export default OpenGoogleMapsButton;
