-- =========================================================================
-- RENT WITH YOU - ONE-CLICK SUPABASE PERMISSION & RLS FIX
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/dlehiyjdcgtyagrunohz/sql)
-- =========================================================================

-- 1. Grant Schema & Table Privileges to Supabase Roles
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

-- 2. Ensure RLS is active on all tables
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

-- 3. Re-create Admin Check Function
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

-- 4. Recreate RLS Policies for properties
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;
DROP POLICY IF EXISTS "Anyone can submit pending property" ON public.properties;
DROP POLICY IF EXISTS "Users can insert property" ON public.properties;
DROP POLICY IF EXISTS "Users can update own property or admin" ON public.properties;
DROP POLICY IF EXISTS "Users can delete own property or admin" ON public.properties;

-- Public can read approved properties; authenticated users can read their own; admins can read all
CREATE POLICY "Public can view approved properties"
    ON public.properties FOR SELECT
    USING (status = 'approved' OR is_admin() OR (auth.uid() IS NOT NULL AND auth.uid() = user_id));

-- Anyone (owners, dealers, builders) can submit a property for review
CREATE POLICY "Anyone can submit pending property"
    ON public.properties FOR INSERT
    WITH CHECK (status = 'pending' OR is_admin());

-- Owners can edit their own property; admins can edit all
CREATE POLICY "Users can update own property or admin"
    ON public.properties FOR UPDATE
    USING ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin())
    WITH CHECK ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin());

-- Owners can delete their own property; admins can delete all
CREATE POLICY "Users can delete own property or admin"
    ON public.properties FOR DELETE
    USING ((auth.uid() IS NOT NULL AND auth.uid() = user_id) OR is_admin());

-- 5. Recreate RLS Policies for enquiries
DROP POLICY IF EXISTS "Anyone can submit enquiry" ON public.enquiries;
DROP POLICY IF EXISTS "Admin can view enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Admin can update enquiries" ON public.enquiries;

CREATE POLICY "Anyone can submit enquiry"
    ON public.enquiries FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admin can view enquiries"
    ON public.enquiries FOR SELECT
    USING (is_admin());

CREATE POLICY "Admin can update enquiries"
    ON public.enquiries FOR UPDATE
    USING (is_admin())
    WITH CHECK (is_admin());

-- 6. Storage Bucket setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Allow Image Uploads" ON storage.objects;

CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'property-images');

CREATE POLICY "Allow Image Uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'property-images');
