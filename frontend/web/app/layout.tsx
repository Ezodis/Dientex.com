import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/app/components/ui/toaster";
import {AutomaticTranslationProvider} from '../localization/client';
import {getInitialLocalization} from '../localization/server';
import {direction} from '../localization/core.cjs';

export const metadata: Metadata = {
  title: "Dientex - Gestión de Consultorio Dental",
  description: "Sistema completo de gestión para consultorios dentales - Dientex",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localization = await getInitialLocalization();
  return (
    <html lang={localization.language} dir={direction(localization.language)}>
      <body className="antialiased">
        <AutomaticTranslationProvider initial={localization}>
          {children}
          <Toaster />
        </AutomaticTranslationProvider>
      </body>
    </html>
  );
}
