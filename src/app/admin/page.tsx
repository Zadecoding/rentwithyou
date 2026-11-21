'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { BRAND, getWhatsAppLink } from '@/lib/constants';
import {
  fetchAllPropertiesForAdmin,
  updatePropertyStatus,
  updateProperty,
  deleteProperty,
  createProperty,
  fetchEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
  getVisitorCount,
  uploadPropertyImages,
} from '@/lib/propertyStore';
import { Property, Enquiry, PropertyCategory, PropertyType, PropertyBadge, PropertyStatus } from '@/types';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  Phone,
  MessageCircle,
  Plus,
  Search,
  X,
  Upload,
  Inbox,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isAdmin, demoLoginAsAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'enquiries'>('pending');
  const [properties, setProperties] = useState<Property[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [visitorCount, setVisitorCount] = useState<number>(BRAND.defaultVisitorCount);

  // Search & Filter in Admin All Properties
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Add Property Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PropertyCategory>('rent');
  const [newType, setNewType] = useState<PropertyType>('Apartment');
  const [newBedrooms, setNewBedrooms] = useState('2 BHK');
  const [newFurnishing, setNewFurnishing] = useState('Semi-furnished');
  const [newPrice, setNewPrice] = useState('');
  const [newArea, setNewArea] = useState('');
  const [newOwnerName] = useState('Rent With You Admin');
  const [newOwnerPhone] = useState(BRAND.phone);
  const [newBadge, setNewBadge] = useState<PropertyBadge>('Verified');
  const [newDescription, setNewDescription] = useState('');
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit Property Modal State
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editImageFiles, setEditImageFiles] = useState<File[]>([]);
  const [editImagePreviews, setEditImagePreviews] = useState<string[]>([]);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const [allProps, allEnqs, count] = await Promise.all([
        fetchAllPropertiesForAdmin(),
        fetchEnquiries(),
        getVisitorCount(),
      ]);
      if (isMounted) {
        setProperties(allProps);
        setEnquiries(allEnqs);
        setVisitorCount(count);
      }
    };
    void load();
    return () => {
      isMounted = false;
    };
  }, [isAdmin]);

  // If unauthorized, show restricted access gate
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-[#E59A38] border border-amber-300 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={36} />
        </div>
        <h1 className="text-2xl font-black text-[#1B2A4A]">Admin Access Restricted</h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
          This panel is strictly restricted to administrator accounts ({BRAND.adminEmails.join(', ')}).
        </p>

        <div className="mt-6 bg-[#FAF8F5] p-5 rounded-2xl border border-gray-200 text-left">
          <span className="text-xs font-bold text-gray-700 block mb-1">Testing or Reviewing?</span>
          <p className="text-xs text-gray-500 mb-3">
            Click below to instantly activate demo admin privileges for testing the complete approval workflow and property manager:
          </p>
          <button
            onClick={() => demoLoginAsAdmin()}
            className="w-full py-2.5 px-4 rounded-xl bg-[#E59A38] hover:bg-[#d68b2a] text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} />
            <span>Switch to Demo Admin</span>
          </button>
        </div>

        <Link
          href="/"
          className="mt-6 inline-block text-xs font-bold text-gray-500 hover:text-[#1B2A4A]"
        >
          &larr; Return to Homepage
        </Link>
      </div>
    );
  }

  // Handle Approve / Reject
  const handleApprove = async (id: string) => {
    await updatePropertyStatus(id, 'approved');
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved' } : p))
    );
  };

  const handleReject = async (id: string) => {
    await updatePropertyStatus(id, 'rejected');
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
  };

  const handleDelete = async (id: string, code?: string) => {
    if (confirm('Are you sure you want to delete this property? This cannot be undone.')) {
      const ok = await deleteProperty(id);
      if (ok) {
        setProperties((prev) =>
          prev.filter((p) => p.id !== id && (!code || p.property_code !== code))
        );
      } else {
        alert('Could not delete property. Please try again.');
      }
    }
  };

  const handleUpdateStatus = async (enquiryId: string, status: 'new' | 'contacted' | 'closed') => {
    await updateEnquiryStatus(enquiryId, status);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status } : e))
    );
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    if (confirm('Are you sure you want to delete this enquiry?')) {
      const ok = await deleteEnquiry(enquiryId);
      if (ok) {
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
      } else {
        alert('Could not delete enquiry lead.');
      }
    }
  };

  // Photo handlers for Add Property Modal
  const handleAddModalFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    setNewImageFiles((prev) => [...prev, ...incoming].slice(0, 15));
    const previews = incoming.map((f) => URL.createObjectURL(f));
    setNewImagePreviews((prev) => [...prev, ...previews].slice(0, 15));
    if (addFileInputRef.current) addFileInputRef.current.value = '';
  };

  const removeAddModalPhoto = (index: number) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Photo handlers for Edit Property Modal
  const openEditModal = (prop: Property) => {
    setEditingProperty({ ...prop, images: prop.images || [] });
    setEditImageFiles([]);
    setEditImagePreviews([]);
  };

  const handleEditModalFiles = (files: FileList | null) => {
    if (!files) return;
    const incoming = Array.from(files);
    setEditImageFiles((prev) => [...prev, ...incoming].slice(0, 15));
    const previews = incoming.map((f) => URL.createObjectURL(f));
    setEditImagePreviews((prev) => [...prev, ...previews].slice(0, 15));
    if (editFileInputRef.current) editFileInputRef.current.value = '';
  };

  const removeExistingEditPhoto = (index: number) => {
    if (!editingProperty) return;
    const updatedImages = (editingProperty.images || []).filter((_, i) => i !== index);
    setEditingProperty({ ...editingProperty, images: updatedImages });
  };

  const removeNewEditPhoto = (index: number) => {
    setEditImageFiles((prev) => prev.filter((_, i) => i !== index));
    setEditImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add new property as admin
  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice || !newArea) return;
    setIsCreating(true);

    try {
      let uploadedUrls: string[] = [];
      if (newImageFiles.length > 0) {
        uploadedUrls = await uploadPropertyImages(newImageFiles);
      } else {
        uploadedUrls = [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
        ];
      }

      const numericPrice = Number(newPrice.replace(/[^0-9]/g, '')) || 25000;
      const priceLabel =
        newCategory === 'rent'
          ? `Rs. ${numericPrice.toLocaleString('en-IN')} / month`
          : numericPrice >= 10000000
          ? `Rs. ${(numericPrice / 10000000).toFixed(2)} Cr onwards`
          : `Rs. ${(numericPrice / 100000).toFixed(0)} Lakh onwards`;

      const res = await createProperty({
        title: newTitle,
        category: newCategory,
        sub_category: newType.toLowerCase(),
        property_type: newType,
        bedrooms: newBedrooms,
        furnishing: newFurnishing as Property['furnishing'],
        price: numericPrice,
        price_label: priceLabel,
        area: newArea,
        city: 'Gurgaon',
        available_from: 'Immediate',
        description: newDescription || `Premium ${newTitle} located in ${newArea}, Gurgaon.`,
        images: uploadedUrls,
        badge: newBadge,
        listed_by_role: 'Admin',
        owner_name: newOwnerName,
        owner_phone: newOwnerPhone,
        owner_email: BRAND.email,
        status: 'approved',
      });

      if (res.success && res.data) {
        setProperties((prev) => [res.data!, ...prev]);
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewPrice('');
        setNewArea('');
        setNewImageFiles([]);
        setNewImagePreviews([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  // Save Edit Property
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;
    setIsUpdating(true);

    try {
      let finalImages = [...(editingProperty.images || [])];
      if (editImageFiles.length > 0) {
        const newlyUploaded = await uploadPropertyImages(editImageFiles);
        finalImages = [...finalImages, ...newlyUploaded];
      }

      const updatedProp = { ...editingProperty, images: finalImages };
      await updateProperty(editingProperty.id, updatedProp);
      setProperties((prev) =>
        prev.map((p) => (p.id === editingProperty.id ? updatedProp : p))
      );
      setEditingProperty(null);
      setEditImageFiles([]);
      setEditImagePreviews([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Counts
  const pendingProperties = properties.filter((p) => p.status === 'pending');
  const approvedProperties = properties.filter((p) => p.status === 'approved');

  // Filtered in "All Properties"
  const filteredAllProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.property_code.includes(searchTerm) ||
      p.owner_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#E59A38] text-white text-[11px] font-black uppercase tracking-wider">
              Super Admin
            </span>
            <span className="text-xs text-gray-500 font-mono">{user?.email}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1B2A4A] mt-1">
            Rent With You Admin Panel
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs shadow-md transition"
        >
          <Plus size={16} className="text-[#E59A38]" />
          <span>Add Property Directly</span>
        </button>
      </div>

      {/* 1. OVERVIEW STATS (5 Key Metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-gray-200">
          <span className="text-[11px] font-bold text-gray-500 uppercase">Total Properties</span>
          <span className="text-2xl sm:text-3xl font-black text-[#1B2A4A] block mt-1">
            {properties.length}
          </span>
        </div>

        <div className="bg-amber-50 p-4 sm:p-5 rounded-2xl border border-amber-200">
          <span className="text-[11px] font-bold text-[#E59A38] uppercase">Pending Review</span>
          <span className="text-2xl sm:text-3xl font-black text-[#E59A38] block mt-1">
            {pendingProperties.length}
          </span>
        </div>

        <div className="bg-emerald-50 p-4 sm:p-5 rounded-2xl border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 uppercase">Live Approved</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 block mt-1">
            {approvedProperties.length}
          </span>
        </div>

        <div className="bg-blue-50 p-4 sm:p-5 rounded-2xl border border-blue-200">
          <span className="text-[11px] font-bold text-blue-800 uppercase">Total Enquiries</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-700 block mt-1">
            {enquiries.length}
          </span>
        </div>

        <div className="bg-gray-100 p-4 sm:p-5 rounded-2xl border border-gray-200 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-gray-600 uppercase">Total Visitors</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-gray-900 block mt-1">
            {visitorCount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Tabs: Pending Queue | All Properties | Enquiries */}
      <div className="flex border-b border-gray-200 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'pending'
              ? 'text-[#1B2A4A]'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Pending Approvals</span>
          {pendingProperties.length > 0 && (
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#E59A38] text-white">
              {pendingProperties.length}
            </span>
          )}
          {activeTab === 'pending' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E59A38]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'all'
              ? 'text-[#1B2A4A]'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>All Properties ({properties.length})</span>
          {activeTab === 'all' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E59A38]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 transition relative flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'text-[#1B2A4A]'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <span>Enquiries & Leads ({enquiries.length})</span>
          {activeTab === 'enquiries' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E59A38]" />
          )}
        </button>
      </div>

      {/* TAB 1: PENDING APPROVAL WORKFLOW */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          {pendingProperties.length === 0 ? (
            <div className="text-center py-12 bg-[#FAF8F5] rounded-3xl border border-gray-200 p-8">
              <CheckCircle2 size={40} className="mx-auto text-emerald-600 mb-2" />
              <h3 className="text-base font-bold text-gray-800">All submissions verified</h3>
              <p className="text-xs text-gray-500 mt-1">
                There are no pending owner or dealer submissions in the review queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingProperties.map((prop) => {
                const ownerWhatsapp = getWhatsAppLink(
                  `Hi ${prop.owner_name}, this is Rent With You verification desk regarding your listing: ${prop.title}.`
                );
                return (
                  <div
                    key={prop.id}
                    className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 mb-1">
                          Awaiting Approval • ID: {prop.property_code}
                        </span>
                        <h3 className="text-base font-extrabold text-[#1B2A4A]">
                          {prop.title}
                        </h3>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {prop.bedrooms} • {prop.furnishing} • {prop.area}
                        </p>
                      </div>
                      <span className="text-base font-black text-[#1B2A4A]">
                        {prop.price_label}
                      </span>
                    </div>

                    {/* Image thumbnails */}
                    {prop.images && prop.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {prop.images.map((img, i) => (
                          <div
                            key={i}
                            className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-200"
                          >
                            <Image
                              src={img}
                              alt="listing photo"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl line-clamp-3">
                      {prop.description}
                    </p>

                    {/* Owner Contact Line */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                      <div>
                        <span>Owner: <b>{prop.owner_name}</b> ({prop.listed_by_role})</span>
                        <span className="block text-gray-500">{prop.owner_phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${prop.owner_phone}`}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
                          title="Call owner"
                        >
                          <Phone size={14} />
                        </a>
                        <a
                          href={ownerWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700"
                          title="WhatsApp owner"
                        >
                          <MessageCircle size={14} />
                        </a>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(prop.id)}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <CheckCircle2 size={16} />
                        <span>Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => openEditModal(prop)}
                        className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition cursor-pointer"
                        title="Edit details before publishing"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleReject(prop.id)}
                        className="py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition"
                        title="Reject submission"
                      >
                        <XCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(prop.id, prop.property_code)}
                        className="py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-700 font-bold text-xs transition cursor-pointer"
                        title="Delete submission permanently"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ALL LISTED PROPERTIES MANAGER */}
      {activeTab === 'all' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Title, Code, Area, or Owner..."
                className="w-full text-xs font-medium pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#E59A38]"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="rent">Rent</option>
              <option value="buy">Buy</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Property</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Area</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Badge</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Owner Contact</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAllProperties.map((prop) => (
                    <tr key={prop.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {prop.property_code}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#1B2A4A] max-w-xs">
                        <Link
                          href={`/property/${prop.property_code || prop.id}`}
                          className="hover:text-[#E59A38] transition"
                        >
                          {prop.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold text-gray-700">
                        {prop.category}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">{prop.area}</td>
                      <td className="py-3.5 px-4 font-bold text-[#1B2A4A]">
                        {prop.price_label}
                      </td>
                      <td className="py-3.5 px-4">
                        {prop.badge ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                            {prop.badge}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            prop.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : prop.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        <div>{prop.owner_name}</div>
                        <div className="text-[10px] text-gray-400">{prop.owner_phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(prop)}
                          className="p-1.5 rounded-lg text-gray-600 hover:text-[#1B2A4A] hover:bg-gray-100 cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(prop.id, prop.property_code)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ENQUIRIES & PACKERS/MOVERS LEADS */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] text-gray-400 flex items-center justify-center mx-auto mb-3">
                <Inbox size={24} />
              </div>
              <h3 className="text-base font-extrabold text-[#1B2A4A]">No Enquiries Yet</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
                Customer enquiries and leads submitted via Contact, Furniture Rental, and Packers &amp; Movers will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enquiries.map((enq) => {
                const replyWhatsapp = getWhatsAppLink(
                  `Hi ${enq.name}, Rent With You received your enquiry regarding: ${enq.interest || enq.enquiry_type}. How can we assist you today?`
                );
                return (
                  <div
                    key={enq.id}
                    className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {enq.enquiry_type.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            enq.status === 'closed'
                              ? 'bg-gray-100 text-gray-600'
                              : enq.status === 'contacted'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#1B2A4A] mt-2">
                        {enq.name}
                      </h3>
                      <p className="text-xs text-gray-500">{enq.phone}</p>
                      {enq.email && <p className="text-xs text-gray-500">{enq.email}</p>}

                      {/* Specific details */}
                      {enq.pickup_location && (
                        <div className="mt-2 text-xs text-gray-700 bg-[#FAF8F5] p-2.5 rounded-xl border border-gray-200/60">
                          <div><b>Pickup:</b> {enq.pickup_location}</div>
                          <div><b>Drop:</b> {enq.drop_location}</div>
                          {enq.household_size && <div><b>Size:</b> {enq.household_size}</div>}
                          {enq.move_date && <div><b>Date:</b> {enq.move_date}</div>}
                        </div>
                      )}

                      <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2.5 rounded-xl">
                        {enq.message}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <select
                        value={enq.status}
                        onChange={(e) =>
                          handleUpdateStatus(enq.id!, e.target.value as 'new' | 'contacted' | 'closed')
                        }
                        className="text-[11px] font-bold rounded-lg border border-gray-200 px-2 py-1.5 bg-white cursor-pointer"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <a
                          href={`tel:${enq.phone}`}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800"
                          title="Call"
                        >
                          <Phone size={14} />
                        </a>
                        <a
                          href={replyWhatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#1F8A5B] text-white text-xs font-bold hover:bg-[#186f49] flex items-center gap-1"
                        >
                          <MessageCircle size={14} />
                          <span>Reply</span>
                        </a>
                        <button
                          onClick={() => handleDeleteEnquiry(enq.id!)}
                          className="p-2 rounded-lg bg-gray-100 hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition cursor-pointer"
                          title="Delete enquiry lead"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD PROPERTY DIRECTLY AS ADMIN */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-[#1B2A4A] mb-4">
              Add New Property (Admin Live)
            </h2>

            <form onSubmit={handleCreateProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 2 BHK Luxury Flat in DLF Phase 5"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as PropertyCategory)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="rent">Rent</option>
                    <option value="buy">Buy</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PropertyType)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Independent Floor">Independent Floor</option>
                    <option value="Studio Room">Studio Room</option>
                    <option value="Villa">Villa</option>
                    <option value="Plot">Plot</option>
                    <option value="Shop">Shop</option>
                    <option value="Office">Office</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                  <select
                    value={newBadge || ''}
                    onChange={(e) => setNewBadge((e.target.value as PropertyBadge) || null)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Verified">Verified</option>
                    <option value="New">New</option>
                    <option value="New launch">New launch</option>
                    <option value="Ready">Ready</option>
                    <option value="Premium">Premium</option>
                    <option value="Plots">Plots</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="text"
                    value={newBedrooms}
                    onChange={(e) => setNewBedrooms(e.target.value)}
                    placeholder="2 BHK"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Furnishing</label>
                  <input
                    type="text"
                    value={newFurnishing}
                    onChange={(e) => setNewFurnishing(e.target.value)}
                    placeholder="Semi-furnished"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location Area *</label>
                  <input
                    type="text"
                    required
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    placeholder="Sector 57, Gurgaon"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (Numeric) *</label>
                  <input
                    type="text"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="25000"
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Key features, amenities, and connectivity..."
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">Property Photos</label>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {newImagePreviews.length}/15 photos selected
                  </span>
                </div>

                <input
                  ref={addFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleAddModalFiles(e.target.files)}
                  className="hidden"
                />

                <div
                  onClick={() => addFileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleAddModalFiles(e.dataTransfer.files);
                  }}
                  className="border-2 border-dashed border-gray-300 hover:border-[#E59A38] bg-gray-50/70 hover:bg-amber-50/20 rounded-2xl p-4 text-center cursor-pointer transition group"
                >
                  <Upload size={24} className="mx-auto text-[#E59A38] mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-gray-800">
                    Click to browse or drag &amp; drop photos here
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Select multiple photos (PNG, JPG, WebP) &bull; Up to 15 photos
                  </p>
                </div>

                {newImagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 mt-3">
                    {newImagePreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-100"
                      >
                        <Image
                          src={src}
                          alt={`preview-${idx}`}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#E59A38] text-white text-[9px] font-bold shadow-xs">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeAddModalPhoto(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
                          title="Remove photo"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    {newImagePreviews.length < 15 && (
                      <button
                        type="button"
                        onClick={() => addFileInputRef.current?.click()}
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-full py-3 rounded-xl bg-[#1B2A4A] hover:bg-[#142038] text-white font-bold text-xs"
                >
                  {isCreating ? 'Publishing...' : 'Publish Property Live'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PROPERTY */}
      {editingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProperty(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-800"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-[#1B2A4A] mb-4">
              Edit Property ID: {editingProperty.property_code}
            </h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editingProperty.title}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, title: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price Label</label>
                  <input
                    type="text"
                    value={editingProperty.price_label}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, price_label: e.target.value })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Badge</label>
                  <select
                    value={editingProperty.badge || ''}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        badge: (e.target.value as PropertyBadge) || null,
                      })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="">No Badge</option>
                    <option value="Verified">Verified</option>
                    <option value="New">New</option>
                    <option value="New launch">New launch</option>
                    <option value="Ready">Ready</option>
                    <option value="Premium">Premium</option>
                    <option value="Plots">Plots</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingProperty.status}
                    onChange={(e) =>
                      setEditingProperty({
                        ...editingProperty,
                        status: e.target.value as PropertyStatus,
                      })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Furnishing</label>
                  <input
                    type="text"
                    value={editingProperty.furnishing}
                    onChange={(e) =>
                      setEditingProperty({ ...editingProperty, furnishing: e.target.value as Property['furnishing'] })
                    }
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProperty.description}
                  onChange={(e) =>
                    setEditingProperty({ ...editingProperty, description: e.target.value })
                  }
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              {/* Photo Management in Edit Modal */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700">Manage Property Photos</label>
                  <button
                    type="button"
                    onClick={() => editFileInputRef.current?.click()}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E59A38] hover:underline cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add More Photos</span>
                  </button>
                </div>

                <input
                  ref={editFileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleEditModalFiles(e.target.files)}
                  className="hidden"
                />

                {/* Existing Photos */}
                {editingProperty.images && editingProperty.images.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-gray-500 mb-1.5">
                      Existing Photos ({editingProperty.images.length})
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                      {editingProperty.images.map((src, idx) => (
                        <div
                          key={`existing-${idx}`}
                          className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group"
                        >
                          <Image
                            src={src}
                            alt={`existing-${idx}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-md bg-[#E59A38] text-white text-[9px] font-bold shadow-xs">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeExistingEditPhoto(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
                            title="Delete this photo"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Newly Added Photos Preview */}
                {editImagePreviews.length > 0 && (
                  <div className="mb-3">
                    <p className="text-[11px] font-semibold text-emerald-600 mb-1.5">
                      New Photos to Upload ({editImagePreviews.length})
                    </p>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                      {editImagePreviews.map((src, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-500 bg-gray-100 group"
                        >
                          <Image
                            src={src}
                            alt={`new-${idx}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewEditPhoto(idx)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
                            title="Remove new photo"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Action Box */}
                <div
                  onClick={() => editFileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-[#E59A38] bg-gray-50/70 hover:bg-amber-50/20 rounded-2xl p-3 text-center cursor-pointer transition"
                >
                  <p className="text-xs font-bold text-gray-700 flex items-center justify-center gap-1.5">
                    <Upload size={14} className="text-[#E59A38]" />
                    <span>Click to browse and upload additional photos</span>
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-3 rounded-xl bg-[#1B2A4A] text-white font-bold text-xs"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
