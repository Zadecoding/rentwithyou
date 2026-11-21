import { Property, Enquiry, PropertyCategory } from '@/types';
import { createClient } from './supabase/client';
import { BRAND } from './constants';

const LOCAL_STORAGE_PROPERTIES_KEY = 'rw_custom_properties';
const LOCAL_STORAGE_ENQUIRIES_KEY = 'rw_custom_enquiries';
const LOCAL_STORAGE_VISITOR_KEY = 'rw_visitor_count';

// Helper to get local custom properties
function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Property[];
  } catch {
    return [];
  }
}

function savePropertiesToStorage(props: Property[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(props));
  } catch (e) {
    console.error('Failed to save properties to localStorage:', e);
  }
}

export async function fetchProperties(category?: PropertyCategory): Promise<Property[]> {
  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase.from('properties').select('*').eq('status', 'approved');
      if (category) {
        query = query.eq('category', category);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && data) {
        return data as Property[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed:', e);
    }
  }

  // Fallback to local stored properties only (no dummy properties)
  const all = getStoredProperties();
  const approved = all.filter((p) => p.status === 'approved');
  if (category) {
    return approved.filter((p) => p.category === category);
  }
  return approved;
}

export async function fetchAllPropertiesForAdmin(): Promise<Property[]> {
  // 1. Try server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/properties', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.properties)) {
          return json.properties as Property[];
        }
      }
    } catch (e) {
      console.warn('API admin fetch error, trying client fallback:', e);
    }
  }

  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Property[];
      }
    } catch (e) {
      console.warn('Supabase admin fetch error:', e);
    }
  }

  return getStoredProperties();
}

export async function fetchUserProperties(
  userId?: string | null,
  userEmail?: string | null
): Promise<Property[]> {
  const supabase = createClient();
  const stored = getStoredProperties();
  const localMatching = stored.filter(
    (p) =>
      (userId && p.user_id === userId) ||
      (userEmail && p.owner_email && p.owner_email.toLowerCase() === userEmail.toLowerCase())
  );

  if (supabase && (userId || userEmail)) {
    try {
      let query = supabase.from('properties').select('*');
      if (userId && isUuid(userId) && userEmail) {
        query = query.or(`user_id.eq.${userId},owner_email.eq.${userEmail}`);
      } else if (userId && isUuid(userId)) {
        query = query.eq('user_id', userId);
      } else if (userEmail) {
        query = query.eq('owner_email', userEmail);
      }
      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && data) {
        const combined = [...(data as Property[])];
        for (const loc of localMatching) {
          if (!combined.some((p) => p.id === loc.id || p.property_code === loc.property_code)) {
            combined.push(loc);
          }
        }
        return combined;
      }
    } catch (e) {
      console.warn('Supabase fetchUserProperties error:', e);
    }
  }

  return localMatching;
}

const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const cleanId = decodeURIComponent(id || '').trim();
  const supabase = createClient();

  if (supabase && cleanId) {
    try {
      let query = supabase.from('properties').select('*');
      if (isUuid(cleanId)) {
        query = query.or(`id.eq.${cleanId},property_code.eq.${cleanId}`);
      } else {
        query = query.eq('property_code', cleanId);
      }
      const { data, error } = await query.maybeSingle();

      if (!error && data) {
        return data as Property;
      }
    } catch {
      // fallback
    }
  }

  const all = getStoredProperties();
  return (
    all.find(
      (p) =>
        p.id === cleanId ||
        p.property_code === cleanId ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === cleanId
    ) || null
  );
}

