'use client';

import { useState, useEffect, useCallback } from 'react';
import ContentEditor from '@/components/forms/ContentEditor';
import PhotoUpload from '@/components/forms/PhotoUpload';
import SinglePhotoUpload from '@/components/forms/SinglePhotoUpload';

interface EditContentProps {
  clientSlug: string;
}

const EditContent: React.FC<EditContentProps> = ({ clientSlug }) => {
  const [galleryPhotos, setGalleryPhotos] = useState<any[]>([]);
  const [couplePhotos, setCouplePhotos] = useState({
    brideImage: '',
    groomImage: '',
    weddingImage: ''
  });
  const [bankOptions, setBankOptions] = useState<{ value: string; label: string }[]>([]);

  const formatBankLabel = (name: string) => {
    // Format nama bank untuk label yang lebih readable
    const bankNames: { [key: string]: string } = {
      'bri': 'Bank BRI',
      'bca': 'Bank BCA',
      'mandiri': 'Bank Mandiri',
      'bni': 'Bank BNI',
      'btn': 'Bank BTN',
      'cimb': 'Bank CIMB Niaga',
      'permata': 'Bank Permata',
      'danamon': 'Bank Danamon',
      'bsi': 'Bank Syariah Indonesia',
      'seabank': 'Seabank',
      'jenius': 'Jenius',
      'dana': 'Dana',
      'ovo': 'OVO',
      'gopay': 'GoPay',
      'shopeepay': 'ShopeePay',
      'linkaja': 'LinkAja'
    };

    return bankNames[name.toLowerCase()] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  const fetchBankLogos = async () => {
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/bank-logos?t=${Date.now()}`);
      if (response.ok) {
        const logos = await response.json();
        // Generate options from available logos
        const options = logos.map((logo: any) => ({
          value: logo.name,
          label: formatBankLabel(logo.name)
        }));
        setBankOptions(options);
      }
    } catch (error) {
      console.error('Error fetching bank logos:', error);
    }
  };

  useEffect(() => {
    fetchGalleryPhotos();
    fetchCouplePhotos();
    fetchBankLogos();

    // Refresh bank logos when window gains focus (user switches back from admin page)
    const handleFocus = () => {
      fetchBankLogos();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [clientSlug]);

  const fetchGalleryPhotos = async () => {
    try {
      const response = await fetch(`/api/client-gallery?clientSlug=${clientSlug}`);
      if (response.ok) {
        const photos = await response.json();
        setGalleryPhotos(photos);
      }
    } catch (error) {
      console.error('Error fetching gallery photos:', error);
    }
  };

  const fetchCouplePhotos = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=couple_info`);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched couple photos:', data);
        if (data.length > 0 && data[0].content_data) {
          setCouplePhotos({
            brideImage: data[0].content_data.brideImage || '',
            groomImage: data[0].content_data.groomImage || '',
            weddingImage: data[0].content_data.weddingImage || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching couple photos:', error);
    }
  };

  const handlePhotosChange = (newPhotos: any[]) => {
    setGalleryPhotos(newPhotos);
    // Fetch fresh data from API to make sure we have latest - delay to avoid setState during render
    setTimeout(() => {
      fetchGalleryPhotos();
    }, 100);
  };

  const handleCouplePhotoChange = (photoType: string, photoUrl: string) => {
    setCouplePhotos(prev => ({
      ...prev,
      [photoType]: photoUrl
    }));
    // Refresh couple photos after change
    setTimeout(() => {
      fetchCouplePhotos();
    }, 500);
  };

  // Default data untuk berbagai konten
  const coupleInfo = {
    brideFullName: 'Mita Sari Wulandari',
    brideChildOrder: '2',
    brideFatherName: 'Ali',
    brideMotherName: 'Siti',
    brideImage: '/images/WeddingGirl.jpg',
    groomFullName: 'Angga Pratama Wijaya',
    groomChildOrder: '1',
    groomFatherName: 'Bambang',
    groomMotherName: 'Wati',
    groomImage: '/images/WeddingBoy.jpg',
    weddingImage: '/images/WeddingBG.jpg'
  };

  const akadInfo = {
    weddingDate: '2025-12-22',
    akadTime: '08:00',
    venue: 'Contoh: Masjid Al-Ikhlas',
    address: 'Contoh: Jl. Raya Kemang No. 15, Jakarta Selatan, DKI Jakarta 12560',
    mapsLink: 'https://maps.google.com'
  };

  const resepsiInfo = {
    weddingDate: '2025-12-22',
    resepsiTime: '11:00',
    venue: 'Contoh: Gedung Balai Kartini',
    address: 'Contoh: Jl. Gatot Subroto No. 37, Jakarta Selatan, DKI Jakarta 12930',
    mapsLink: 'https://maps.google.com'
  };

  const kutipanAyat = {
    ayat: 'Dan di antara tanda-tanda kekuasaan-Nya ialah diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri supaya kamu mendapat ketenangan hati dan dijadikan-Nya kasih sayang di antara kamu.',
    sumber: 'QS. Ar-Rum: 21'
  };

  const loveStory = {
    story1: 'Contoh: Kami bertemu pertama kali di kedai kopi favorit pada musim hujan tahun 2020, saat mata kami saling bertemu dan dunia seakan berhenti berputar.',
    story2: 'Contoh: Setelah 3 tahun menjalin hubungan yang penuh cinta dan pengertian, kami memutuskan untuk melangkah ke jenjang yang lebih serius dan berkomitmen untuk masa depan bersama.',
    story3: 'Contoh: Akhirnya momen yang ditunggu tiba, ketika dia berlutut dan melamarku dengan cincin impian di bawah bintang-bintang yang menjadi saksi cinta kami.'
  };

  const weddingGift = {
    bankType1: 'BRI',
    bankName: 'Bank BRI',
    accountNumber: '1234567890',
    accountName: 'Angga Pratama',
    bankType2: 'Dana',
    bankName2: 'Dana',
    accountNumber2: '0852-7960-0131',
    accountName2: 'Mita Sari'
  };

  const giftAddress = {
    address: 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.'
  };

  const galleryVideo = {
    youtubeUrl: ''
  };


  const handlePreviewUndangan = () => {
    // Open preview in new tab with default guest name for preview
    const previewUrl = `/undangan/${clientSlug}/preview-undangan`;
    window.open(previewUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 overflow-visible">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Edit Undangan</h2>
              <p className="text-lg text-white/90">Lengkapi informasi undangan Anda</p>
            </div>
            <button
              onClick={handlePreviewUndangan}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>Lihat Undangan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Couple Information */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Informasi Pengantin</h3>
              <p className="text-gray-600">detail pengantin</p>
            </div>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="couple_info"
            title=""
            defaultData={coupleInfo}
            fields={[
              { key: 'brideFullName', label: 'Nama Lengkap Mempelai Wanita', type: 'text' },
              { 
                key: 'brideChildOrder', 
                label: 'Anak ke ? (e.g., 1, 2, 3)', 
                type: 'text',
                placeholder: '2'
              },
              { 
                key: 'brideFatherName', 
                label: 'Nama Ayah Mempelai Wanita', 
                type: 'text',
                placeholder: 'Ali'
              },
              { 
                key: 'brideMotherName', 
                label: 'Nama Ibu Mempelai Wanita', 
                type: 'text',
                placeholder: 'Siti'
              },
              { key: 'groomFullName', label: 'Nama Lengkap Mempelai Pria', type: 'text' },
              { 
                key: 'groomChildOrder', 
                label: 'Anak ke ? (e.g., 1, 2, 3)', 
                type: 'text',
                placeholder: '1'
              },
              { 
                key: 'groomFatherName', 
                label: 'Nama Ayah Mempelai Pria', 
                type: 'text',
                placeholder: 'Bambang'
              },
              { 
                key: 'groomMotherName', 
                label: 'Nama Ibu Mempelai Pria', 
                type: 'text',
                placeholder: 'Wati'
              }
            ]}
          />
        </div>

        {/* Photo Upload Section */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Foto Pengantin</h3>
              <p className="text-gray-600">Upload foto pengantin dan cover undangan</p>
            </div>
          </div>
          <div className="space-y-6">
            {/* Desktop: 2 columns + 1 centered */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <SinglePhotoUpload
                  clientSlug={clientSlug}
                  photoType="brideImage"
                  currentPhoto={couplePhotos.brideImage}
                  onPhotoChange={(url) => handleCouplePhotoChange('brideImage', url)}
                  label="Foto Pengantin Wanita"
                />
                <SinglePhotoUpload
                  clientSlug={clientSlug}
                  photoType="groomImage"
                  currentPhoto={couplePhotos.groomImage}
                  onPhotoChange={(url) => handleCouplePhotoChange('groomImage', url)}
                  label="Foto Pengantin Pria"
                />
              </div>
              <div className="max-w-md mx-auto">
                <SinglePhotoUpload
                  clientSlug={clientSlug}
                  photoType="weddingImage"
                  currentPhoto={couplePhotos.weddingImage}
                  onPhotoChange={(url) => handleCouplePhotoChange('weddingImage', url)}
                  label="Foto Cover Undangan"
                />
              </div>
            </div>
            
            {/* Mobile/Tablet: Vertical stack */}
            <div className="lg:hidden space-y-6">
              <SinglePhotoUpload
                clientSlug={clientSlug}
                photoType="brideImage"
                currentPhoto={couplePhotos.brideImage}
                onPhotoChange={(url) => handleCouplePhotoChange('brideImage', url)}
                label="Foto Pengantin Wanita"
              />
              <SinglePhotoUpload
                clientSlug={clientSlug}
                photoType="groomImage"
                currentPhoto={couplePhotos.groomImage}
                onPhotoChange={(url) => handleCouplePhotoChange('groomImage', url)}
                label="Foto Pengantin Pria"
              />
              <SinglePhotoUpload
                clientSlug={clientSlug}
                photoType="weddingImage"
                currentPhoto={couplePhotos.weddingImage}
                onPhotoChange={(url) => handleCouplePhotoChange('weddingImage', url)}
                label="Foto Cover Undangan"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Information Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Akad Nikah Info */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Akad Nikah</h3>
            <p className="text-gray-600">Detail acara akad nikah</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="akad_info"
            title=""
            defaultData={akadInfo}
            fields={[
              { key: 'weddingDate', label: 'Tanggal Akad', type: 'date' },
              { key: 'akadTime', label: 'Waktu Akad (contoh: 08:00)', type: 'time' },
              { key: 'venue', label: 'Nama Tempat', type: 'text' },
              { key: 'address', label: 'Alamat Lengkap', type: 'textarea' },
              { key: 'mapsLink', label: 'Link Google Maps (Opsional)', type: 'text' }
            ]}
          />
        </div>

        {/* Reception Info */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Resepsi</h3>
            <p className="text-gray-600">Detail acara resepsi</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="resepsi_info"
            title=""
            defaultData={resepsiInfo}
            fields={[
              { key: 'weddingDate', label: 'Tanggal Resepsi', type: 'date' },
              { key: 'resepsiTime', label: 'Waktu Resepsi (contoh: 11:00)', type: 'time' },
              { key: 'venue', label: 'Nama Tempat', type: 'text' },
              { key: 'address', label: 'Alamat Lengkap', type: 'textarea' },
              { key: 'mapsLink', label: 'Link Google Maps (Opsional)', type: 'text' }
            ]}
          />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Sacred Quote */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Kutipan Ayat</h3>
            <p className="text-gray-600">Ayat atau kutipan spiritual</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="kutipan_ayat"
            title=""
            defaultData={kutipanAyat}
            fields={[
              { key: 'ayat', label: 'Teks Ayat atau Kutipan', type: 'textarea' },
              { key: 'sumber', label: 'Sumber (contoh: QS. Ar-Rum: 21)', type: 'text' }
            ]}
          />
        </div>

        {/* Love Story */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Kisah Cinta</h3>
            <p className="text-gray-600">Perjalanan cinta Anda</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="love_story"
            title=""
            defaultData={loveStory}
            fields={[
              { key: 'story1', label: 'Kisah Pertemuan Pertama', type: 'textarea' },
              { key: 'story2', label: 'Kisah Pacaran', type: 'textarea' },
              { key: 'story3', label: 'Kisah Lamaran', type: 'textarea' }
            ]}
          />
        </div>
      </div>

      {/* Financial Information Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 overflow-visible">
        {/* Wedding Gift */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8 overflow-visible">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Hadiah Digital</h3>
            <p className="text-gray-600">Info rekening bank & e-wallet</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="wedding_gift"
            title=""
            defaultData={weddingGift}
            fields={[
              {
                key: 'bankType1',
                label: 'Bank/E-Wallet Utama',
                type: 'select',
                placeholder: 'Pilih Bank/E-Wallet',
                options: bankOptions
              },
              { key: 'accountNumber', label: 'Nomor Rekening', type: 'text' },
              { key: 'accountName', label: 'Nama Pemilik Rekening', type: 'text' },
              {
                key: 'bankType2',
                label: 'Bank/E-Wallet Kedua (Opsional)',
                type: 'select',
                placeholder: 'Pilih Bank/E-Wallet (Opsional)',
                options: [{ value: '', label: 'Tidak Ada (Skip)' }, ...bankOptions]
              },
              { key: 'accountNumber2', label: 'Nomor Rekening Kedua (Opsional)', type: 'text' },
              { key: 'accountName2', label: 'Nama Pemilik Rekening Kedua (Opsional)', type: 'text' }
            ]}
          />
        </div>

        {/* Gift Address */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8 overflow-visible">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Alamat Hadiah</h3>
            <p className="text-gray-600">Alamat pengiriman hadiah fisik</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="gift_address"
            title=""
            defaultData={giftAddress}
            fields={[
              { key: 'address', label: 'Alamat Lengkap Pengiriman', type: 'textarea' }
            ]}
          />
        </div>
      </div>

      {/* Gallery & Video Section Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* YouTube Video */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Video Pernikahan</h3>
            <p className="text-gray-600">Video YouTube untuk galeri</p>
          </div>
          <ContentEditor
            clientSlug={clientSlug}
            contentType="gallery_video"
            title=""
            defaultData={galleryVideo}
            fields={[
              { 
                key: 'youtubeUrl', 
                label: 'URL Video YouTube', 
                type: 'text',
                placeholder: 'contoh: https://www.youtube.com/watch?v=dQw4w9WgXcQ'
              }
            ]}
          />
          <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">💡</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-blue-800 font-medium mb-1">Cara mudah:</p>
                <p className="text-xs text-blue-700">
                  Cukup copy paste URL lengkap dari YouTube, contoh:<br/>
                  <code className="bg-blue-100 px-1 rounded">https://www.youtube.com/watch?v=dQw4w9WgXcQ</code><br/>
                  <code className="bg-blue-100 px-1 rounded">https://youtu.be/dQw4w9WgXcQ</code>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="bg-white/30 backdrop-blur-sm rounded-3xl border-2 border-darkprimary shadow-xl p-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Galeri Foto</h3>
            <p className="text-gray-600">Koleksi kenangan indah (Maksimal 10 foto)</p>
          </div>
          <PhotoUpload
            clientSlug={clientSlug}
            maxPhotos={10}
            currentPhotos={galleryPhotos}
            onPhotosChange={handlePhotosChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EditContent;