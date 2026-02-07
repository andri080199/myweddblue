'use client';

import React, { useState, useEffect } from "react";
import ScrollReveal from "../ui/ScrollReveal";

interface GuestBookFormProps {
  onNewEntry: (entry: { name: string; message: string; timestamp: string }) => void;
  clientSlug: string;
}

const GuestBookForm: React.FC<GuestBookFormProps> = ({ onNewEntry, clientSlug }) => {
  const [formData, setFormData] = useState({ name: "", message: "" });
  const [feedback, setFeedback] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Cek apakah user sudah pernah submit
  useEffect(() => {
    const submitted = localStorage.getItem("guestSubmitted");
    if (submitted === "true") {
      setHasSubmitted(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      setFeedback("Both fields are required.");
      return;
    }

    try {
      const response = await fetch(`/api/guestbook?clientSlug=${clientSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newEntry = {
          name: formData.name,
          message: formData.message,
          timestamp: new Date().toISOString(),
        };

        onNewEntry(newEntry);

        setFeedback("Your message has been submitted successfully!");
        setFormData({ name: "", message: "" });
        setHasSubmitted(true);
        localStorage.setItem("guestSubmitted", "true");
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
      <div className="mx-auto bg-primarylight rounded-3xl border-2 border-darkprimary shadow-lg shadow-darkprimary p-6 md:p-8 lg:p-10 overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-4 left-4 animate-bounce">
            <span className="text-4xl text-darkprimary">♡</span>
          </div>
          <div className="absolute top-6 right-6 animate-pulse">
            <span className="text-3xl text-darkprimary">✦</span>
          </div>
          <div className="absolute bottom-8 left-6 animate-bounce" style={{animationDelay: '0.3s'}}>
            <span className="text-2xl text-darkprimary">★</span>
          </div>
          <div className="absolute bottom-4 right-4 animate-pulse" style={{animationDelay: '0.6s'}}>
            <span className="text-3xl text-darkprimary">♥</span>
          </div>
          <div className="absolute top-1/3 left-2 animate-bounce" style={{animationDelay: '0.9s'}}>
            <span className="text-xl text-darkprimary">✧</span>
          </div>
          <div className="absolute bottom-1/3 right-2 animate-pulse" style={{animationDelay: '1.2s'}}>
            <span className="text-2xl text-darkprimary">❋</span>
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 relative z-10">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-gold to-accent/80 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✦</span>
            </div>
            <h2 
              className="text-2xl md:text-3xl lg:text-4xl font-lavishly font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent drop-shadow-lg"
              style={{ lineHeight: '1.4', paddingBottom: '0.25rem' }}
            >
              Pray & Wish
            </h2>
            <div className="w-8 h-8 bg-gradient-to-r from-gold/80 to-accent rounded-full flex items-center justify-center">
              <span className="text-white text-sm">♡</span>
            </div>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-gold/50 via-gold to-accent/50 rounded-full mx-auto mb-4"></div>
          <p className="text-sm md:text-base font-merienda text-darkprimary leading-relaxed px-2">
            Beri ucapan dan doa kepada kami yang sedang berbahagia.
          </p>
        </div>

        {/* Content Section */}
        <div className="relative z-10">
          {hasSubmitted ? (
            <div className="text-center bg-primary/20 backdrop-blur-sm rounded-2xl border border-darkprimary p-4 md:p-4">
              <div className="w-8 h-8 bg-darkprimary rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-sm text-primarylight">✓</span>
              </div>
              <p className="text-center font-bold text-darkprimary font-merienda text-md">
                Terima kasih! Anda sudah mengirimkan ucapan. ♡
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="group">
                <label htmlFor="name" className="block text-sm md:text-base font-semibold text-darkprimary mb-2 font-merienda">
                  Nama Kamu
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 md:p-4 bg-primarylight backdrop-blur-sm border-2 border-darkprimary rounded-2xl focus:border-darkprimary focus:ring-2 focus:ring-primary text-darkprimary font-medium transition-all duration-300 placeholder:text-darkprimary/50"
                    placeholder="Masukkan nama lengkap kamu"
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Message Input */}
              <div className="group">
                <label htmlFor="message" className="block text-sm md:text-base font-semibold text-darkprimary mb-2 font-merienda">
                  Ucapan & Doa
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full p-3 md:p-4 bg-primarylight backdrop-blur-sm border-2 border-darkprimary rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary text-darkprimary font-medium transition-all duration-300 placeholder:text-darkprimary/50 resize-none"
                    rows={4}
                    placeholder="Tulis ucapan dan doa terbaik untuk kami..."
                    required
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full group relative py-2 md:py-2 px-6 bg-gradient-to-r from-darkprimary to-primary text-primarylight rounded-2xl font-bold text-md font-merienda transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-darkprimary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <span>♦</span>
                  <span>Kirim Ucapan</span>
                </div>
              </button>

              {/* Feedback Message */}
              {feedback && (
                <div className={`mt-4 text-center backdrop-blur-sm rounded-2xl border p-4 ${
                  feedback.includes("successfully") 
                    ? "bg-green-50/80 border-green-200 text-green-600" 
                    : "bg-red-50/80 border-red-200 text-red-600"
                }`}>
                  <p className="text-sm md:text-base font-merienda font-medium">{feedback}</p>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default GuestBookForm;
