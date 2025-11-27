import { query } from '../../database/client';
import { createNotFoundError, createValidationError } from '../../utils/errors';

export interface Address {
    street: string;
    city: string;
    postcode: string;
    country: string;
}

export interface CreateVenueData {
    tenantId: string;
    createdBy: string;
    name: string;
    description?: string;
    address: Address;
    capacity: number;
    pricePerHour: number;
    amenities: string[];
    images: string[];
}

export interface UpdateVenueData {
    name?: string;
    description?: string;
    address?: Address;
    capacity?: number;
    pricePerHour?: number;
    amenities?: string[];
    images?: string[];
    isActive?: boolean;
}

// Create venue
export const createVenue = async (data: CreateVenueData) => {
    const {
        tenantId,
        createdBy,
        name,
        description,
        address,
        capacity,
        pricePerHour,
        amenities,
        images,
    } = data;

    if (!name || name.trim().length === 0) {
        throw createValidationError('Venue name is required');
    }

    if (capacity <= 0) {
        throw createValidationError('Capacity must be greater than 0');
    }

    if (pricePerHour < 0) {
        throw createValidationError('Price per hour cannot be negative');
    }

    const result = await query(
        `INSERT INTO venues (
      tenant_id, created_by, name, description, address, capacity, 
      price_per_hour, amenities, images
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *`,
        [
            tenantId,
            createdBy,
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
export const getVenueById = async (id: string, tenantId: string) => {
    const result = await query(
        'SELECT * FROM venues WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
    );

    if (result.rows.length === 0) {
        throw createNotFoundError('Venue not found');
    }

    return result.rows[0];
};

// List venues
export const listVenues = async (
    tenantId: string,
    page: number = 1,
    limit: number = 10
) => {
    const offset = (page - 1) * limit;

    const countResult = await query(
        'SELECT COUNT(*) FROM venues WHERE tenant_id = $1',
        [tenantId]
    );

    const venuesResult = await query(
        `SELECT * FROM venues 
     WHERE tenant_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2 OFFSET $3`,
        [tenantId, limit, offset]
    );

    return {
        venues: venuesResult.rows,
        total: parseInt(countResult.rows[0].count),
        page,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    };
};

// Update venue
export const updateVenue = async (
    id: string,
    tenantId: string,
    data: UpdateVenueData
) => {
    // Check if venue exists
    await getVenueById(id, tenantId);

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (data.name !== undefined) {
        updates.push(`name = $${paramCount}`);
        values.push(data.name);
        paramCount++;
    }

    if (data.description !== undefined) {
        updates.push(`description = $${paramCount}`);
        values.push(data.description);
        paramCount++;
    }

    if (data.address !== undefined) {
        updates.push(`address = $${paramCount}`);
        values.push(JSON.stringify(data.address));
        paramCount++;
    }

    if (data.capacity !== undefined) {
        if (data.capacity <= 0) {
            throw createValidationError('Capacity must be greater than 0');
        }
        updates.push(`capacity = $${paramCount}`);
        values.push(data.capacity);
        paramCount++;
    }

    if (data.pricePerHour !== undefined) {
        if (data.pricePerHour < 0) {
            throw createValidationError('Price per hour cannot be negative');
        }
        updates.push(`price_per_hour = $${paramCount}`);
        values.push(data.pricePerHour);
        paramCount++;
    }

    if (data.amenities !== undefined) {
        updates.push(`amenities = $${paramCount}`);
        values.push(JSON.stringify(data.amenities));
        paramCount++;
    }

    if (data.images !== undefined) {
        updates.push(`images = $${paramCount}`);
        values.push(JSON.stringify(data.images));
        paramCount++;
    }

    if (data.isActive !== undefined) {
        updates.push(`is_active = $${paramCount}`);
        values.push(data.isActive);
        paramCount++;
    }

    if (updates.length === 0) {
        return getVenueById(id, tenantId);
    }

    updates.push(`updated_at = NOW()`);

    // Add id and tenantId to values for WHERE clause
    values.push(id);
    values.push(tenantId);

    const result = await query(
        `UPDATE venues 
     SET ${updates.join(', ')} 
     WHERE id = $${paramCount} AND tenant_id = $${paramCount + 1}
     RETURNING *`,
        values
    );

    return result.rows[0];
};

export interface VenueFilters {
    city?: string;
    capacityMin?: number;
    capacityMax?: number;
    priceMax?: number;
    amenities?: string[];
    page?: number;
    limit?: number;
}

// Delete venue
export const deleteVenue = async (id: string, tenantId: string) => {
    // Check if venue exists
    await getVenueById(id, tenantId);

    await query(
        'DELETE FROM venues WHERE id = $1 AND tenant_id = $2',
        [id, tenantId]
    );
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
