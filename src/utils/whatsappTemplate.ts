// WhatsApp Message Template Utility

export interface WhatsAppMessageTemplate {
  template: string;
}

export const DEFAULT_WHATSAPP_MESSAGE = `Yth. [guestName]

Assalamualaikum Wr. Wb

Dengan memohon Rahmat Dan Ridho Allah SWT, Dan tanpa mengurangi rasa hormat kami. melalui media sosial ini, kami [clientSlug] mengundang Bapak/Ibu/Sdr/i untuk berkenan hadir di acara pernikahan kami.

Detail Acara:
[invitationUrl]
 
Merupakan suatu kehormatan dan kebahagiaan jika Anda bersedia hadir dan turut memberikan doa restu untuk kami

Terimakasih kami sampaikan Bapak/Ibu/Sdr/i.

Wassalamualaikum Wr.Wb
[clientSlug]`;

export const formatWhatsAppMessage = (
  template: string,
  guestName: string,
  clientSlug: string,
  invitationUrl: string
): string => {
  return template
    .replace(/\[guestName\]/g, guestName)
    .replace(/\[clientSlug\]/g, clientSlug)
    .replace(/\[invitationUrl\]/g, invitationUrl);
};

export const generateWhatsAppUrl = (
  phoneNumber: string,
  message: string
): string => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};