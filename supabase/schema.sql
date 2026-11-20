-- Rent With You: Supabase Database Schema & RLS Policies
-- Compatible with Supabase PostgreSQL and Row Level Security (RLS)

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean Up Existing (for clean migrations)
DROP TABLE IF EXISTS public.wishlists CASCADE;
DROP TABLE IF EXISTS public.enquiries CASCADE;
DROP TABLE IF EXISTS public.properties CASCADE;
DROP TABLE IF EXISTS public.site_stats CASCADE;

-- 3. Create Properties Table
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('rent', 'buy', 'commercial')),
    sub_category TEXT NOT NULL,
    property_type TEXT NOT NULL,
    bedrooms TEXT NOT NULL DEFAULT 'N/A',
    furnishing TEXT NOT NULL DEFAULT 'N/A',
    price NUMERIC NOT NULL,
    price_label TEXT NOT NULL,
    area TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Gurgaon',
    landmark TEXT,
    available_from TEXT DEFAULT 'Immediate',
    description TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    badge TEXT CHECK (badge IN ('Verified', 'New', 'New launch', 'Ready', 'Premium', 'Plots', NULL)),
    listed_by_role TEXT NOT NULL CHECK (listed_by_role IN ('Owner', 'Dealer', 'Admin')),
    owner_name TEXT NOT NULL,
    owner_phone TEXT NOT NULL,
    owner_email TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing for fast queries
CREATE INDEX idx_properties_category ON public.properties (category);
CREATE INDEX idx_properties_status ON public.properties (status);
CREATE INDEX idx_properties_city ON public.properties (city);
CREATE INDEX idx_properties_created_at ON public.properties (created_at DESC);

-- 4. Create Wishlists Table
CREATE TABLE public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_property_wishlist UNIQUE (user_id, property_id)
);

CREATE INDEX idx_wishlists_user ON public.wishlists (user_id);

-- 5. Create Enquiries Table
CREATE TABLE public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enquiry_type TEXT NOT NULL CHECK (enquiry_type IN ('general', 'property', 'packers_movers', 'furniture')),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    interest TEXT,
    pickup_location TEXT,
    drop_location TEXT,
    move_date TEXT,
    household_size TEXT,
    message TEXT NOT NULL,
    property_id TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_enquiries_status ON public.enquiries (status);
CREATE INDEX idx_enquiries_type ON public.enquiries (enquiry_type);
CREATE INDEX idx_enquiries_created_at ON public.enquiries (created_at DESC);

-- 6. Create Site Stats Table for Global Visitor Counter
CREATE TABLE public.site_stats (
    id SERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    visitor_count INTEGER NOT NULL DEFAULT 12480,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize default counter
INSERT INTO public.site_stats (key, visitor_count)
VALUES ('global_stats', 12480)
ON CONFLICT (key) DO NOTHING;

-- RPC Function to safely increment visitor counter
CREATE OR REPLACE FUNCTION increment_visitor_count()
RETURNS INTEGER AS $$
DECLARE
    new_count INTEGER;
BEGIN
    UPDATE public.site_stats
    SET visitor_count = visitor_count + 1,
        updated_at = NOW()
    WHERE key = 'global_stats'
    RETURNING visitor_count INTO new_count;

    IF NOT FOUND THEN
        INSERT INTO public.site_stats (key, visitor_count)
        VALUES ('global_stats', 1)
        RETURNING visitor_count INTO new_count;
    END IF;

    RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Grant Privileges to Supabase Roles (Required by PostgREST & RLS)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL ON TABLE public.properties TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.wishlists TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.enquiries TO postgres, anon, authenticated, service_role;
GRANT ALL ON TABLE public.site_stats TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 8. Configure Row Level Security (RLS)

-- Enable RLS on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is an approved admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT lower(coalesce(auth.jwt() ->> 'email', '')) IN (
    'satya2me2@gmail.com',
    'rentwithyou.gurgaon@gmail.com'
  );
$$;

-- RLS: properties
-- Public can read only approved properties; owners can view their submitted properties; admins can view all
CREATE POLICY "Public can view approved properties"
    ON public.properties FOR SELECT
    USING (status = 'approved' OR is_admin() OR (auth.uid() IS NOT NULL AND auth.uid() = user_id));

-- Anyone (guests, owners, dealers) can submit a property for review (status must be pending) or admins can insert approved
CREATE POLICY "Anyone can submit pending property"
    ON public.properties FOR INSERT
    WITH CHECK (status = 'pending' OR is_admin());

-- Users can update their own properties; Admins can update any
CREATE POLICY "Users can update own property or admin"
    ON public.properties FOR UPDATE
    USING ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin())
    WITH CHECK ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin());

-- Users can delete their own properties; Admins can delete any
CREATE POLICY "Users can delete own property or admin"
    ON public.properties FOR DELETE
    USING ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin());

-- RLS: wishlists
CREATE POLICY "Users can view own wishlists"
    ON public.wishlists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to wishlist"
    ON public.wishlists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from wishlist"
    ON public.wishlists FOR DELETE
    USING (auth.uid() = user_id);

-- RLS: enquiries
-- Anyone can submit an enquiry
CREATE POLICY "Anyone can submit enquiry"
    ON public.enquiries FOR INSERT
    WITH CHECK (true);

-- Only admins can view enquiries
CREATE POLICY "Admin can view enquiries"
    ON public.enquiries FOR SELECT
    USING (is_admin());

-- Only admins can update enquiry status
CREATE POLICY "Admin can update enquiries"
    ON public.enquiries FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- RLS: site_stats
CREATE POLICY "Public read site_stats"
    ON public.site_stats FOR SELECT
    USING (true);

-- 8. Supabase Storage Setup (Run in SQL editor or create manually in dashboard)
-- Bucket: property-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Public can view images
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

-- Allow image uploads to property-images bucket
CREATE POLICY "Allow Image Uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'property-images'
    );

-- Only admins may delete property images
CREATE POLICY "Allow Image Deletes"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'property-images'
      AND is_admin()
    );
