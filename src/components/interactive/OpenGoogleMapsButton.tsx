import Link from 'next/link';

interface OpenGoogleMapsButtonProps {
  mapsLink?: string;
  address?: string;
}

const OpenGoogleMapsButton: React.FC<OpenGoogleMapsButtonProps> = ({ mapsLink, address }) => {
  // Gunakan mapsLink dari props, atau fallback ke address untuk generate URL, atau default
  const getMapsUrl = () => {
    if (mapsLink) {
      return mapsLink;
    }
    if (address) {
      return `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
    }
    // Fallback default
    const defaultAddress = "RT.5/RW.13, Pulo Gebang, Kec. Cakung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13950";
    return `https://www.google.com/maps?q=${encodeURIComponent(defaultAddress)}`;
  };

  return (
    <div className="">
      <Link
        href={getMapsUrl()}
        target="_blank" // Membuka link di tab baru
        className="px-4 py-2 bg-primary text-darkprimary font-bold hover:scale-110 hover:bg-primarylight rounded-lg shadow-md shadow-darkprimary transition-all leading-relaxed"
      >
        Google Maps Lokasi
      </Link>
    </div>
  );
};

export default OpenGoogleMapsButton;
