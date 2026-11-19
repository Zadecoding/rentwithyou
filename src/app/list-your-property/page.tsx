'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { createProperty, uploadPropertyImages } from '@/lib/propertyStore';
import { PropertyCategory, ListedByRole, PropertyType } from '@/types';
import {
  Upload,
  CheckCircle2,
  X,
  Building,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export default function ListYourPropertyPage() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ListedByRole>('Owner');
  const [category, setCategory] = useState<PropertyCategory>('rent');
  const [propertyType, setPropertyType] = useState<PropertyType>('Apartment');
  const [title, setTitle] = useState('');
  const [bedrooms, setBedrooms] = useState('2 BHK');
  const [furnishing, setFurnishing] = useState('Semi-furnished');
  const [locationArea, setLocationArea] = useState('');
  const [city, setCity] = useState('Gurgaon');
  const [landmark, setLandmark] = useState('');
  const [price, setPrice] = useState('');
  const [availableFrom, setAvailableFrom] = useState('Immediate');
  const [description, setDescription] = useState('');

  // Image upload state
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle image selection
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 8); // max 8
    setImageFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !phone || !locationArea || !price) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload images to Supabase storage (or generate preview URLs)
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        uploadedUrls = await uploadPropertyImages(imageFiles);
      } else {
        // Fallback realistic placeholder if user did not provide photos
        uploadedUrls = [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
        ];
      }

      const numericPrice = Number(price.replace(/[^0-9]/g, '')) || 25000;
      const priceLabel =
        category === 'rent'
          ? `Rs. ${numericPrice.toLocaleString('en-IN')} / month`
          : numericPrice >= 10000000
          ? `Rs. ${(numericPrice / 10000000).toFixed(2)} Cr onwards`
          : `Rs. ${(numericPrice / 100000).toFixed(0)} Lakh onwards`;

      const autoTitle =
        title.trim() ||
        `${bedrooms !== 'N/A' ? bedrooms : ''} ${propertyType} in ${locationArea}`;

      // 2. Insert into properties with status = 'pending'
      const result = await createProperty({
        title: autoTitle,
        category,
        sub_category: propertyType.toLowerCase(),
        property_type: propertyType,
        bedrooms,
        furnishing: furnishing as any,
        price: numericPrice,
        price_label: priceLabel,
        area: locationArea,
        city: city || 'Gurgaon',
        landmark: landmark || undefined,
        available_from: availableFrom || 'Immediate',
        description:
          description ||
          `Well-maintained ${bedrooms} ${propertyType} located in prime ${locationArea}. Features excellent ventilation, connectivity to metro, and nearby shopping centers.`,
        images: uploadedUrls,
        badge: 'New',
        listed_by_role: role,
        owner_name: name,
        owner_phone: phone,
        owner_email: email || user?.email || undefined,
        user_id: user?.id || null,
        status: 'pending', // Pending review
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Failed to submit property.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('An error occurred during submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Title (Matches Wireframe Page 8) */}
      <div className="mb-8 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">
          List your property in 2 minutes
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Fill in the details and upload photos. We review it and publish it on the website.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-[#FAF8F5] border border-gray-200 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-[#1B2A4A]">Thank You!</h2>
          <p className="text-sm text-gray-700 mt-3 leading-relaxed">
            Your property has been submitted successfully and is currently{' '}
            <b className="text-amber-700">Pending Admin Approval</b>. Once verified by our verification team, it will go live on Rent With You.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/profile"
              className="px-6 py-3 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs"
            >
              View in My Profile
            </Link>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setImageFiles([]);
                setImagePreviews([]);
                setTitle('');
              }}
              className="px-6 py-3 rounded-xl bg-gray-200 text-gray-800 font-bold text-xs hover:bg-gray-300"
            >
              List Another Property
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: LISTING FORM (Matches Wireframe Page 8) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs">
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Your Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Your name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="[Full name]"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="[Number] e.g. +91 9911169115"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
              </div>

              {/* Row 2: I am a & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    I am a *
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as ListedByRole)}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Dealer">Dealer / Broker</option>
                    <option value="Admin">Developer / Builder</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Listing For *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  >
                    <option value="rent">Rent (Rental)</option>
                    <option value="buy">Buy (Sale / Resale / Project)</option>
                    <option value="commercial">Commercial (Shop / Office)</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Property Type & Bedrooms */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Property type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  >
                    <option value="Apartment">Flat / Apartment</option>
                    <option value="Independent Floor">House / Builder Floor</option>
                    <option value="Studio Room">Room / Studio</option>
                    <option value="Villa">Villa / Penthouse</option>
                    <option value="Plot">Residential Plot</option>
                    <option value="Shop">Shop / Retail</option>
                    <option value="Office">Office Space</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Bedrooms & Furnishing
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                    >
                      <option value="Studio">Studio</option>
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4+ BHK">4+ BHK</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <select
                      value={furnishing}
                      onChange={(e) => setFurnishing(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                    >
                      <option value="Furnished">Furnished</option>
                      <option value="Semi-furnished">Semi-furnished</option>
                      <option value="Unfurnished">Unfurnished</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 4: Location & Expected rent/price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={locationArea}
                    onChange={(e) => setLocationArea(e.target.value)}
                    placeholder="[Area, City] e.g. Sector 57, Gurgaon"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Expected {category === 'rent' ? 'rent' : 'price'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder={
                      category === 'rent'
                        ? 'Rs. [Amount] / month'
                        : 'Rs. [Amount] e.g. 4500000'
                    }
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
              </div>

              {/* Row 5: Available from & Landmark */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Available from
                  </label>
                  <input
                    type="text"
                    value={availableFrom}
                    onChange={(e) => setAvailableFrom(e.target.value)}
                    placeholder="Immediate / Date"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Metro Station / Market"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
              </div>

              {/* Short description */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Short description (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your property highlights (balconies, facing, parking, power backup)..."
                  className="w-full text-xs font-medium px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
              </div>

              {/* Drag and drop photo uploader (Matches Wireframe Page 8) */}
              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1">
                  Property Photos
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-gray-300 hover:border-[#E59A38] bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition"
                >
                  <Upload size={32} className="mx-auto text-[#E59A38] mb-2" />
                  <p className="text-sm font-bold text-gray-800">
                    Drag and drop photos here
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    or click to upload (JPG, PNG, WEBP)
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

                {/* Photo Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-3">
                    {imagePreviews.map((src, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                      >
                        <Image
                          src={src}
                          alt="preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Property Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-extrabold text-sm sm:text-base transition shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting Property...' : 'Submit property'}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: "Why list with us?" CARD (Matches Wireframe Page 8) */}
          <div className="lg:col-span-5 bg-[#1B2A4A] text-white rounded-3xl p-8 sm:p-10 shadow-lg">
            <h2 className="text-2xl font-black text-white mb-6">Why list with us?</h2>

            <ul className="space-y-4 text-xs sm:text-sm text-gray-200">
              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                <span>No more sending photos on WhatsApp</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                <span>Your property gets its own page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                <span>Reaches tenants searching every day</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                <span>We contact you when someone enquires</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E59A38] shrink-0 mt-1.5" />
                <span>Edit or remove your listing anytime</span>
              </li>
            </ul>

            <div className="mt-10 p-5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300">
              <span className="font-bold text-[#E59A38] block mb-1">
                Zero Brokerage for Owners
              </span>
              <p>
                List your residential or commercial property directly. We verify every enquiry before connecting prospective tenants and buyers to you.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
