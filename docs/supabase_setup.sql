-- Create the attacks table
CREATE TABLE IF NOT EXISTS attacks (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) NOT NULL,
  uav INTEGER DEFAULT 0,
  cruise INTEGER DEFAULT 0,
  ballistic INTEGER DEFAULT 0,
  source_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_attacks_date ON attacks(date);

-- Clear existing data (optional - remove this line if you want to keep existing data)
TRUNCATE TABLE attacks;

-- Insert all attack data - as-of March 15, 2024
INSERT INTO attacks (date, uav, cruise, ballistic, source_link) VALUES
  ('Mar 01', 541, 2, 165, NULL),
  ('Mar 02', 148, 6, 9, NULL),
  ('Mar 03', 123, 0, 12, NULL),
  ('Mar 04', 129, 0, 3, NULL),
  ('Mar 05', 131, 0, 7, NULL),
  ('Mar 06', 112, 0, 9, NULL),
  ('Mar 07', 121, 0, 16, NULL),
  ('Mar 08', 117, 0, 17, NULL),
  ('Mar 09', 18, 0, 15, NULL),
  ('Mar 10', 35, 0, 9, NULL),
  ('Mar 11', 33, 4, 8, NULL),
  ('Mar 12', 26, 4, 10, NULL),
  ('Mar 13', 27, 0, 7, NULL),
  ('Mar 14', 33, 0, 9, NULL),
  ('Mar 15', 6, 0, 4, 'https://www.instagram.com/p/DV5-LMziNx9/');

-- Enable Row Level Security
ALTER TABLE attacks ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access
CREATE POLICY "Allow public read access" ON attacks
  FOR SELECT
  USING (true);

-- Verify the data was inserted
SELECT * FROM attacks ORDER BY date;