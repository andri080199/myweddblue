"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface BankCardProps {
  bankType: string;
  accountNumber: string;
  accountName: string;
}

interface BankLogo {
  name: string;
  path: string;
  fileName: string;
}

const bankConfig: Record<string, {
  chipVisible: boolean;
  buttonText: string;
  logoWidth: number;
  logoHeight: number;
  logoPosition: string;
}> = {
  'bri': {
    chipVisible: true,
    buttonText: 'Salin No. Rekening',
    logoWidth: 80,
    logoHeight: 80,
    logoPosition: 'absolute -top-6 -right-2'
  },
  'bca': {
    chipVisible: true,
    buttonText: 'Salin No. Rekening',
    logoWidth: 80,
    logoHeight: 80,
    logoPosition: 'absolute -top-6 -right-2'
  },
  'mandiri': {
    chipVisible: true,
    buttonText: 'Salin No. Rekening',
    logoWidth: 80,
    logoHeight: 80,
    logoPosition: 'absolute -top-6 -right-2'
  },
  'bni': {
    chipVisible: true,
    buttonText: 'Salin No. Rekening',
    logoWidth: 80,
    logoHeight: 80,
    logoPosition: 'absolute -top-6 -right-2'
  },
  'btn': {
    chipVisible: true,
    buttonText: 'Salin No. Rekening',
    logoWidth: 80,
    logoHeight: 80,
    logoPosition: 'absolute -top-6 -right-2'
  },
  'cimb': {
    chipVisible: true,
    buttonText: 'Salin No. Rekening',
    logoWidth: 80,
    logoHeight: 80,
    logoPosition: 'absolute -top-6 -right-2'
  },
  'dana': {
    chipVisible: false,
    buttonText: 'Salin No. Dana',
    logoWidth: 96,
    logoHeight: 96,
    logoPosition: 'flex justify-end'
  },
  'ovo': {
    chipVisible: false,
    buttonText: 'Salin No. OVO',
    logoWidth: 96,
    logoHeight: 96,
    logoPosition: 'flex justify-end'
  },
  'gopay': {
    chipVisible: false,
    buttonText: 'Salin No. GoPay',
    logoWidth: 96,
    logoHeight: 96,
    logoPosition: 'flex justify-end'
  },
  'shopeepay': {
    chipVisible: false,
    buttonText: 'Salin No. ShopeePay',
    logoWidth: 96,
    logoHeight: 96,
    logoPosition: 'flex justify-end'
  },
  'linkaja': {
    chipVisible: false,
    buttonText: 'Salin No. LinkAja',
    logoWidth: 96,
    logoHeight: 96,
    logoPosition: 'flex justify-end'
  }
};

const DynamicBankCard: React.FC<BankCardProps> = ({ bankType, accountNumber, accountName }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [bankLogos, setBankLogos] = useState<BankLogo[]>([]);

  const bankTypeLower = bankType.toLowerCase().trim();
  const config = bankConfig[bankTypeLower] || bankConfig['bri']; // Default to BRI if unknown

  useEffect(() => {
    fetchBankLogos();
  }, []);

  useEffect(() => {
    if (bankLogos.length > 0) {
      const logo = getBankLogo(bankType);
      setLogoPath(logo);
    }
  }, [bankLogos, bankType]);

  const fetchBankLogos = async () => {
    try {
      const response = await fetch(`/api/bank-logos?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setBankLogos(data);
      }
    } catch (error) {
      console.error('Error fetching bank logos:', error);
    }
  };

  const getBankLogo = (bankName: string) => {
    if (!bankName) return null;
    const bankNameLower = bankName.toLowerCase().trim();
    const logo = bankLogos.find(logo => logo.name.toLowerCase().trim() === bankNameLower);
    return logo ? `${logo.path}?t=${Date.now()}` : null;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (error) {
      console.error("Gagal menyalin teks ke clipboard:", error);
    }
  };

  return (
    <div className="relative w-72 h-52 px-6 pt-8 my-6 bg-primary rounded-xl shadow-lg text-white items-center mx-auto"
    style={{
      backgroundImage: "url('/images/bgcard.jpg')",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      
      {config.chipVisible ? (
        <div className="relative w-full h-16">
          {/* Chip Logo */}
          <Image
            src={"/images/banks/chip.png"}
            alt="Chip"
            width={48}
            height={48}
            className="absolute top-6 left-2"
          />
          {/* Bank Logo */}
          {logoPath && (
            <Image
              src={logoPath}
              alt={`${bankType} Logo`}
              width={config.logoWidth}
              height={config.logoHeight}
              className={config.logoPosition}
              unoptimized
              key={`bank-card-${bankType}-${logoPath}`}
            />
          )}
        </div>
      ) : (
        <div className={config.logoPosition}>
          <div className="">
            {logoPath && (
              <Image
                src={logoPath}
                alt={`${bankType} Logo`}
                width={config.logoWidth}
                height={config.logoHeight}
                className=""
                unoptimized
                key={`bank-card-${bankType}-${logoPath}`}
              />
            )}
          </div>
        </div>
      )}

      {/* Account Number */}
      <div className={`mb-2 ml-2 ${config.chipVisible ? 'pt-4' : 'pt-8'}`}>
        <p className="text-lg font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-mono text-left tracking-wider leading-relaxed">{accountNumber}</p>
        {accountName && (
          <p className="text-sm bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-semibold text-left mt-1 leading-relaxed">{accountName}</p>
        )}
      </div>

      {/* Copy Button - Positioned relative to main card */}
      <button
        onClick={handleCopy}
        className="absolute bottom-4 right-4 px-3 py-2 bg-primary rounded-lg bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent hover:scale-105 shadow-md shadow-darkprimary font-semibold text-xs leading-relaxed"
      >
        {isCopied ? "Berhasil Disalin" : config.buttonText}
      </button>
    </div>
  );
};

export default DynamicBankCard;