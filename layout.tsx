import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'অফিস মেস ম্যানেজার',
  description: 'অফিস মেসের সদস্য, খরচ, মিল ও হিসাব পরিচালনার সিস্টেম',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
