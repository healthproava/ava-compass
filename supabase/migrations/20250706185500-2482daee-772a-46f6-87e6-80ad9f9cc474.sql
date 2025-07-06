-- Create table for widget commands
CREATE TABLE public.widget_commands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  command_type TEXT NOT NULL,
  command_data JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for widget interactions
CREATE TABLE public.widget_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  interaction_type TEXT NOT NULL,
  interaction_data JSONB,
  widget_command_id UUID REFERENCES public.widget_commands(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.widget_commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widget_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own widget commands" 
ON public.widget_commands 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own widget interactions" 
ON public.widget_interactions 
FOR ALL 
USING (auth.uid() = user_id);

-- Add indexes for better performance
CREATE INDEX idx_widget_commands_user_id ON public.widget_commands(user_id);
CREATE INDEX idx_widget_commands_processed ON public.widget_commands(processed);
CREATE INDEX idx_widget_interactions_user_id ON public.widget_interactions(user_id);
CREATE INDEX idx_widget_interactions_command_id ON public.widget_interactions(widget_command_id);