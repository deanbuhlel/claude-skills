'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquareText } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Summarize', href: '/' },
    // Add more navigation items here if needed
  ];

  return (
    <nav className="bg-primary-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 text-2xl font-bold font-display">
          <MessageSquareText size={28} />
          <span>Summarizer AI</span>
        </Link>
        <div className="flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative text-lg font-medium transition-colors hover:text-primary-200
                ${pathname === item.href ? 'text-primary-100' : 'text-white'}`}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-100 rounded-full"></span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
