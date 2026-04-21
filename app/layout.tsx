import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Buat Kak Yipdaa 🎉",
  description: "A special birthday surprise",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${poppins.variable} h-full`}>
      <body className="min-h-dvh flex flex-col antialiased bg-[#07070f] text-white">
        {children}
      </body>
    </html>
  );
}
