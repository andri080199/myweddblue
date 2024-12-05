
import KutipanAyat from "@/components/KutipanAyat";
import FullScreenImage from "../components/FullScreenImage"; // Sesuaikan path dengan lokasi file
import Welcome from "@/components/Welcome";
import WeddingEvent from "@/components/WeddingEvent";
import WeddingGift from "@/components/WeddingGift";
import OurGallery from "@/components/OurGallery";
import RSVPForm from "@/components/RSVPForm";
import GuestBookList from "@/components/GuestBookList";
import Footer from "@/components/Footer";

const Page: React.FC = () => {
  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <FullScreenImage
        src="/images/WeddingBG.jpg" // Path gambar
        alt="Example Full Screen Image"
      />
    </div>
    <KutipanAyat/>
    <Welcome/>
    <WeddingEvent/>
    <WeddingGift/>
    <OurGallery/>
    <RSVPForm/>
    <GuestBookList/>
    <Footer/>
    </>
  );
};

export default Page;
