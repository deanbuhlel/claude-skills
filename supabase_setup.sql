-- Create the 'conversations' table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  original_text TEXT NOT NULL,
  summary TEXT NOT NULL
);

-- Enable Row Level Security (RLS) for the 'conversations' table
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Create a policy for anonymous users to read their own conversations (if user auth was implemented)
-- For this example, we'll allow authenticated users to insert and read.
-- If you want public read, you can adjust this.
-- For now, we'll assume the frontend only fetches history, and the API route (server-side) inserts.

-- Policy to allow authenticated users to read conversations
CREATE POLICY "Allow authenticated users to read conversations"
ON public.conversations FOR SELECT
TO authenticated
USING (true);

-- Policy to allow authenticated users to insert conversations (if client-side insert was needed)
-- For this app, insertion happens via the API route using service_role_key, so this might not be strictly necessary for client.
-- However, if you expand to allow users to manage their own summaries, this would be useful.
CREATE POLICY "Allow authenticated users to insert conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (true);

-- For the purpose of this app, the API route uses the service_role_key, which bypasses RLS.
-- The frontend uses the anon key to fetch history.
-- If you want to restrict history viewing to specific users, you'd add a 'user_id' column
-- and modify RLS policies to check 'auth.uid() = user_id'.
