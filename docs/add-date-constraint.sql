-- Add a unique constraint to the date column in the attacks table
-- This ensures that each date can only have one entry

-- First, check if the constraint already exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_constraint 
        WHERE conname = 'attacks_date_unique'
    ) THEN
        -- Add the unique constraint
        ALTER TABLE attacks ADD CONSTRAINT attacks_date_unique UNIQUE (date);
        RAISE NOTICE 'Unique constraint added to attacks.date column';
    ELSE
        RAISE NOTICE 'Unique constraint already exists on attacks.date column';
    END IF;
END $$;

-- Verify the constraint was added
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'attacks'::regclass 
AND conname = 'attacks_date_unique';