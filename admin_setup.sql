-- Admin Whitelist Table Setup
-- Run this in your Supabase SQL Editor to create the admin whitelist table

CREATE TABLE IF NOT EXISTS admin_whitelist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  added_by TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_whitelist_email ON admin_whitelist(email);
CREATE INDEX IF NOT EXISTS idx_admin_whitelist_active ON admin_whitelist(is_active);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_whitelist ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Anyone can check if an email is in the whitelist (needed for signup)
CREATE POLICY "Anyone can check admin whitelist for eligibility" ON admin_whitelist
  FOR SELECT USING (true);

-- Only admins can view the full whitelist details
CREATE POLICY "Admins can view full admin whitelist" ON admin_whitelist
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

-- Only admins can insert into the whitelist
CREATE POLICY "Admins can add to admin whitelist" ON admin_whitelist
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

-- Only admins can update the whitelist
CREATE POLICY "Admins can update admin whitelist" ON admin_whitelist
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

-- Only admins can delete from the whitelist
CREATE POLICY "Admins can delete from admin whitelist" ON admin_whitelist
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'Admin'
    )
  );

-- Insert your first admin
INSERT INTO admin_whitelist (email, added_by, is_active) 
VALUES ('sd.access.25@gmail.com', 'system', true)
ON CONFLICT (email) DO NOTHING;

-- Optional: Add more admins
-- INSERT INTO admin_whitelist (email, added_by, is_active) 
-- VALUES ('admin2@example.com', 'your-email@example.com', true)
-- ON CONFLICT (email) DO NOTHING;
