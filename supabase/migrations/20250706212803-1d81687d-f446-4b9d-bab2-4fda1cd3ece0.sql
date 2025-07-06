-- Create facility comparisons table for storing user comparison sessions
CREATE TABLE public.facility_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  facility_ids JSONB NOT NULL,
  comparison_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.facility_comparisons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own comparisons" 
ON public.facility_comparisons 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own comparisons" 
ON public.facility_comparisons 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own comparisons" 
ON public.facility_comparisons 
FOR UPDATE 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_facility_comparisons_updated_at
BEFORE UPDATE ON public.facility_comparisons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();