export async function createProperty(
  propertyData: Omit<Property, 'id' | 'property_code' | 'created_at'>
): Promise<{ success: boolean; data?: Property; error?: string }> {
  const supabase = createClient();
  const current = getStoredProperties();

  // Generate a distinct 4-digit property code
  let propertyCode = Math.floor(1000 + Math.random() * 9000).toString();
  while (current.some((p) => p.property_code === propertyCode)) {
    propertyCode = Math.floor(1000 + Math.random() * 9000).toString();
  }

  const newProperty: Property = {
    ...propertyData,
    id: 'prop-' + Date.now(),
    property_code: propertyCode,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const sanitizedUserId =
        newProperty.user_id && isUuid(newProperty.user_id) ? newProperty.user_id : null;

      const { data, error } = await supabase
        .from('properties')
        .insert([
          {
            property_code: newProperty.property_code,
            title: newProperty.title,
            category: newProperty.category,
            sub_category: newProperty.sub_category,
            property_type: newProperty.property_type,
            bedrooms: newProperty.bedrooms,
            furnishing: newProperty.furnishing,
            price: newProperty.price,
            price_label: newProperty.price_label,
            area: newProperty.area,
            city: newProperty.city,
            landmark: newProperty.landmark || null,
            available_from: newProperty.available_from,
            description: newProperty.description,
            images: newProperty.images,
            badge: newProperty.badge || null,
            listed_by_role: newProperty.listed_by_role,
            owner_name: newProperty.owner_name,
            owner_phone: newProperty.owner_phone,
            owner_email: newProperty.owner_email || null,
            user_id: sanitizedUserId,
            status: newProperty.status,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        // Also save to local storage for immediate UI reflect
        savePropertiesToStorage([data as Property, ...current]);
        return { success: true, data: data as Property };
      } else if (error) {
        console.warn('Supabase property insert error:', error);
      }
    } catch (e: unknown) {
      console.warn('Failed to insert into Supabase, saving locally:', e);
    }
  }

  // Save locally
  const updated = [newProperty, ...current];
  savePropertiesToStorage(updated);
  return { success: true, data: newProperty };
}

export async function updatePropertyStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  // 1. Try server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const current = getStoredProperties();
          const updated = current.map((p) =>
            p.id === id || p.property_code === id ? { ...p, status } : p
          );
          savePropertiesToStorage(updated);
          return true;
        }
      }
    } catch (e) {
      console.warn('API updatePropertyStatus error, trying fallback:', e);
    }
  }

  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase.from('properties').update({ status });
      if (isUuid(id)) {
        query = query.eq('id', id);
      } else {
        query = query.eq('property_code', id);
      }
      const { error } = await query;

      if (!error) {
        const current = getStoredProperties();
        const updated = current.map((p) =>
          p.id === id || p.property_code === id ? { ...p, status } : p
        );
        savePropertiesToStorage(updated);
        return true;
      }
    } catch {
      // fallback
    }
  }

  const current = getStoredProperties();
  const updated = current.map((p) =>
    p.id === id || p.property_code === id ? { ...p, status } : p
  );
  savePropertiesToStorage(updated);
  return true;
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<boolean> {
  // 1. Try server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const current = getStoredProperties();
          const updated = current.map((p) =>
            p.id === id || p.property_code === id ? { ...p, ...updates } : p
          );
          savePropertiesToStorage(updated);
          return true;
        }
      }
    } catch (e) {
      console.warn('API updateProperty error, trying fallback:', e);
    }
  }

  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase.from('properties').update(updates);
      if (isUuid(id)) {
        query = query.eq('id', id);
      } else {
        query = query.eq('property_code', id);
      }
      const { error } = await query;
      if (!error) {
        const current = getStoredProperties();
        const updated = current.map((p) =>
          p.id === id || p.property_code === id ? { ...p, ...updates } : p
        );
        savePropertiesToStorage(updated);
        return true;
      }
    } catch {
      // fallback
    }
  }

  const current = getStoredProperties();
  const updated = current.map((p) =>
    p.id === id || p.property_code === id ? { ...p, ...updates } : p
  );
  savePropertiesToStorage(updated);
  return true;
}

export async function deleteProperty(id: string): Promise<boolean> {
  // 1. Primary: Use server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/admin/properties', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const current = getStoredProperties();
          const updated = current.filter((p) => p.id !== id && p.property_code !== id);
          savePropertiesToStorage(updated);
          return true;
        }
      }
    } catch (e) {
      console.warn('API deleteProperty error, trying client fallback:', e);
    }
  }

  const supabase = createClient();

  if (supabase) {
    try {
      let query = supabase.from('properties').delete();
      if (isUuid(id)) {
        query = query.eq('id', id);
      } else {
        query = query.eq('property_code', id);
      }
      const { error } = await query;
      if (!error) {
        const current = getStoredProperties();
        const updated = current.filter((p) => p.id !== id && p.property_code !== id);
        savePropertiesToStorage(updated);
        return true;
      }
    } catch {
      // fallback
    }
  }

  const current = getStoredProperties();
  const updated = current.filter((p) => p.id !== id && p.property_code !== id);
  savePropertiesToStorage(updated);
  return true;
}

// Upload images to Supabase storage with preview fallback
export async function uploadPropertyImages(files: File[]): Promise<string[]> {
  const supabase = createClient();
  const uploadedUrls: string[] = [];

  for (const file of files) {
    if (supabase) {
      try {
        const ext = file.name.split('.').pop();
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
        const filePath = `properties/${filename}`;

        const { error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('property-images')
            .getPublicUrl(filePath);

          if (data?.publicUrl) {
            uploadedUrls.push(data.publicUrl);
            continue;
          }
        }
      } catch (err) {
        console.warn('Supabase storage upload error, falling back to local URL:', err);
      }
    }

    // Fallback: convert to local Data URL
    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    uploadedUrls.push(dataUrl);
  }

  return uploadedUrls;
}

