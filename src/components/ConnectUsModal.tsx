'use client';

import React, { useState } from 'react';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import { submitEnquiry } from '@/lib/propertyStore';
import { Phone, MessageCircle, Mail, MapPin, X, CheckCircle2 } from 'lucide-react';

interface ConnectUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConnectUsModal({ isOpen, onClose }: ConnectUsModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Rent a home');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);

    try {
      await submitEnquiry({
        enquiry_type: 'general',
        name,
        phone,
        interest,
        message: message || `Enquiry for: ${interest}`,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setName('');
        setPhone('');
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hi Rent With You, I would like to get in touch regarding real estate services in Gurgaon.`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
            <div className="w-10 h-10 rounded-xl bg-[#E59A38] text-white font-bold flex items-center justify-center text-xl shadow-md">
              R
            </div>
            <div>
              <h3 className="text-xl font-bold">Connect With Rent With You</h3>
              <p className="text-xs text-amber-200/90">We are here to help you find the right place</p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-6 bg-[#FAF8F5] border-b border-gray-200/60">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${BRAND.phone}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1B2A4A] text-white font-medium text-sm hover:bg-[#142038] transition shadow-xs"
            >
              <Phone size={16} className="text-[#E59A38]" />
              <span>Call Now</span>
            </a>
            <a
              href={getWhatsAppLink(whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1F8A5B] text-white font-medium text-sm hover:bg-[#186f49] transition shadow-xs"
            >
              <MessageCircle size={16} />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200/60 flex flex-col gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#E59A38]" />
              <a href={`mailto:${BRAND.email}`} className="hover:underline">
                {BRAND.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#E59A38]" />
              <span>{BRAND.address}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8">
              <CheckCircle2 size={48} className="text-[#1F8A5B] mx-auto mb-3" />
              <h4 className="text-lg font-bold text-gray-900">Thank you!</h4>
              <p className="text-sm text-gray-600 mt-1">Our property advisor will call you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm">Or send us a quick enquiry:</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <label className="block text-xs font-medium text-gray-700 mb-1">I am interested in</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38] bg-white"
                >
                  <option value="Rent a home">Renting a home / flat</option>
                  <option value="Buy a home">Buying a home / new project</option>
                  <option value="Commercial space">Commercial Shop or Office</option>
                  <option value="List my property">Listing my property for rent/sale</option>
                  <option value="Packers and Movers">Packers & Movers</option>
                  <option value="Furniture">Furniture rental / purchase</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Message (Optional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what kind of property you are looking for..."
                  className="w-full text-sm px-3.5 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-semibold text-sm transition shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
