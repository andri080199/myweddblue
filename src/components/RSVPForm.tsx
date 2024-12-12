'use client';
import { useState } from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const RSVPForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || isAttending === null) {
      setStatusMessage("Please provide your name and attendance status.");
      return;
    }

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, isAttending }),
      });

      if (response.ok) {
        setStatusMessage("Thank you! Your RSVP has been recorded.");
        setName("");
        setIsAttending(null);
      } else {
        const data = await response.json();
        setStatusMessage(`Error: ${data.message}`);
      }
    } catch {
      setStatusMessage("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-full py-8 px-6 overflow-hidden">
        <div>
     <Image
        src={"/images/PohonPutih.jpg"}
        alt="Chip"
        layout="fill" // Mengisi kontainer
        objectFit="cover"
        quality={100}
        className="relative-full -z-20 saturate-0"
      />
      <div className="absolute inset-0 bg-primarylight opacity-20 -z-20"></div>
     </div>
      <ScrollReveal>

    <div className="w-full mx-auto p-6 px-10 bg-primarylight shadow-md rounded-2xl">
      <h2 className="text-3xl font-semibold mb-2 text-center text-gold font-lavishly">Wedding RSVP</h2>
      <h1 className="text-sm font-merienda mb-4 text-center text-textprimary">bantu kami untuk mempersiapkan segalanya lebih baik dengan mengisi form kehadiran dibawah ini.</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="font-mono">
          <label htmlFor="name" className="block text-sm font-medium text-textprimary">
            Nama Kamu
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 p-2 border border-textprimary rounded-lg focus:outline-1 focus:outline-textprimary focus:ring-primary focus:border-primary text-textprimary"
            placeholder="Masukkan Nama Kamu"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-textprimary">Apakah Kamu Akan Hadir?</p>
          <div className="flex space-x-4 mt-2">
            <button
              type="button"
              onClick={() => setIsAttending(true)}
              className={`py-2 px-4 rounded-lg border border-darkprimary ${
                isAttending === true
                  ? "bg-darkprimary text-primary"
                  : "bg-primarylight text-darkprimary"
              } hover:bg-darkprimary hover:text-primarylight`}
            >
              Ya
            </button>
            <button
              type="button"
              onClick={() => setIsAttending(false)}
              className={`py-2 px-4 rounded-lg border border-darkprimary ${
                isAttending === false
                  ? "bg-darkprimary text-primary"
                  : "bg-primarylight text-darkprimary"
              } hover:bg-darkprimary hover:text-white`}
            >
              Tidak
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-darkprimary text-white rounded-lg hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Konfirmasi Kehadiran
        </button>
      </form>

      {statusMessage && (
        <p className="mt-4 text-center text-sm font-merienda text-darkprimary">
          {statusMessage}
        </p>
      )}
    </div>
      </ScrollReveal>
    </div>
  );
};

export default RSVPForm;
