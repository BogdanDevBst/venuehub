export enum BookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled',
    COMPLETED = 'completed',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    REFUNDED = 'refunded',
    FAILED = 'failed',
}

export interface Booking {
    id: string;
    venue_id: string;
    customer_id: string;
    start_time: Date;
    end_time: Date;
    status: BookingStatus;
    total_amount: number;
    payment_status: PaymentStatus;
    stripe_payment_intent_id?: string;
    notes?: string;
    created_at: Date;
    updated_at: Date;
}

export interface CreateBookingData {
    venueId: string;
    startTime: Date;
    endTime: Date;
    notes?: string;
}

export interface UpdateBookingStatusData {
    status: BookingStatus;
}

export interface BookingWithDetails extends Booking {
    venue_name: string;
    venue_address: any;
    customer_first_name: string;
    customer_last_name: string;
    customer_email: string;
}
