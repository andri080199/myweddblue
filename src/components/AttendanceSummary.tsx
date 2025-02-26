"use client";

import { useEffect, useState } from "react";

interface Guest {
  id: number;
  name: string;
  isAttending: boolean;
  responseDate: string;
}

const AttendanceSummary = () => {
  const [, setGuests] = useState<Guest[]>([]);
  const [attendingCount, setAttendingCount] = useState<number>(0);
  const [notAttendingCount, setNotAttendingCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    // Fetching data tamu dari API
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/rsvp");
        const data: Guest[] = await response.json();

        if (Array.isArray(data)) {
          setGuests(data);

          // Menghitung jumlah tamu yang hadir dan tidak hadir
          const attending = data.filter((guest) => guest.isAttending).length;
          const notAttending = data.filter((guest) => !guest.isAttending).length;
          const total = data.length; // Total tamu yang memberikan jawaban

          setAttendingCount(attending);
          setNotAttendingCount(notAttending);
          setTotalCount(total);
        } else {
          console.error("Invalid data format:", data);
        }
      } catch (error) {
        console.error("Error fetching guests:", error);
      }
    };

    fetchGuests();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 mb-4">
      <div className="p-4 bg-white text-textprimary shadow-md rounded-md">
        <p>Total guests who responded: <span className="font-bold">{totalCount}</span></p>
      </div>
      <div className="p-4 bg-green-300 text-textprimary shadow-md rounded-md">
        <p className="mb-2">Guests attending: <span className="font-bold">{attendingCount}</span></p>
      </div>
      <div className="p-4 bg-red-400 text-textprimary shadow-md rounded-md">
        <p className="mb-2">Guests not attending: <span className="font-bold">{notAttendingCount}</span></p>
      </div>
    </div>
  );
};

export default AttendanceSummary;
