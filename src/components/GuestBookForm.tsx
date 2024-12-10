'use client';
// GuestBookForm.tsx
import React, { useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface GuestBookFormProps {
  onNewEntry: (entry: { name: string; message: string; timestamp: string }) => void;
}

const GuestBookForm: React.FC<GuestBookFormProps> = ({ onNewEntry }) => {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [feedback, setFeedback] = useState("");

  // Menangani perubahan input field
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Menangani pengiriman form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      setFeedback("Both fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Membuat entri baru dengan timestamp
        const newEntry = {
          name: formData.name,
          message: formData.message,
          timestamp: new Date().toISOString(),
        };

        // Panggil callback untuk memperbarui daftar
        onNewEntry(newEntry);

        // Reset form dan beri umpan balik
        setFeedback("Your message has been submitted successfully!");
        setFormData({ name: "", message: "" });
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        setFeedback(errorData.error || "Failed to submit your message. Please try again.");
      }
    } catch (error) {
      console.error("Frontend error:", error);
      setFeedback("An error occurred. Please try again.");
    }
  };

  return (
    
    <ScrollReveal>
    <div className="mx-auto bg-primarylight shadow-lg rounded-2xl p-6">
      
      <h2 className="text-2xl font-bold mb-4 text-gold font-lavishly text-center">Pray & Wish</h2>
      <h1 className="text-sm font-merienda mb-4 text-center text-darkprimary">Beri Ucapan dan Doa kepada kami yang sedang berbahagia.</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-textprimary">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border text-textprimary border-textprimary rounded-md shadow-sm focus:ring-textprimary focus:border-textprimary"
            placeholder="Enter your name"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-textprimary">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            className="block w-full mt-1 p-2 border text-textprimary border-textprimary rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Write your prayer or wishes"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-textprimary text-white py-2 px-4 rounded-md hover:bg-primary"
        >
          Beri Ucapan
        </button>
        {feedback && (
          <p className={`mt-2 text-sm font-mono text-center ${feedback.includes("successfully") ? "text-textprimary" : "text-red-500"}`}>
            {feedback}
          </p>
        )}
      </form>
    </div>
    </ScrollReveal>
  );
};

export default GuestBookForm;
