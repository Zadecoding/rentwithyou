'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import ConnectUsModal from './ConnectUsModal';
import Logo from './Logo';
import { Heart, User, Menu, X, ShieldCheck } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const { count } = useWishlist();
  const { user, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'For Owner & Developer', href: '/list-your-property' },
    { label: 'Rent', href: '/rent' },
    { label: 'Buy', href: '/buy' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'About', href: '/about' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Brand Logo */}
            <Link href="/" className="flex items-center group py-1" aria-label="Rent With You - Home">
              <Logo variant="dark" height={44} className="group-hover:opacity-90 transition-opacity" />
            </Link>

            {/* Center Menu (Desktop 6 items) */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2 text-sm font-semibold transition-all relative ${
                      active
                        ? 'text-[#1B2A4A]'
                        : 'text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-50 rounded-lg'
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#E59A38] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Admin Quick Badge if logged in as Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-[#E59A38] border border-[#E59A38]/30 font-bold text-xs hover:bg-amber-500/20 transition"
                  title="Admin Dashboard"
                >
                  <ShieldCheck size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Profile Link */}
              <Link
                href="/profile"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                  pathname === '/profile'
                    ? 'bg-gray-100 text-[#1B2A4A]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User size={18} className="text-gray-600" />
                <span>{user ? user.email?.split('@')[0] || 'Profile' : 'Profile'}</span>
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition relative ${
                  pathname === '/wishlist'
                    ? 'bg-rose-50 text-rose-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart
                  size={18}
                  className={count > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}
                />
                <span>Wishlist</span>
                {count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500 text-white leading-none">
                    {count}
                  </span>
                )}
              </Link>

              {/* Connect Us Button */}
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-5 py-2.5 rounded-xl border-2 border-[#1B2A4A] text-[#1B2A4A] hover:bg-[#1B2A4A] hover:text-white font-bold text-sm transition-all duration-200 shadow-xs"
              >
                Connect Us
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center space-x-2">
              <Link
                href="/wishlist"
                className="p-2 text-gray-700 relative hover:bg-gray-100 rounded-lg"
                aria-label="Wishlist"
              >
                <Heart
                  size={20}
                  className={count > 0 ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}
                />
                {count > 0 && (
                  <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {count}
                  </span>
                )}
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-[#E59A38] font-bold text-sm border border-amber-200 mb-2"
              >
                <ShieldCheck size={18} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition ${
                    active
                      ? 'bg-[#1B2A4A] text-white'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#1B2A4A]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold text-gray-700 hover:bg-gray-50"
              >
                <User size={18} />
                <span>{user ? user.email || 'My Profile' : 'Profile / Login'}</span>
              </Link>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsConnectModalOpen(true);
                }}
                className="w-full text-center py-3 rounded-xl bg-[#1B2A4A] text-white font-bold text-sm shadow-sm"
              >
                Connect Us
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Connect Us Modal */}
      <ConnectUsModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </>
  );
}
