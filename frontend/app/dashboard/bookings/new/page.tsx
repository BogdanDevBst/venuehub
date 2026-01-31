'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateBooking } from '@/lib/hooks/use-bookings';
import { useVenues } from '@/lib/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookingForm } from '@/components/booking-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CreateBookingFormData } from '@/lib/schemas/booking-schema';

export default function NewBookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const venueId = searchParams.get('venueId') || undefined;
  
  const { data: venuesData, isLoading: isLoadingVenues } = useVenues();
  const { mutate: createBooking, isPending } = useCreateBooking();
  
  const bookings = venuesData?.venues || [];

  const handleSubmit = (data: CreateBookingFormData) => {
    createBooking(
      {
        venueId: data.venueId,
        startTime: data.startTime.toISOString(),
        endTime: data.endTime.toISOString(),
        notes: data.notes,
      },
      {
        onSuccess: () => {
          router.push('/dashboard/bookings');
        },
      }
    );
  };

  if (isLoadingVenues) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/bookings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create New Booking</CardTitle>
          </CardHeader>
          <CardContent>
            <BookingForm
              venues={bookings}
              selectedVenueId={venueId}
              onSubmit={handleSubmit}
              isSubmitting={isPending}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
