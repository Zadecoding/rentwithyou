'use client';

import React, { useState } from 'react';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import { submitEnquiry } from '@/lib/propertyStore';
import { Phone, Mail, MapPin, CheckCircle2, MessageCircle } from 'lucide-react';
import InstagramIcon from '@/components/InstagramIcon';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Rent a property');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
        message: message || `Contact Page Enquiry: Interested in ${interest}`,
      });
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappMessage = `Hi Rent With You, I would like to enquire about: ${interest}. My name is ${name || '[Name]'}.`;

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-12">
      {/* Page Title & Subtitle (Matches Wireframe Page 9) */}
      <div className="mb-10 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-black text-[#1B2A4A] tracking-tight">
          Get in touch
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Questions about a property or about listing yours? We are happy to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: Contact Cards with Amber Circular Icons (Matches Wireframe Page 9) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Phone / WhatsApp */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200/80 flex items-center gap-4 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Phone size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">
                Phone / WhatsApp
              </span>
              <a
                href={`tel:${BRAND.phone}`}
                className="text-base sm:text-lg font-black text-[#1B2A4A] hover:text-[#E59A38] transition"
              >
                {BRAND.phone}
              </a>
            </div>
          </div>

          {/* Card 2: Email */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200/80 flex items-center gap-4 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">
                Email
              </span>
              <a
                href={`mailto:${BRAND.email}`}
                className="text-sm sm:text-base font-bold text-[#1B2A4A] hover:text-[#E59A38] transition break-all"
              >
                {BRAND.email}
              </a>
            </div>
          </div>

          {/* Card 3: Instagram */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200/80 flex items-center gap-4 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center shrink-0 shadow-xs">
              <InstagramIcon size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">
                Instagram
              </span>
              <a
                href={BRAND.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-bold text-[#1B2A4A] hover:text-[#E59A38] transition"
              >
                {BRAND.instagram}
              </a>
            </div>
          </div>

          {/* Card 4: Office */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200/80 flex items-start gap-4 hover:shadow-sm transition">
            <div className="w-12 h-12 rounded-full bg-[#E59A38] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <MapPin size={20} />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-500 block">
                Office
              </span>
              <span className="text-sm font-bold text-[#1B2A4A] leading-relaxed block">
                {BRAND.address}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: "Send us an enquiry" Form (Matches Wireframe Page 9) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm">
          <h2 className="text-xl sm:text-2xl font-black text-[#1B2A4A] mb-6">
            Send us an enquiry
          </h2>

          {isSuccess ? (
            <div className="py-8 text-center">
              <CheckCircle2 size={52} className="text-[#1F8A5B] mx-auto mb-3" />
              <h3 className="text-xl font-black text-[#1B2A4A]">Enquiry Sent!</h3>
              <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
                Thank you, <b>{name}</b>. We have received your enquiry and our team will get back to you shortly.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1F8A5B] hover:bg-[#186f49] text-white font-medium text-xs transition"
                >
                  <MessageCircle size={16} />
                  <span>Send direct message on WhatsApp</span>
                </a>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition"
                >
                  Send Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    Your name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1.5">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9911169115"
                    className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  I am interested in...
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                >
                  <option value="Rent a property">Renting a home / flat</option>
                  <option value="Buy a home">Buying a property / plot</option>
                  <option value="Commercial property">Commercial shop / office</option>
                  <option value="List my property">Listing my property</option>
                  <option value="Packers & Movers">Packers & Movers service</option>
                  <option value="Furniture rental / buy">Furniture solutions</option>
                  <option value="Other general enquiry">Other general enquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-800 mb-1.5">
                  Your message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you? Feel free to mention budget, preferred sectors or move-in timeline..."
                  className="w-full text-xs font-medium px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-extrabold text-sm transition shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
