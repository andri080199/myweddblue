"use client";

import { Share2 } from "lucide-react";

interface WhatsAppShareButtonProps {
  name: string;
  phone: string;
  url: string;
}

export default function WhatsAppShareButton({
  name,
  phone,
  url,
}: WhatsAppShareButtonProps) {
  const message = `Yth. ${name}

Assalamualaikum Wr. Wb

Dengan memohon Rahmat Dan Ridho Allah SWT, dan tanpa mengurangi rasa hormat kami, melalui media sosial ini, kami *Mita & Angga* mengundang Bapak/Ibu/Sdr/i untuk berkenan hadir di acara pernikahan kami.

*Detail Acara:*
${url}

Merupakan suatu kehormatan dan kebahagiaan jika Anda bersedia hadir dan turut memberikan doa restu untuk kami.

Terimakasih kami sampaikan Bapak/Ibu/Sdr/i.

Wassalamualaikum Wr. Wb
*Angga & Mita*`;

  const waLink = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={waLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-600 hover:text-green-800"
      title="Bagikan via WhatsApp"
    >
      <Share2 size={16} />
    </a>
  );
}
