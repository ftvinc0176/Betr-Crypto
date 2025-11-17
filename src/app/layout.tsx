import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BETR - Premium Sports Betting Platform',
  description: 'Bet $20, Get $60 - No Playthrough Required. Join BETR today and start winning.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
