export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
}

export const addToGoogleCalendar = (event: CalendarEvent): void => {
  const formatDateForGoogle = (date: Date): string => {
    // Validasi apakah date object valid
    if (!date || isNaN(date.getTime())) {
      console.error('Invalid date provided to formatDateForGoogle:', date);
      return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const startDate = formatDateForGoogle(event.startDate);
  const endDate = formatDateForGoogle(event.endDate);
  
  const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
  googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
  googleCalendarUrl.searchParams.set('text', event.title);
  googleCalendarUrl.searchParams.set('dates', `${startDate}/${endDate}`);
  
  if (event.description) {
    googleCalendarUrl.searchParams.set('details', event.description);
  }
  
  if (event.location) {
    googleCalendarUrl.searchParams.set('location', event.location);
  }

  // Open Google Calendar in new tab
  window.open(googleCalendarUrl.toString(), '_blank');
};

export const createCalendarEvent = (
  eventType: 'akad' | 'resepsi',
  weddingDate: string,
  eventTime: string,
  venue: string,
  address: string,
  clientSlug?: string
): CalendarEvent => {
  // Parse date and time dengan validasi
  let eventDate: Date;
  try {
    eventDate = new Date(weddingDate);
    if (isNaN(eventDate.getTime())) {
      // Fallback jika tanggal tidak valid
      eventDate = new Date('2024-04-28');
    }
  } catch {
    eventDate = new Date('2024-04-28');
  }

  // Parse waktu dengan validasi
  const [startTime] = eventTime.split(' s.d ');
  const timeParts = startTime.split('.');
  const hours = parseInt(timeParts[0]) || 11;
  const minutes = parseInt(timeParts[1]) || 0;
  
  const startDate = new Date(eventDate);
  startDate.setHours(hours, minutes, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 2); // Default 2 hours duration
  
  const baseTitle = eventType === 'akad' ? 'Akad Nikah' : 'Resepsi Pernikahan';
  const title = clientSlug ? `${baseTitle} - ${clientSlug}` : baseTitle;
  const description = `${baseTitle} - ${venue}`;
  const location = `${venue}, ${address}`;
  
  return {
    title,
    description,
    location,
    startDate,
    endDate
  };
};