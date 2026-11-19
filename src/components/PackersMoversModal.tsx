'use client';

import React, { useState } from 'react';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import { submitEnquiry } from '@/lib/propertyStore';
import { Truck, MessageCircle, X, CheckCircle2, Calendar, MapPin, Home } from 'lucide-react';

interface PackersMoversModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PackersMoversModal({ isOpen, onClose }: PackersMoversModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [householdSize, setHouseholdSize] = useState('2 BHK');
  const [itemsDesc, setItemsDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !pickupLocation || !dropLocation) return;
    setIsSubmitting(true);

    try {
      await submitEnquiry({
        enquiry_type: 'packers_movers',
        name,
        phone,
        pickup_location: pickupLocation,
        drop_location: dropLocation,
        move_date: moveDate || 'Flexible',
        household_size: householdSize,
        message: `Packers & Movers Quote Request: ${householdSize} from ${pickupLocation} to ${dropLocation}. Date: ${moveDate || 'Flexible'}. Items: ${itemsDesc || 'Standard household items'}`,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hi Rent With You, I need Packers & Movers for my ${householdSize} move from ${pickupLocation || '[Pickup]'} to ${dropLocation || '[Drop]'}. Name: ${name || '[Name]'}. Please share an instant quote!`;

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
              <Truck size={24} />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-[#E59A38] uppercase tracking-wider">
                Door-to-Door Moving Service
              </span>
              <h3 className="text-xl font-bold mt-1">Get Packers & Movers Quote</h3>
              <p className="text-xs text-gray-300">
                Safe, verified, zero-damage shifting across Gurgaon, Delhi & NCR
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 size={52} className="text-[#1F8A5B] mx-auto mb-3" />
              <h4 className="text-xl font-bold text-gray-900">Quote Request Received!</h4>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                Thank you, <b>{name}</b>. Our relocation coordinator will call you shortly at <b>{phone}</b> with the most competitive price quote.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-medium text-sm transition shadow-sm"
                >
                  <MessageCircle size={18} />
                  <span>Send Quote Request on WhatsApp</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#E59A38]" />
                    Pickup City & Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder="e.g. Sector 54, Gurgaon"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <MapPin size={12} className="text-[#1F8A5B]" />
                    Drop City & Locality *
                  </label>
                  <input
                    type="text"
                    required
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    placeholder="e.g. Sector 65, Gurgaon"
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Home size={12} className="text-gray-500" />
                    Property / Household Size *
                  </label>
                  <select
                    value={householdSize}
                    onChange={(e) => setHouseholdSize(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38] bg-white"
                  >
                    <option value="1 RK / Single Room">1 RK / Single Room</option>
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4+ BHK / Villa">4+ BHK / Villa</option>
                    <option value="Commercial / Office">Commercial / Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Calendar size={12} className="text-gray-500" />
                    Shifting Date
                  </label>
                  <input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Major Items Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={itemsDesc}
                  onChange={(e) => setItemsDesc(e.target.value)}
                  placeholder="e.g. Double bed, fridge, washing machine, sofa set, 10-15 boxes..."
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                </button>
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-semibold text-sm transition shadow-sm"
                >
                  <MessageCircle size={16} />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
