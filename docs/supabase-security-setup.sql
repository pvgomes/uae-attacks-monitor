-- IMPORTANT: Run this in your Supabase SQL editor to ensure read-only access

-- 1. Enable RLS on the attacks table (if not already enabled)
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access" ON attacks;
DROP POLICY IF EXISTS "Enable read access for all users" ON attacks;

-- 3. Create a READ-ONLY policy
CREATE POLICY "Public users can only read" ON attacks
  AS PERMISSIVE
  FOR SELECT              -- Only allows SELECT queries
  TO anon                 -- Only for anonymous users (your anon key)
  USING (true);          -- Allow all rows to be read

-- 4. Explicitly ensure no write policies exist for anon role
-- This query will show you if any write policies exist (should return 0 rows)
SELECT * FROM pg_policies 
WHERE tablename = 'attacks' 
AND policyname LIKE '%INSERT%' OR policyname LIKE '%UPDATE%' OR policyname LIKE '%DELETE%'
AND roles::text LIKE '%anon%';

-- 5. Verify the anon role has NO write permissions
REVOKE INSERT, UPDATE, DELETE ON attacks FROM anon;

-- 6. Confirm only SELECT permission exists
GRANT SELECT ON attacks TO anon;

-- Test: This should work (reading data)
-- SELECT * FROM attacks;

-- Test: These should FAIL with permission denied
-- INSERT INTO attacks (date, uav) VALUES ('Test', 999);
-- UPDATE attacks SET uav = 999;
-- DELETE FROM attacks;

-- Your data is now protected! ✅