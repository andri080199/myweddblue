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
import Navbar from "@/components/Navbar";
import MusicCircle from "@/components/MusicCircle";

const Page: React.FC = () => {
  useEffect(() => {
    // Scroll ke komponen dengan id "fullscreen-image" saat halaman di-refresh
    const fullScreenImage = document.getElementById("fullscreen-image");
    if (fullScreenImage) {
      fullScreenImage.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <div className="relative md:w-1/2 lg:w-1/3 mx-auto">
    <div id="fullscreen-image" className="flex items-center justify-center min-h-screen bg-gray-100">
      <FullScreenImage
          src="/images/PohonPutih.jpg" // Path gambar
          alt="Example Full Screen Image" guestName={""}      />
    </div>
    <KutipanAyat/>
    <Welcome/>
    <div id="lovestory" className="relative h-max bg-primary py-12">
      <h1 className="relative z-30 text-5xl font-bold text-center mb-8 font-lavishly text-gold">Love Story</h1>
      <div>
     <Image
        src={"/images/BangkuSalju.jpg"}
        alt="Chip"
        layout="fill" // Mengisi kontainer
        objectFit="cover"
        quality={100}
        className="relativeh-full z-0 saturate-0"
      />
      <div className="absolute inset-0 bg-primarylight opacity-60"></div>
     </div>
      <Timeline />
    </div>
    <WeddingEvent/>
    <WeddingGift/>
    <OurGallery/>
    <RSVPForm/>
    <GuestBookList/>
    <Footer/>
    <Navbar/>
    <div className="relative mx-auto bg-gray-300">
    <MusicCircle/>
    </div>
  
    </div>
  );
};

export default Page;
