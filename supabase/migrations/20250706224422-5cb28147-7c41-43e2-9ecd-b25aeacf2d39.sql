-- Update RLS policy for widget_commands to allow webhook calls without authentication
DROP POLICY IF EXISTS "Users can manage their own widget commands" ON widget_commands;

CREATE POLICY "Users can manage their own widget commands" 
ON widget_commands 
FOR ALL 
USING (auth.uid() = user_id OR user_id IS NULL)
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);