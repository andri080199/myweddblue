import type { Metadata } from "next";

import { Inter } from "next/font/google";
import {
  Lavishly_Yours,
  Merienda,
  Fahkwang as Fajardose,
  Fleur_De_Leah,
  Poppins,
  Allura,
} from "next/font/google";
import "../../globals.css";

// Font Lokal

// Font Google
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "700"],
});

const lavishly = Lavishly_Yours({
  subsets: ["latin"],
  variable: "--font-lavishly",
  weight: "400",
});

const merienda = Merienda({
  subsets: ["latin"],
  variable: "--font-merienda",
  weight: ["400", "700"], // Pilih bobot yang sesuai
});

const fajardose = Fajardose({
  subsets: ["latin"],
  variable: "--font-fajardose",
  weight: "400", // Fajardose hanya mendukung 400
});

const fleur = Fleur_De_Leah({
  subsets: ["latin"],
  variable: "--font-fleur",
  weight: "400", // Fleur De Leah hanya mendukung 400
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "700"], // Pilih bobot yang sesuai
});

// Font Allura
const allura = Allura({
  subsets: ["latin"],
  variable: "--font-allura",
  weight: "400", // Allura hanya mendukung 400
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${inter.variable} ${lavishly.variable} ${merienda.variable} ${fajardose.variable} ${fleur.variable} ${poppins.variable} ${allura.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
