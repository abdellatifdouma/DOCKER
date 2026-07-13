import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Erpium \u2014 Solutions Digitales | On optimise votre performance",
  description: "Erpium \u2014 Solutions Digitales. ERP, developpement web & mobile, agents IA telephoniques (francais & darija) et automatisation. Une filiale du groupe Arboris Management.",
  metadataBase: new URL('https://erpium.ma'),
  openGraph: {
    title: "Erpium \u2014 Solutions Digitales | On optimise votre performance",
    description: "Erpium \u2014 Solutions Digitales. ERP, developpement web & mobile, agents IA telephoniques (francais & darija) et automatisation. Une filiale du groupe Arboris Management.",
    url: 'https://erpium.ma',
    siteName: 'Erpium',
    locale: 'fr_MA',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
