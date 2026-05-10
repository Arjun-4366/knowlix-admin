import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import QueryClientProvider from "@/context/QueryClientProvider";
import { Toaster } from "react-hot-toast";
import { ConfirmationProvider } from "@/context/ConfirmationContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Knowlix Admin",
  description: "Admin panel for Knowlix Learning",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable} h-full antialiased`}
    >
      <QueryClientProvider>
        <ConfirmationProvider>
          <body className="min-h-full flex flex-col">
            {children}
            <Toaster position="top-right" />
          </body>
        </ConfirmationProvider>
      </QueryClientProvider>
    </html>
  );
}
