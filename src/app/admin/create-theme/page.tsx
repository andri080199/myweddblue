'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Palette, ImageIcon, Sparkles } from 'lucide-react';

export default function CreateThemeLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button
            onClick={() => router.push('/admin')}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <Sparkles className="w-10 h-10 text-purple-600" />
              Create Custom Theme
            </h1>
            <p className="text-gray-600 mt-2">
              Pilih tipe tema yang ingin dibuat - Colors atau Backgrounds
            </p>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-blue-900 mb-2">✨ Sistem Baru: Mix & Match</h2>
          <p className="text-blue-800 text-sm leading-relaxed">
            Sekarang kamu bisa membuat <strong>Color Theme</strong> dan <strong>Background Theme</strong> secara terpisah,
            lalu mix & match sesuka hati! Contoh: warna "Ocean Blue" bisa dipadu dengan background "Nature", "City",
            atau background custom lainnya.
          </p>
        </div>

        {/* Theme Type Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Color Theme Card */}
          <div
            onClick={() => router.push('/admin/create-color-theme')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-500"
          >
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 text-white">
              <Palette className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-2">Color Theme</h2>
              <p className="text-blue-100 text-sm">
                Buat tema warna custom dengan 8 pilihan warna
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">Yang bisa dikustomisasi:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span><strong>8 warna utama:</strong> Primary, Light, Dark, Text, Gold, Light Blue, Secondary, Accent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span><strong>Preset ready:</strong> 5 preset warna siap pakai</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span><strong>Live preview:</strong> Lihat hasil langsung</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span><strong>Custom gradient:</strong> Automatic gradient generation</span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                  <Palette className="w-5 h-5" />
                  Create Color Theme
                </button>
              </div>
            </div>
          </div>

          {/* Background Theme Card */}
          <div
            onClick={() => router.push('/admin/create-background-theme')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 border-transparent hover:border-purple-500"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white">
              <ImageIcon className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform" />
              <h2 className="text-2xl font-bold mb-2">Background Theme</h2>
              <p className="text-purple-100 text-sm">
                Upload background untuk setiap section undangan
              </p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-800 mb-3">11 Section backgrounds:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Fullscreen</strong> - Gambar pembuka hero</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Welcome, Timeline, Event</strong> - Section utama</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Gallery, RSVP, Guestbook</strong> - Section interaktif</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">✓</span>
                  <span><strong>Dan 5 section lainnya...</strong></span>
                </li>
              </ul>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <button className="w-full py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-5 h-5" />
                  Create Background Theme
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Cara Kerja Mix & Match
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Buat Color Theme</h3>
              <p className="text-sm text-gray-600">
                Pilih 8 warna sesuai preferensi atau gunakan preset
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Buat Background Theme</h3>
              <p className="text-sm text-gray-600">
                Upload gambar untuk 11 section undangan
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Mix saat Create Client</h3>
              <p className="text-sm text-gray-600">
                Pilih color + background theme secara terpisah
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              <strong>Contoh kombinasi:</strong> "Ocean Blue" (color) + "Flora Garden" (background)
              atau "Romantic Pink" (color) + "City Modern" (background)
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/admin/theme-backgrounds')}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all text-left"
          >
            <h3 className="font-semibold text-gray-800 mb-1">Manage Existing Themes</h3>
            <p className="text-sm text-gray-600">Edit atau hapus tema yang sudah ada</p>
          </button>

          <button
            onClick={() => router.push('/admin/create-client')}
            className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all text-left"
          >
            <h3 className="font-semibold text-gray-800 mb-1">Create Client</h3>
            <p className="text-sm text-gray-600">Buat undangan baru dengan tema custom</p>
          </button>
        </div>
      </div>
    </div>
  );
}
