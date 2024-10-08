import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "@/components/ui/sonner";
import { ExitModal } from "@/components/modal/exit-modal";
import { HeartsModal } from "@/components/modal/hearts-modal";
import { PracticeModal } from "@/components/modal/practice-modal";
import "./globals.css";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Ligo",
    template: '%s | Lingo',
  },
  description: "Belajar, berlatih, dan menguasai bahasa baru bersama Lingo.",
  icons: [
    {
      url: "/mascot.svg",
      href: "/mascot.svg"
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={font.className}>
          <Toaster />
          <ExitModal />
          <HeartsModal />
          <PracticeModal />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
