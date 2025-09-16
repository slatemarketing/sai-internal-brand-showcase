import type { Metadata } from "next";
import { Montserrat, Open_Sans, Poppins } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SlateAI | Brand Assets",
  description: "Your central hub for logos and color palettes.",
  icons: {
    icon: [
      { url: "https://cdn.slateai.org/Logos/ICOs/favicon.ico" }, // ICO
      {
        url: "https://cdn.slateai.org/Logos/ICOs/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://cdn.slateai.org/Logos/ICOs/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "https://cdn.slateai.org/Logos/ICOs/apple-touch-icon.png",
        sizes: "180x180",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${openSans.variable} ${montserrat.variable} ${poppins.variable} ${openSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
