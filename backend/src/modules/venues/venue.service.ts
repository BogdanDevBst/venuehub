import { query } from '../../database/client';
import { NotFoundError, ValidationError } from '../../utils/errors';

interface Address {
  street: string;
  city: string;
  postcode: string;
  country: string;
  coordinates?: { lat: number; lng: number };
}

interface CreateVenueData {
  tenantId: string;
  name: string;
  description?: string;
  address: Address;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  images: string[];
}

interface UpdateVenueData extends Partial<Omit<CreateVenueData, 'tenantId'>> {
  isActive?: boolean;
}

interface VenueFilters {
  city?: string;
  capacityMin?: number;
  capacityMax?: number;
  priceMax?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
}

// Create venue
export const createVenue = async (data: CreateVenueData) => {
  const {
    tenantId,
    name,
    description,
    address,
    capacity,
    pricePerHour,
    amenities,
    images,
  } = data;

  if (!name || name.trim().length === 0) {
    throw new ValidationError('Venue name is required');
  }

  if (capacity <= 0) {
    throw new ValidationError('Capacity must be greater than 0');
  }

  if (pricePerHour < 0) {
    throw new ValidationError('Price per hour cannot be negative');
  }

  const result = await query(
    `INSERT INTO venues (
      tenant_id, name, description, address, capacity, 
      price_per_hour, amenities, images
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      tenantId,
      name,
      description || null,
      JSON.stringify(address),
      capacity,
      pricePerHour,
      JSON.stringify(amenities),
      JSON.stringify(images),
    ]
  );

  return result.rows[0];
};

// Get venue by ID
export const getVenueById = async (venueId: string, tenantId: string) => {
  const result = await query(
    `SELECT * FROM venues
     WHERE id = $1 AND tenant_id = $2`,
    [venueId, tenantId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Venue not found');
  }

  return result.rows[0];
};

// Get all venues for tenant
export const getVenuesByTenant = async (
  tenantId: string,
  page: number = 1,
  limit: number = 10
) => {
  const offset = (page - 1) * limit;

  const result = await query(
    `SELECT * FROM venues
     WHERE tenant_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [tenantId, limit, offset]
  );

  const countResult = await query(
    'SELECT COUNT(*) FROM venues WHERE tenant_id = $1',
    [tenantId]
  );

  return {
    venues: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};

// Update venue
export const updateVenue = async (
  venueId: string,
  tenantId: string,
  data: UpdateVenueData
) => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  // Build dynamic update query
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
      updates.push(`${snakeKey} = $${paramCount}`);

      // Handle JSON fields
      if (['address', 'amenities', 'images'].includes(snakeKey)) {
        values.push(JSON.stringify(value));
      } else {
        values.push(value);
      }
      paramCount++;
    }
  });

  if (updates.length === 0) {
    throw new ValidationError('No fields to update');
  }

  values.push(venueId, tenantId);

  const result = await query(
    `UPDATE venues
     SET ${updates.join(', ')}, updated_at = NOW()
     WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1}
     RETURNING *`,
    values
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Venue not found');
  }

  return result.rows[0];
};

// Delete venue
export const deleteVenue = async (venueId: string, tenantId: string) => {
  const result = await query(
    `DELETE FROM venues
     WHERE id = $1 AND tenant_id = $2
     RETURNING id`,
    [venueId, tenantId]
  );

  if (result.rows.length === 0) {
    throw new NotFoundError('Venue not found');
  }

  return { success: true };
};

// Search venues with filters
export const searchVenues = async (filters: VenueFilters) => {
  const {
    city,
    capacityMin,
    capacityMax,
    priceMax,
    amenities,
    page = 1,
    limit = 10,
  } = filters;

  const conditions: string[] = ['is_active = true'];
  const params: any[] = [];
  let paramCount = 1;

  if (city) {
    conditions.push(`address->>'city' ILIKE $${paramCount}`);
    params.push(`%${city}%`);
    paramCount++;
  }

  if (capacityMin) {
    conditions.push(`capacity >= $${paramCount}`);
    params.push(capacityMin);
    paramCount++;
  }

  if (capacityMax) {
    conditions.push(`capacity <= $${paramCount}`);
    params.push(capacityMax);
    paramCount++;
  }

  if (priceMax) {
    conditions.push(`price_per_hour <= $${paramCount}`);
    params.push(priceMax);
    paramCount++;
  }

  if (amenities && amenities.length > 0) {
    conditions.push(`amenities @> $${paramCount}::jsonb`);
    params.push(JSON.stringify(amenities));
    paramCount++;
  }

  const offset = (page - 1) * limit;
  params.push(limit, offset);

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const result = await query(
    `SELECT * FROM venues
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT $${paramCount} OFFSET $${paramCount + 1}`,
    params
  );

  const countResult = await query(
    `SELECT COUNT(*) FROM venues ${whereClause}`,
    params.slice(0, -2)
  );

  return {
    venues: result.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
  };
};