// Enquiry submission (bypasses RLS via server API route)
export async function submitEnquiry(
  enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>
): Promise<{ success: boolean; id?: string }> {
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: 'enq-' + Date.now(),
    status: 'new',
    created_at: new Date().toISOString(),
  };

  // 1. Try server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.enquiry) {
          try {
            const existing = JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]'
            );
            localStorage.setItem(
              LOCAL_STORAGE_ENQUIRIES_KEY,
              JSON.stringify([json.enquiry, ...existing])
            );
          } catch {
            // ignore
          }
          return { success: true, id: json.enquiry.id };
        }
      }
    } catch (e) {
      console.warn('API enquiry insert error, trying fallback:', e);
    }
  }

  // 2. Direct client fallback
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([
          {
            enquiry_type: enquiry.enquiry_type,
            name: enquiry.name,
            phone: enquiry.phone,
            email: enquiry.email || null,
            interest: enquiry.interest || null,
            pickup_location: enquiry.pickup_location || null,
            drop_location: enquiry.drop_location || null,
            move_date: enquiry.move_date || null,
            household_size: enquiry.household_size || null,
            message: enquiry.message,
            property_id: enquiry.property_id || null,
            status: 'new',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return { success: true, id: data.id };
      }
    } catch {
      // fallback
    }
  }

  // 3. Store in localStorage so enquiry is never lost
  if (typeof window !== 'undefined') {
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]');
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify([newEnquiry, ...existing]));
    } catch {
      // ignore
    }
  }

  return { success: true, id: newEnquiry.id };
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  // 1. Try server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/enquiries', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.enquiries)) {
          if (json.enquiries.length > 0) {
            try {
              localStorage.setItem(
                LOCAL_STORAGE_ENQUIRIES_KEY,
                JSON.stringify(json.enquiries)
              );
            } catch {
              // ignore
            }
            return json.enquiries as Enquiry[];
          }
        }
      }
    } catch (e) {
      console.warn('API fetchEnquiries error, trying fallback:', e);
    }
  }

  // 2. Direct client fallback
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Enquiry[];
      }
    } catch {
      // fallback
    }
  }

  // 3. Check local storage
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Enquiry[];
        if (parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Sample initial enquiries for admin preview if completely empty
  return [
    {
      id: 'enq-01',
      enquiry_type: 'packers_movers',
      name: 'Rohit Sharma',
      phone: '+91 9911169115',
      email: 'rohit.s@gmail.com',
      pickup_location: 'Sector 54, Golf Course Road',
      drop_location: 'Sector 65, Golf Course Extension',
      move_date: '28 Nov 2026',
      household_size: '2 BHK',
      message: 'Need full packing, loading, and unloading service for 2 BHK household with fragile glassware.',
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'enq-02',
      enquiry_type: 'property',
      name: 'Ananya Deshmukh',
      phone: '+91 9876543210',
      email: 'ananya.d@gmail.com',
      interest: '2 BHK Apartment in Sector 57',
      message: 'Hi, I want to visit Property 0001 this weekend. Is the rent negotiable?',
      property_id: 'prop-0001',
      status: 'contacted',
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'enq-03',
      enquiry_type: 'furniture',
      name: 'Kavita Chawla',
      phone: '+91 9123456789',
      interest: 'Full Home Furniture Package (Rent)',
      message: 'Looking for living room sofa set, 1 queen bed, and 4-seater dining table on 11-month rental.',
      status: 'new',
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];
}

export async function updateEnquiryStatus(
  id: string,
  status: 'new' | 'contacted' | 'closed'
): Promise<boolean> {
  // 1. Try server API route
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          try {
            const stored: Enquiry[] = JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]'
            );
            const updated = stored.map((e) => (e.id === id ? { ...e, status } : e));
            localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('API updateEnquiryStatus error:', e);
    }
  }

  // 2. Direct client fallback
  const supabase = createClient();
  if (supabase) {
    try {
      if (isUuid(id)) {
        const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
        if (!error) return true;
      }
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored: Enquiry[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]'
      );
      const updated = stored.map((e) => (e.id === id ? { ...e, status } : e));
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
      return true;
    } catch {
      // ignore
    }
  }

  return true;
}

export async function deleteEnquiry(id: string): Promise<boolean> {
  // 1. Try server API route (service role client bypasses RLS)
  if (typeof window !== 'undefined') {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          try {
            const stored: Enquiry[] = JSON.parse(
              localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]'
            );
            const updated = stored.filter((e) => e.id !== id);
            localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
          } catch {
            // ignore
          }
          return true;
        }
      }
    } catch (e) {
      console.warn('API deleteEnquiry error:', e);
    }
  }

  // 2. Direct client fallback
  const supabase = createClient();
  if (supabase && isUuid(id)) {
    try {
      await supabase.from('enquiries').delete().eq('id', id);
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored: Enquiry[] = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]'
      );
      const updated = stored.filter((e) => e.id !== id);
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }

  return true;
}

// Visitor counter tracking
export async function getVisitorCount(): Promise<number> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc('increment_visitor_count');
      if (!error && typeof data === 'number') {
        return data;
      }
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const current = parseInt(localStorage.getItem(LOCAL_STORAGE_VISITOR_KEY) || BRAND.defaultVisitorCount.toString(), 10);
      const updated = current + 1;
      localStorage.setItem(LOCAL_STORAGE_VISITOR_KEY, updated.toString());
      return updated;
    } catch {
      return BRAND.defaultVisitorCount;
    }
  }

  return BRAND.defaultVisitorCount;
}
