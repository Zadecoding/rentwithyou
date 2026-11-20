'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { fetchAllPropertiesForAdmin, fetchUserProperties, deleteProperty } from '@/lib/propertyStore';
import { Property } from '@/types';
import {
  ShieldCheck,
  PlusCircle,
  Building,
  LogOut,
  Mail,
  Lock,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const {
    user,
    isAdmin,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    isLoading,
  } = useAuth();
  const { count: wishlistCount } = useWishlist();

  // Auth form state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // User properties
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(false);

  useEffect(() => {
    async function loadUserProps() {
      if (!user) return;
      setLoadingProps(true);
      if (isAdmin) {
        const all = await fetchAllPropertiesForAdmin();
        setMyProperties(all);
      } else {
        const mine = await fetchUserProperties(user.id, user.email);
        setMyProperties(mine);
      }
      setLoadingProps(false);
    }
    loadUserProps();
  }, [user, isAdmin]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    if (authMode === 'signin') {
      const { error } = await signInWithEmail(email, password);
      if (error) setAuthError(error.message);
    } else {
      const { error } = await signUpWithEmail(email, password);
      if (error) setAuthError(error.message);
    }
    setIsAuthLoading(false);
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm('Are you sure you want to delete this property listing?')) {
      await deleteProperty(id);
      setMyProperties((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 size={12} />
            <span>Approved & Live</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
            <XCircle size={12} />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
            <Clock size={12} />
            <span>Pending Review</span>
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-[#E59A38] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // If user is not logged in, show Auth Screen
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Link href="/" className="inline-block hover:opacity-95 transition-opacity" title="Rent With You">
                <Logo variant="dark" height={50} />
              </Link>
            </div>
            <h1 className="text-2xl font-black text-[#1B2A4A]">
              {authMode === 'signin' ? 'Login' : 'Sign Up'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {authMode === 'signin'
                ? 'Welcome back! Login to manage your listed properties & wishlist'
                : 'Create an account to list properties and sync your wishlist'}
            </p>
          </div>

          {/* Toggle between Login and Sign Up */}
          <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setAuthError('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                authMode === 'signin'
                  ? 'bg-white text-[#1B2A4A] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setAuthError('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                authMode === 'signup'
                  ? 'bg-white text-[#1B2A4A] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs font-medium pl-9 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs font-medium pl-9 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full py-3.5 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-extrabold text-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isAuthLoading
                ? 'Processing...'
                : authMode === 'signin'
                ? 'Login'
                : 'Sign Up'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                setAuthError('');
              }}
              className="text-xs font-semibold text-[#E59A38] hover:underline cursor-pointer"
            >
              {authMode === 'signin'
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in Profile View
  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-10 space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#1B2A4A] text-white flex items-center justify-center font-black text-2xl shadow-md">
            {user.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#1B2A4A]">
                {user.email?.split('@')[0]}
              </h1>
              {isAdmin && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-[#E59A38] font-bold text-xs border border-amber-300">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-extrabold text-xs shadow-md transition"
            >
              <ShieldCheck size={16} />
              <span>Open Admin Dashboard</span>
            </Link>
          )}

          <Link
            href="/list-your-property"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs shadow-xs transition"
          >
            <PlusCircle size={16} />
            <span>List New Property</span>
          </Link>

          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold transition"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Wishlist Items
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#1B2A4A]">{wishlistCount}</span>
            <Link
              href="/wishlist"
              className="text-xs font-bold text-[#E59A38] hover:underline flex items-center gap-1"
            >
              <span>View wishlist</span>
              <ExternalLink size={12} />
            </Link>
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Properties Listed
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-black text-[#1B2A4A]">{myProperties.length}</span>
            <span className="text-xs text-gray-500">Submitted by you</span>
          </div>
        </div>

        <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            Account Status
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-sm font-bold text-[#1B2A4A]">Active & Verified</span>
          </div>
        </div>
      </div>

      {/* My Submitted Properties Table/List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg sm:text-xl font-black text-[#1B2A4A]">
            My Property Listings
          </h2>
          <Link
            href="/list-your-property"
            className="text-xs font-bold text-[#E59A38] hover:underline"
          >
            + Add another listing
          </Link>
        </div>

        {loadingProps ? (
          <p className="text-xs text-gray-500">Loading your properties...</p>
        ) : myProperties.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Building size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-sm font-bold text-gray-700">No properties listed yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Have a home, room, or commercial space to rent or sell? List it for free!
            </p>
            <Link
              href="/list-your-property"
              className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-[#E59A38] text-white font-bold text-xs"
            >
              List Your Property in 2 Minutes
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myProperties.map((prop) => (
                  <tr key={prop.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      <Link
                        href={`/property/${prop.property_code || prop.id}`}
                        className="hover:text-[#E59A38] transition"
                      >
                        {prop.title}
                      </Link>
                      <span className="block text-[10px] font-mono text-gray-400">
                        ID: {prop.property_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-gray-700">
                      {prop.category}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{prop.area}</td>
                    <td className="py-3.5 px-4 font-bold text-[#1B2A4A]">
                      {prop.price_label}
                    </td>
                    <td className="py-3.5 px-4">{getStatusBadge(prop.status)}</td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        href={`/property/${prop.property_code || prop.id}`}
                        className="p-1.5 rounded-lg text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-100 inline-block"
                        title="View Property"
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(prop.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition inline-block"
                        title="Delete listing"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
