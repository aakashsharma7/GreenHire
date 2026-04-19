-- GreenHire Supabase Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Create Tables

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  company_name text NOT NULL,
  company_logo_url text,
  description text NOT NULL,
  job_type text CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship')),
  location text NOT NULL,
  is_remote boolean DEFAULT false,
  salary_min integer,
  salary_max integer,
  apply_url text NOT NULL,
  contact_email text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'expired', 'rejected')),
  is_featured boolean DEFAULT false,
  stripe_payment_id text,
  posted_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  confirmed boolean DEFAULT false,
  confirmation_token text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE NOT NULL,
  stripe_payment_intent text,
  amount integer,
  plan text CHECK (plan IN ('single', 'bundle', 'featured')),
  job_id uuid REFERENCES jobs(id),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at timestamptz DEFAULT now()
);

-- 2. Full-Text Search Setup for Jobs

-- Add a generated tsvector column for fast text searching
ALTER TABLE jobs 
ADD COLUMN textsearchable_index_col tsvector
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(company_name, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'C')
) STORED;

-- Create an index on the tsvector column
CREATE INDEX textsearch_idx ON jobs USING GIN (textsearchable_index_col);

-- 3. Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- JOBS policies
-- Anyone can read live jobs
CREATE POLICY "Anyone can view live jobs" 
ON jobs FOR SELECT 
USING (status = 'live' AND expires_at > now());

-- Anyone can insert a new job (it goes to pending state)
CREATE POLICY "Anyone can insert jobs" 
ON jobs FOR INSERT 
WITH CHECK (true);

-- SUBSCRIBERS policies
-- Anyone can insert their email to subscribe
CREATE POLICY "Anyone can insert subscriber" 
ON subscribers FOR INSERT 
WITH CHECK (true);

-- No public select/update/delete on subscribers (only service role)

-- PAYMENTS policies
-- No public operations on payments (only service role)

-- Note: The service role key bypasses RLS, which is used in all API routes that need to do
-- admin tasks like updating job status, viewing pending jobs, updating subscribers, etc.

-- 4. Storage Bucket Setup
-- You will need to manually run this in Supabase SQL editor or create via dashboard:
-- insert into storage.buckets (id, name, public) values ('logos', 'logos', true);

-- Storage RLS
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
-- CREATE POLICY "Anon Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos');

