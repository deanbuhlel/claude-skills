import { Suspense } from 'react';
import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Conversation Summarizer',
  description: 'Summarize long conversations using Claude AI to save tokens.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}
