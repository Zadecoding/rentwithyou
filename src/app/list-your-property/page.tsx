'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { createProperty, uploadPropertyImages } from '@/lib/propertyStore';
import { PropertyCategory, ListedByRole, PropertyType, Property } from '@/types';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import {
  Upload,
  CheckCircle2,
  X,
  AlertCircle,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Lock,
  Zap,
  Building,
  Home,
  Briefcase,
  ExternalLink,
  Sparkles,
  Plus,
} from 'lucide-react';

export default function ListYourPropertyPage() {
  const {
    user,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    demoLoginAsOwner,
    isLoading: isAuthLoading,
  } = useAuth();

  // Auth gate state for unauthenticated owners
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFullName, setAuthFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  // Form states
  const [role, setRole] = useState<ListedByRole>('Owner');
  const [category, setCategory] = useState<PropertyCategory>('rent');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [title, setTitle] = useState('');
  const [bedrooms, setBedrooms] = useState('2 BHK');
  const [furnishing, setFurnishing] = useState('Semi-furnished');
  const [carpetArea, setCarpetArea] = useState('');
  const [locationArea, setLocationArea] = useState('');
  const [city, setCity] = useState('Gurgaon');
  const [landmark, setLandmark] = useState('');
  const [price, setPrice] = useState('');
  const [availableFrom, setAvailableFrom] = useState('Immediate');
  const [description, setDescription] = useState('');

  // Owner contact details
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');

  // Auto-sync owner info from logged-in user
  useEffect(() => {
    if (user) {
      if (user.email && !ownerEmail) {
        setOwnerEmail(user.email);
      }
      const fullName = (user.user_metadata as { full_name?: string })?.full_name;
      if (fullName && !ownerName) {
        setOwnerName(fullName);
      }
    }
  }, [user, ownerEmail, ownerName]);

  // Adjust default propertyType when category changes
  const handleCategoryChange = (cat: PropertyCategory) => {
    setCategory(cat);
    if (cat === 'commercial') {
      setPropertyType('Office');
      setBedrooms('N/A');
    } else if (cat === 'buy') {
      setPropertyType('Apartment');
      if (bedrooms === 'N/A') setBedrooms('3 BHK');
    } else {
      setPropertyType('Apartment');
      if (bedrooms === 'N/A') setBedrooms('2 BHK');
    }
  };

  // Image upload state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdProperty, setCreatedProperty] = useState<Property | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle image selection
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    setImageFiles((prev) => [...prev, ...incoming].slice(0, 15));

    const newPreviews = incoming.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews].slice(0, 15));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Quick Area Suggestions for Gurgaon & NCR
  const quickAreas = [
    'Sector 57',
    'Sector 54, Golf Course Road',
    'Sector 48, Sohna Road',
    'Sector 65, Golf Course Ext',
    'Cyber City, DLF Phase 2',
    'DLF Phase 5',
    'Sushant Lok 1',
    'Sector 85, New Gurgaon',
  ];

  // Auth Submit for Owner
  const handleOwnerAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);

    try {
      if (authMode === 'signin') {
        const { error } = await signInWithEmail(authEmail, authPassword);
        if (error) setAuthError(error.message);
      } else {
        const { error } = await signUpWithEmail(authEmail, authPassword);
        if (error) setAuthError(error.message);
      }
    } catch {
      setAuthError('Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('Please log in or sign up before submitting your property listing.');
      return;
    }

    const cleanName = ownerName.trim();
    const cleanPhone = ownerPhone.trim();
    const cleanArea = locationArea.trim();

    if (!cleanName || !cleanPhone || !cleanArea || !price) {
      setErrorMsg('Please fill in all required fields (Name, Phone, Location & Price).');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images to Supabase storage or local data URLs
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        uploadedUrls = await uploadPropertyImages(imageFiles);
      } else {
        // Smart realistic photos tailored to category
        if (category === 'commercial') {
          uploadedUrls = [
            'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&auto=format&fit=crop&q=80',
          ];
        } else if (category === 'buy') {
          uploadedUrls = [
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80',
          ];
        } else {
          uploadedUrls = [
            'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80',
          ];
        }
      }

      const numericPrice = Number(price.replace(/[^0-9]/g, '')) || 25000;
      const priceLabel =
        category === 'rent'
          ? `Rs. ${numericPrice.toLocaleString('en-IN')} / month`
          : numericPrice >= 10000000
          ? `Rs. ${(numericPrice / 10000000).toFixed(2)} Cr onwards`
          : `Rs. ${(numericPrice / 100000).toFixed(0)} Lakh onwards`;

      // Auto-generated Title if left blank
      let autoTitle = title.trim();
      if (!autoTitle) {
        if (category === 'commercial') {
          autoTitle = `${carpetArea ? carpetArea + ' Sq.Ft ' : ''}${propertyType} in ${cleanArea}`;
        } else if (propertyType === 'Plot') {
          autoTitle = `${carpetArea ? carpetArea + ' ' : ''}Residential Plot in ${cleanArea}`;
        } else {
          autoTitle = `${bedrooms !== 'N/A' ? bedrooms + ' ' : ''}${propertyType} in ${cleanArea}`;
        }
      }

      // Auto-generated description if blank
      let autoDesc = description.trim();
      if (!autoDesc) {
        if (category === 'commercial') {
          autoDesc = `Prime commercial ${propertyType.toLowerCase()} available for ${category} in ${cleanArea}, ${city}. ${
            carpetArea ? `Super area of ${carpetArea} sq.ft.` : ''
          } Ideal for offices, retail stores, or brand setups with strong footfall and convenient road connectivity.`;
        } else {
          autoDesc = `Well-maintained ${bedrooms !== 'N/A' ? bedrooms : ''} ${propertyType.toLowerCase()} in prime ${cleanArea}, ${city}. Features ${furnishing.toLowerCase()} interiors, excellent ventilation, and convenient access to local markets and transit.`;
        }
      }

      // 2. Insert into properties with status = 'pending'
      const result = await createProperty({
        title: autoTitle,
        category,
        sub_category: propertyType.toLowerCase(),
        property_type: propertyType,
        bedrooms: category === 'commercial' || propertyType === 'Plot' ? 'N/A' : bedrooms,
        furnishing: category === 'commercial' ? 'Semi-furnished' : (furnishing as Property['furnishing']),
        price: numericPrice,
        price_label: priceLabel,
        area: cleanArea,
        city: city || 'Gurgaon',
        landmark: landmark.trim() || undefined,
        available_from: availableFrom.trim() || 'Immediate',
        description: autoDesc,
        images: uploadedUrls,
        badge: 'New',
        listed_by_role: role,
        owner_name: cleanName,
        owner_phone: cleanPhone,
        owner_email: ownerEmail.trim() || user.email || undefined,
        user_id: user.id || null,
        status: 'pending',
      });

      if (result.success && result.data) {
        setCreatedProperty(result.data);
        setIsSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Failed to submit property. Please check required fields.');
      }
    } catch {
      setErrorMsg('An unexpected error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live Card Preview Data
  const previewNumericPrice = Number(price.replace(/[^0-9]/g, '')) || (category === 'rent' ? 25000 : 7500000);
  const previewPriceLabel = useMemo(() => {
    if (!price) return category === 'rent' ? 'Rs. 25,000 / month' : 'Rs. 75 Lakh';
    if (category === 'rent') return `Rs. ${previewNumericPrice.toLocaleString('en-IN')} / month`;
    if (previewNumericPrice >= 10000000) return `Rs. ${(previewNumericPrice / 10000000).toFixed(2)} Cr`;
    return `Rs. ${(previewNumericPrice / 100000).toFixed(0)} Lakh`;
  }, [price, category, previewNumericPrice]);

  const previewCoverImage =
    imagePreviews.length > 0
      ? imagePreviews[0]
      : category === 'commercial'
      ? 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80'
      : category === 'buy'
      ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80';

  const previewTitle =
    title.trim() ||
    (category === 'commercial'
      ? `${propertyType} in ${locationArea || 'Gurgaon'}`
      : `${bedrooms !== 'N/A' ? bedrooms + ' ' : ''}${propertyType} in ${locationArea || 'Gurgaon'}`);

  return (
    <div className="w-full bg-[#FAF8F5]/60 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Top Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-[#E59A38] text-xs font-black uppercase tracking-wider mb-2 border border-amber-300">
                <Sparkles size={14} />
                <span>Zero Brokerage For Owners</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">
                List your property in 2 minutes
              </h1>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Reach thousands of verified tenants and genuine buyers across Gurgaon, Delhi, and NCR.
              </p>
            </div>

            {user && (
              <div className="flex items-center gap-3 bg-white p-3 px-4 rounded-2xl border border-gray-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-[#1B2A4A] text-white flex items-center justify-center font-bold text-sm">
                  {user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block leading-tight">
                    Logged in as
                  </span>
                  <span className="text-xs font-bold text-[#1B2A4A] block truncate max-w-[170px]">
                    {user.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-[11px] text-gray-500 hover:text-red-600 font-semibold underline ml-1 cursor-pointer"
                  title="Switch to another account"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            STATE 1: AUTHENTICATION GATE (When user is NOT logged in)
            Requires Owner to Sign In or Sign Up first
        ========================================================================= */}
        {!user && !isAuthLoading && (
          <div className="max-w-4xl mx-auto my-6 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Left Side: Value Proposition for Owners */}
              <div className="md:col-span-5 bg-[#1B2A4A] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="space-y-2">
                    <Link href="/" className="inline-block hover:opacity-90 transition-opacity" title="Rent With You">
                      <Logo variant="light" height={42} />
                    </Link>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E59A38]/20 text-[#E59A38] border border-[#E59A38]/30">
                        Owner Portal
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      Login or Sign Up to List Your Property
                    </h2>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      To safeguard your contact details and give you complete control to edit, pause, or view inquiries for your property, please log in first.
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-200">
                    <li className="flex items-center gap-2.5">
                      <ShieldCheck size={16} className="text-[#E59A38] shrink-0" />
                      <span>Direct calls & WhatsApp from verified tenants</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#E59A38] shrink-0" />
                      <span>Track listing status: Pending & Live</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Zap size={16} className="text-[#E59A38] shrink-0" />
                      <span>100% Free • No middleman charges</span>
                    </li>
                  </ul>
                </div>

                {/* Instant Quick Demo Login Button for instant access */}
                <div className="pt-6 relative z-10 border-t border-white/10 mt-6">
                  <button
                    type="button"
                    onClick={demoLoginAsOwner}
                    className="w-full py-3 px-4 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <Zap size={16} />
                    <span>⚡ One-Click Demo Owner Login</span>
                  </button>
                  <span className="text-[10px] text-gray-400 block text-center mt-1.5">
                    For instant testing without entering email/password
                  </span>
                </div>
              </div>

              {/* Right Side: Tabbed Sign In / Sign Up Form */}
              <div className="md:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
                <div className="flex justify-center md:hidden mb-4">
                  <Logo variant="dark" height={40} />
                </div>

                {/* Mode Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setAuthError('');
                    }}
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition text-center cursor-pointer ${
                      authMode === 'signin'
                        ? 'border-[#E59A38] text-[#1B2A4A]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
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
                    className={`flex-1 pb-3 text-sm font-bold border-b-2 transition text-center cursor-pointer ${
                      authMode === 'signup'
                        ? 'border-[#E59A38] text-[#1B2A4A]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <form onSubmit={handleOwnerAuth} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={authFullName}
                        onChange={(e) => setAuthFullName(e.target.value)}
                        placeholder="e.g. Suresh Singhania"
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="owner@example.com"
                        className="w-full text-xs font-medium pl-9 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs font-medium pl-9 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                      <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingAuth}
                    className="w-full py-3.5 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-extrabold text-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingAuth
                      ? 'Authenticating...'
                      : authMode === 'signin'
                      ? 'Login & Unlock Listing Form'
                      : 'Sign Up & Continue'}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-500">
                  By continuing, you agree to Rent With You&apos;s{' '}
                  <Link href="/terms" className="underline hover:text-[#1B2A4A]">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy-policy" className="underline hover:text-[#1B2A4A]">
                    Privacy Policy
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 2: SUBMITTED SUCCESS SCREEN
        ========================================================================= */}
        {isSubmitted && createdProperty && (
          <div className="max-w-2xl mx-auto my-8 bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 text-center shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#1F8A5B] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={40} />
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-100 text-[#E59A38] font-bold text-xs">
              Status: Pending Verification
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] mt-3">
              Listing Submitted Successfully!
            </h2>

            <p className="text-xs text-gray-500 mt-1 font-mono">
              Property Reference ID: <b className="text-gray-900 font-bold">{createdProperty.property_code}</b>
            </p>

            <p className="text-sm text-gray-600 mt-4 leading-relaxed max-w-lg mx-auto">
              Thank you, <b>{createdProperty.owner_name}</b>. Your listing for{' '}
              <b>{createdProperty.title}</b> is currently under verification. Our team verifies listings within 2-4 hours to keep the platform free of duplicate or fake postings.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/profile"
                className="px-6 py-3.5 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <span>View in My Profile</span>
                <ExternalLink size={14} />
              </Link>

              <a
                href={getWhatsAppLink(
                  `Hi Rent With You, I have submitted property ID [${createdProperty.property_code}] - ${createdProperty.title}. Please verify and approve it.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Phone size={14} />
                <span>Expedite on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setCreatedProperty(null);
                  setTitle('');
                  setPrice('');
                  setImageFiles([]);
                  setImagePreviews([]);
                }}
                className="px-5 py-3.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
              >
                List Another Property
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STATE 3: LISTING FORM + LIVE PREVIEW (When user IS logged in)
        ========================================================================= */}
        {user && !isSubmitted && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT 7 COLS: THE HIGH-EFFICIENCY PROPERTY FORM */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Category Switcher: Rent | Buy | Commercial */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                    1. Listing Category *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCategoryChange('rent')}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        category === 'rent'
                          ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Home size={16} className={category === 'rent' ? 'text-[#E59A38]' : ''} />
                      <span>Rent Out</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCategoryChange('buy')}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        category === 'buy'
                          ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Building size={16} className={category === 'buy' ? 'text-[#E59A38]' : ''} />
                      <span>Sell / Buy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCategoryChange('commercial')}
                      className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        category === 'commercial'
                          ? 'border-[#1B2A4A] bg-[#1B2A4A] text-white shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Briefcase size={16} className={category === 'commercial' ? 'text-[#E59A38]' : ''} />
                      <span>Commercial</span>
                    </button>
                  </div>
                </div>

                {/* 2. Property Specifications */}
                <div className="pt-2 border-t border-gray-100 space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    2. Property Type & Details *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Property Type
                      </label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      >
                        {category === 'commercial' ? (
                          <>
                            <option value="Office">Office Space</option>
                            <option value="Shop">Shop / Retail Store</option>
                            <option value="Warehouse">Warehouse / Godown</option>
                          </>
                        ) : category === 'buy' ? (
                          <>
                            <option value="Apartment">Apartment / High-rise</option>
                            <option value="Independent Floor">Builder Floor</option>
                            <option value="Villa">Luxury Villa / Penthouse</option>
                            <option value="Plot">Residential Plot / Land</option>
                          </>
                        ) : (
                          <>
                            <option value="Apartment">Apartment / Flat</option>
                            <option value="Independent Floor">Builder Floor</option>
                            <option value="Studio Room">Room / Studio</option>
                            <option value="Villa">Villa / Penthouse</option>
                          </>
                        )}
                      </select>
                    </div>

                    {category !== 'commercial' && propertyType !== 'Plot' ? (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Bedrooms (BHK)
                        </label>
                        <select
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                        >
                          <option value="Studio">Studio / 1 RK</option>
                          <option value="1 BHK">1 BHK</option>
                          <option value="2 BHK">2 BHK</option>
                          <option value="3 BHK">3 BHK</option>
                          <option value="4+ BHK">4+ BHK / Penthouse</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Super Area (Sq. Ft.)
                        </label>
                        <input
                          type="text"
                          value={carpetArea}
                          onChange={(e) => setCarpetArea(e.target.value)}
                          placeholder="e.g. 1,250 Sq.Ft."
                          className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                        />
                      </div>
                    )}
                  </div>

                  {category !== 'commercial' && propertyType !== 'Plot' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Furnishing Status
                        </label>
                        <select
                          value={furnishing}
                          onChange={(e) => setFurnishing(e.target.value)}
                          className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                        >
                          <option value="Furnished">Fully Furnished</option>
                          <option value="Semi-furnished">Semi-furnished (Modular Kitchen, Wardrobes)</option>
                          <option value="Unfurnished">Unfurnished</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">
                          Available From
                        </label>
                        <input
                          type="text"
                          value={availableFrom}
                          onChange={(e) => setAvailableFrom(e.target.value)}
                          placeholder="Immediate / Specific date"
                          className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Location Details */}
                <div className="pt-2 border-t border-gray-100 space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    3. Location & Pricing *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Locality / Sector *
                      </label>
                      <input
                        type="text"
                        required
                        value={locationArea}
                        onChange={(e) => setLocationArea(e.target.value)}
                        placeholder="e.g. Sector 57, Golf Course Road"
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      >
                        <option value="Gurgaon">Gurgaon</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Noida">Noida</option>
                        <option value="Faridabad">Faridabad</option>
                        <option value="Ghaziabad">Ghaziabad</option>
                      </select>
                    </div>
                  </div>

                  {/* Quick Locality Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-semibold text-gray-400">Popular:</span>
                    {quickAreas.slice(0, 4).map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setLocationArea(area)}
                        className="px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-medium transition cursor-pointer"
                      >
                        {area}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Expected {category === 'rent' ? 'Monthly Rent' : 'Price'} (Rs.) *
                      </label>
                      <input
                        type="text"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={
                          category === 'rent'
                            ? 'e.g. 25000'
                            : 'e.g. 8500000 (85 Lakhs)'
                        }
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                      <span className="text-[11px] text-[#E59A38] font-bold mt-1 block">
                        Preview: {previewPriceLabel}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near Metro Station / Hong Kong Bazaar"
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Photos & Highlights */}
                <div className="pt-2 border-t border-gray-100 space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    4. Photos & Description
                  </label>

                  <div>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleFiles(e.dataTransfer.files);
                      }}
                      className="border-2 border-dashed border-gray-300 hover:border-[#E59A38] bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition group"
                    >
                      <Upload size={32} className="mx-auto text-[#E59A38] mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-sm font-bold text-gray-800">
                        Drag and drop photos here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Add up to 8 photos (Living room, bedroom, modular kitchen, balcony, exterior)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) => handleFiles(e.target.files)}
                      />
                    </div>

                    {/* Previews with Cover badge */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
                        {imagePreviews.map((src, i) => (
                          <div
                            key={i}
                            className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-100"
                          >
                            <Image
                              src={src}
                              alt="preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                            {i === 0 && (
                              <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#E59A38] text-white text-[9px] font-bold">
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removePhoto(i)}
                              className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 cursor-pointer shadow-xs transition"
                              title="Delete photo"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}

                        {imagePreviews.length < 15 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#E59A38] hover:bg-amber-50/30 text-gray-500 hover:text-[#E59A38] transition cursor-pointer"
                            title="Add more photos"
                          >
                            <Plus size={18} />
                            <span className="text-[10px] font-bold mt-1">Add More</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Custom Title (Optional - auto-generated if left empty)
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Spacious Sunlit 2 BHK with Modular Kitchen"
                      className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Property Description (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Mention key highlights: parking, power backup, floor, facing, proximity to metro or tech parks..."
                      className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                    />
                  </div>
                </div>

                {/* 5. Owner Contact Details */}
                <div className="pt-2 border-t border-gray-100 space-y-4">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    5. Contact Details (For Inquiries) *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Owner full name"
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+91 9911169115"
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Listing As
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as ListedByRole)}
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                      >
                        <option value="Owner">Individual Property Owner</option>
                        <option value="Dealer">Verified Dealer / Broker</option>
                        <option value="Admin">Builder / Developer Representative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Registered Email
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user.email || ownerEmail}
                        className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-extrabold text-sm sm:text-base transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting for Verification...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={20} />
                        <span>Submit Property for Review</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-gray-500 text-center mt-2">
                    Zero spam guaranteed. Your listing will be reviewed and published within 2-4 hours.
                  </p>
                </div>
              </form>
            </div>

            {/* RIGHT 5 COLS: LIVE CARD PREVIEW & OWNER BENEFITS */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
              {/* LIVE CARD PREVIEW CONTAINER */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      Live Card Preview
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    How it looks to tenants
                  </span>
                </div>

                {/* THE MOCK CARD */}
                <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-xs bg-white">
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={previewCoverImage}
                      alt={previewTitle}
                      fill
                      sizes="400px"
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold rounded-lg shadow-sm bg-[#E59A38] text-white">
                        New
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-[#1B2A4A] line-clamp-1">
                      {previewTitle}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 flex-wrap">
                      {category !== 'commercial' && propertyType !== 'Plot' && (
                        <>
                          <span>{bedrooms}</span>
                          <span className="text-gray-300">•</span>
                          <span>{furnishing}</span>
                          <span className="text-gray-300">•</span>
                        </>
                      )}
                      <span className="inline-flex items-center gap-0.5 text-gray-600 font-medium">
                        <MapPin size={12} className="text-[#E59A38] shrink-0" />
                        {locationArea || 'Sector 57, Gurgaon'}
                      </span>
                    </p>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block leading-tight">Price</span>
                        <span className="text-sm sm:text-base font-extrabold text-[#1B2A4A]">
                          {previewPriceLabel}
                        </span>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-[#1B2A4A] text-white text-xs font-bold">
                        {category === 'buy' ? 'Details' : 'View'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHY LIST WITH US (Matches Wireframe Page 8) */}
              <div className="bg-[#1B2A4A] text-white rounded-3xl p-6 sm:p-8 shadow-sm">
                <h3 className="text-lg sm:text-xl font-black text-white mb-4">
                  Why owners trust Rent With You
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-gray-200">
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                    <span><b>No repetitive WhatsApp sharing:</b> Your property gets a dedicated link with full photo gallery.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                    <span><b>Real-time Dashboard:</b> Track inquiries and manage availability in your Profile.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                    <span><b>Screened Inquiries:</b> We verify tenant requirements before connecting them.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                    <span><b>Zero Brokerage for Owners:</b> Keep 100% of your rent or sale value.</span>
                  </li>
                </ul>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-300">
                  <span>Questions or assistance?</span>
                  <a
                    href={`tel:${BRAND.phone}`}
                    className="text-[#E59A38] font-bold hover:underline"
                  >
                    {BRAND.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
