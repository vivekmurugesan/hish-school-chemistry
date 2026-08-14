import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Chemistry Explorer',
  description: 'Interactive learning platform for chemistry students',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        {children}
      </body>
    </html>
  );
}
