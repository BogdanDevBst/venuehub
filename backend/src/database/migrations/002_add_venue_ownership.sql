-- Add created_by column to venues table to track ownership
-- This allows customers to manage only their own venues

ALTER TABLE venues 
ADD COLUMN created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Add index for performance when querying by creator
CREATE INDEX idx_venues_created_by ON venues(created_by);

-- Add comment for documentation
COMMENT ON COLUMN venues.created_by IS 'User ID of the person who created this venue';
