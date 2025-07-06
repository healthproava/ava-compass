-- Create unified facilities table that matches search results schema
CREATE TABLE public.unified_facilities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT, -- For tracking external IDs from various sources
  title TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  rating DECIMAL(3,2),
  rating_count INTEGER,
  place_type TEXT,
  place_types JSONB,
  website TEXT,
  phone_number TEXT,
  opening_hours JSONB,
  thumbnail_url TEXT,
  description TEXT,
  amenities JSONB,
  care_services JSONB,
  accepted_payers JSONB,
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  capacity INTEGER,
  availability INTEGER,
  license_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  source TEXT, -- Track data source: 'serperapi', 'manual', 'combined_data', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.unified_facilities ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view facilities" 
ON public.unified_facilities 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to manage facilities
CREATE POLICY "Authenticated users can manage facilities" 
ON public.unified_facilities 
FOR ALL 
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Add indexes for better performance
CREATE INDEX idx_unified_facilities_location ON public.unified_facilities(latitude, longitude);
CREATE INDEX idx_unified_facilities_rating ON public.unified_facilities(rating);
CREATE INDEX idx_unified_facilities_place_type ON public.unified_facilities(place_type);
CREATE INDEX idx_unified_facilities_source ON public.unified_facilities(source);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_unified_facilities_updated_at
BEFORE UPDATE ON public.unified_facilities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate data from serperapi_places to unified_facilities
INSERT INTO public.unified_facilities (
  external_id, title, address, latitude, longitude, rating, rating_count,
  place_type, place_types, website, phone_number, opening_hours, 
  thumbnail_url, source, created_at
)
SELECT 
  external_uuid, title, address, latitude, longitude, rating, rating_count,
  place_type, place_types, website, phone_number, opening_hours,
  thumbnail_url, 'serperapi', created_at
FROM public.serperapi_places
WHERE title IS NOT NULL;

-- Migrate data from agentmobile_facilities to unified_facilities
INSERT INTO public.unified_facilities (
  external_id, title, address, latitude, longitude, rating, rating_count,
  place_type, website, phone_number, thumbnail_url, description,
  amenities, care_services, accepted_payers, price_min, price_max,
  capacity, availability, source, created_at
)
SELECT 
  id::text, name, address, latitude, longitude, rating, null,
  type, website, phone, null, description,
  amenities, care_services, accepted_payers, price_min, price_max,
  capacity, availability, 'agentmobile', created_at
FROM public.agentmobile_facilities
WHERE name IS NOT NULL
ON CONFLICT DO NOTHING;