'use client';

import React, { useState } from 'react';
import { getWhatsAppLink } from '@/lib/constants';
import { submitEnquiry } from '@/lib/propertyStore';
import { Armchair, MessageCircle, X, CheckCircle2, Check } from 'lucide-react';

interface FurnitureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FurnitureModal({ isOpen, onClose }: FurnitureModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<'rent' | 'buy'>('rent');
  const [selectedPackage, setSelectedPackage] = useState('Full 2 BHK Furniture Package');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const packages = [
    {
      id: 'full_home',
      name: 'Full Home Package (1/2/3 BHK)',
      desc: 'Beds, wardrobes, sofa, dining table, fridge & appliances',
      price: 'From Rs. 3,499 / mo',
    },
    {
      id: 'bedroom',
      name: 'Master Bedroom Set',
      desc: 'King size bed, Ortho mattress, bedside tables, 3-door wardrobe',
      price: 'From Rs. 1,499 / mo',
    },
    {
      id: 'living',
      name: 'Living Room Essentials',
      desc: 'L-shape sofa, coffee table, TV console unit, floor rug',
      price: 'From Rs. 1,899 / mo',
    },
    {
      id: 'wfh',
      name: 'Work-From-Home Combo',
      desc: 'Ergonomic mesh chair, motorized standing desk, bookshelf',
      price: 'From Rs. 899 / mo',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);

    try {
      await submitEnquiry({
        enquiry_type: 'furniture',
        name,
        phone,
        interest: `${type === 'rent' ? 'Rental' : 'Purchase'}: ${selectedPackage}`,
        message: `Furniture Requirement (${type.toUpperCase()}): ${selectedPackage}. Custom details: ${notes || 'None'}`,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hi Rent With You, I am interested in ${type === 'rent' ? 'renting' : 'buying'} furniture (${selectedPackage}). Name: ${name || '[Name]'}. Please share catalog and prices!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1B2A4A] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E59A38] text-white flex items-center justify-center shadow-md">
              <Armchair size={24} />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#E59A38] uppercase tracking-wider">
                Home Furniture Solutions
              </span>
              <h3 className="text-xl font-bold mt-1">Buy or Rent Furniture</h3>
              <p className="text-xs text-gray-300">
                Premium designer furniture delivered & installed at your doorstep
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 size={52} className="text-[#1F8A5B] mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-900">Request Received!</h4>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                Thank you, <b>{name}</b>! Our furniture advisor will contact you at <b>{phone}</b> with the detailed brochure and discounted catalog.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-medium text-sm transition shadow-sm"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Rent vs Buy toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('rent')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                    type === 'rent'
                      ? 'bg-white text-[#1B2A4A] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Rent Furniture (Monthly)
                </button>
                <button
                  type="button"
                  onClick={() => setType('buy')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
                    type === 'buy'
                      ? 'bg-white text-[#1B2A4A] shadow-xs'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Buy Brand New Furniture
                </button>
              </div>

              {/* Package choices */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Select Package of Interest:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage === pkg.name;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg.name)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#E59A38] bg-[#FAF8F5] ring-2 ring-[#E59A38]/30'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-gray-900">{pkg.name}</span>
                            {isSelected && <Check size={14} className="text-[#E59A38]" />}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug">{pkg.desc}</p>
                        </div>
                        <span className="text-xs font-bold text-[#E59A38] mt-2 block">
                          {pkg.price}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9911169115"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Custom Requirements / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need 4-seater dining table and 1 extra recliner"
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Requesting...' : 'Request Brochure & Quote'}
                </button>
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-semibold text-sm transition shadow-sm"
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
