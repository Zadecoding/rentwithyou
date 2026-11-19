import { Property, Enquiry, PropertyCategory, FilterState } from '@/types';
import { INITIAL_PROPERTIES } from '@/data/mockProperties';
import { createClient } from './supabase/client';
import { BRAND } from './constants';

const LOCAL_STORAGE_PROPERTIES_KEY = 'rw_custom_properties';
const LOCAL_STORAGE_ENQUIRIES_KEY = 'rw_custom_enquiries';
const LOCAL_STORAGE_VISITOR_KEY = 'rw_visitor_count';

// Helper to get local custom properties
function getStoredProperties(): Property[] {
  if (typeof window === 'undefined') return INITIAL_PROPERTIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (!raw) return INITIAL_PROPERTIES;
    const custom = JSON.parse(raw) as Property[];
    // Merge INITIAL_PROPERTIES with custom without duplicate IDs
    const combined = [...custom];
    for (const init of INITIAL_PROPERTIES) {
      if (!combined.some((p) => p.id === init.id)) {
        combined.push(init);
      }
    }
    return combined;
  } catch {
    return INITIAL_PROPERTIES;
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
      if (!error && data && data.length > 0) {
        return data as Property[];
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store:', e);
    }
  }

  // Fallback to local properties
  const all = getStoredProperties();
  const approved = all.filter((p) => p.status === 'approved');
  if (category) {
    return approved.filter((p) => p.category === category);
  }
  return approved;
}

export async function fetchAllPropertiesForAdmin(): Promise<Property[]> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Property[];
      }
    } catch (e) {
      console.warn('Supabase admin fetch error:', e);
    }
  }

  return getStoredProperties();
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .or(`id.eq.${id},property_code.eq.${id}`)
        .single();

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
        p.id === id ||
        p.property_code === id ||
        p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') === id
    ) || null
  );
}

export async function createProperty(
  propertyData: Omit<Property, 'id' | 'property_code' | 'created_at'>
): Promise<{ success: boolean; data?: Property; error?: string }> {
  const supabase = createClient();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const propertyCode = randomSuffix;

  const newProperty: Property = {
    ...propertyData,
    id: 'prop-' + Date.now(),
    property_code: propertyCode,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
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
            user_id: newProperty.user_id || null,
            status: newProperty.status,
          },
        ])
        .select()
        .single();

      if (!error && data) {
        // Also save to local storage for immediate UI reflect
        const current = getStoredProperties();
        savePropertiesToStorage([data as Property, ...current]);
        return { success: true, data: data as Property };
      }
    } catch (e: unknown) {
      console.warn('Failed to insert into Supabase, saving locally:', e);
    }
  }

  // Save locally
  const current = getStoredProperties();
  const updated = [newProperty, ...current];
  savePropertiesToStorage(updated);
  return { success: true, data: newProperty };
}

export async function updatePropertyStatus(
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);

      if (!error) {
        // Also update local
        const current = getStoredProperties();
        const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
        savePropertiesToStorage(updated);
        return true;
      }
    } catch {
      // fallback
    }
  }

  const current = getStoredProperties();
  const updated = current.map((p) => (p.id === id ? { ...p, status } : p));
  savePropertiesToStorage(updated);
  return true;
}

export async function updateProperty(
  id: string,
  updates: Partial<Property>
): Promise<boolean> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase.from('properties').update(updates).eq('id', id);
      if (!error) {
        const current = getStoredProperties();
        const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
        savePropertiesToStorage(updated);
        return true;
      }
    } catch {
      // fallback
    }
  }

  const current = getStoredProperties();
  const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
  savePropertiesToStorage(updated);
  return true;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) {
        const current = getStoredProperties();
        const updated = current.filter((p) => p.id !== id);
        savePropertiesToStorage(updated);
        return true;
      }
    } catch {
      // fallback
    }
  }

  const current = getStoredProperties();
  const updated = current.filter((p) => p.id !== id);
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

// Enquiry submission
export async function submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'created_at' | 'status'>): Promise<{ success: boolean; id?: string }> {
  const supabase = createClient();
  const newEnquiry: Enquiry = {
    ...enquiry,
    id: 'enq-' + Date.now(),
    status: 'new',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .insert([newEnquiry])
        .select()
        .single();

      if (!error && data) {
        return { success: true, id: data.id };
      }
    } catch {
      // fallback
    }
  }

  // Store in localStorage
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
  const supabase = createClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data as Enquiry[];
      }
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY);
      if (stored) {
        return JSON.parse(stored) as Enquiry[];
      }
    } catch {
      // ignore
    }
  }

  // Sample initial enquiries for admin preview
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

export async function updateEnquiryStatus(id: string, status: 'new' | 'contacted' | 'closed'): Promise<boolean> {
  const supabase = createClient();

  if (supabase) {
    try {
      const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const stored: Enquiry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ENQUIRIES_KEY) || '[]');
      const updated = stored.map((e) => (e.id === id ? { ...e, status } : e));
      localStorage.setItem(LOCAL_STORAGE_ENQUIRIES_KEY, JSON.stringify(updated));
      return true;
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
