'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addHours } from 'date-fns';
import { Loader2, CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createBookingSchema, CreateBookingFormData } from '@/lib/schemas/booking-schema';
import { useCheckAvailability } from '@/lib/hooks/use-bookings';
import { Venue } from '@/lib/types';
import { cn } from '@/lib/utils'; // Assuming you have a utils file

interface BookingFormProps {
  venues: Venue[]; // List of venues for dropdown
  selectedVenueId?: string; // Pre-selected venue
  onSubmit: (data: CreateBookingFormData) => void;
  isSubmitting?: boolean;
}

export function BookingForm({
  venues,
  selectedVenueId,
  onSubmit,
  isSubmitting = false,
}: BookingFormProps) {
  const { mutateAsync: checkAvailability, isPending: isChecking } = useCheckAvailability();
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const form = useForm<CreateBookingFormData>({
    resolver: zodResolver(createBookingSchema),
    defaultValues: {
      venueId: selectedVenueId || '',
      // Default to next hour
      startTime: addHours(new Date(), 1),
      endTime: addHours(new Date(), 3), // Default 2 hours duration
      notes: '',
    },
  });

  const handleSubmit = async (data: CreateBookingFormData) => {
    setAvailabilityError(null);

    // Double check availability before submitting
    try {
      const isAvailable = await checkAvailability({
        venueId: data.venueId,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
      });

      if (!isAvailable) {
        setAvailabilityError('This time slot is no longer available. Please choose another time.');
        return;
      }

      onSubmit(data);
    } catch (error) {
      setAvailabilityError('Failed to verify availability. Please try again.');
    }
  };

  // Helper to calculate estimated price
  const selectedVenue = venues.find((v) => v.id === form.watch('venueId'));
  const startTime = form.watch('startTime');
  const endTime = form.watch('endTime');
  
  const estimatedPrice =
    selectedVenue && startTime && endTime
      ? (() => {
          const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
          return duration > 0 ? (duration * selectedVenue.price_per_hour).toFixed(2) : '0.00';
        })()
      : '0.00';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Venue Selection */}
        <FormField
          control={form.control}
          name="venueId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!selectedVenueId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a venue" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue.id} value={venue.id}>
                      {venue.name} (£{venue.price_per_hour}/hr)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(date);
                    }}
                    min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ''}
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(date);
                    }}
                    min={
                      form.watch('startTime')
                        ? format(form.watch('startTime'), "yyyy-MM-dd'T'HH:mm")
                        : format(new Date(), "yyyy-MM-dd'T'HH:mm")
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Price Preview */}
        {selectedVenue && (
          <div className="bg-muted p-4 rounded-md flex justify-between items-center">
            <span className="text-sm font-medium">Estimated Total:</span>
            <span className="text-xl font-bold">£{estimatedPrice}</span>
          </div>
        )}

        {/* Availability Error */}
        {availabilityError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
            {availabilityError}
          </div>
        )}

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Special requests or event details..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting || isChecking}>
          {isSubmitting || isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Create Booking'
          )}
        </Button>
      </form>
    </Form>
  );
}
