'use client'

import React, { useEffect } from "react";
import KutipanAyat from "@/components/KutipanAyat";
import FullScreenImage from "../components/FullScreenImage"; // Sesuaikan path dengan lokasi file
import Welcome from "@/components/Welcome";
import WeddingEvent from "@/components/WeddingEvent";
import WeddingGift from "@/components/WeddingGift";
import OurGallery from "@/components/OurGallery";
import RSVPForm from "@/components/RSVPForm";
import GuestBookList from "@/components/GuestBookList";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import Image from "next/image";

const Page: React.FC = () => {
  useEffect(() => {
    // Scroll ke komponen dengan id "fullscreen-image" saat halaman di-refresh
    const fullScreenImage = document.getElementById("fullscreen-image");
    if (fullScreenImage) {
      fullScreenImage.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <>
    <div id="fullscreen-image" className="flex items-center justify-center min-h-screen bg-gray-100">
      <FullScreenImage
        src="/images/WeddingBG.jpg" // Path gambar
        alt="Example Full Screen Image"
      />
    </div>
    <KutipanAyat/>
    <Welcome/>
    <div className="relative min-h-screen bg-primary py-12">
    <div className='absolute inset-0 overflow-hidden z-20'>
      <Image
        src={"/images/PojokKananBunga.png"}
        alt="Chip"
        width={170}
        height={170}
        className="absolute -top-16 -right-12 z-0 animate-tiltRight" 
      />

      <Image
        src={"/images/PojokKiriBunga.png"}
        alt="Chip"
        width={170}
        height={170}
        className="absolute -top-16 -left-12 z-0 animate-tiltLeft" 
        />
      </div>
      <h1 className="text-5xl font-bold text-center mb-8 font-lavishly text-darkprimary ">Love Story</h1>
      <Timeline />
    </div>
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
