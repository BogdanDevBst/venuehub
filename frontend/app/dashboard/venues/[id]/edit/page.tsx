'use client';

import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useVenue, useUpdateVenue } from '@/lib/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueForm } from '@/components/venue-form';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { CreateVenueFormData } from '@/lib/schemas/venue-schema';

export default function EditVenuePage() {
  const router = useRouter();
  const params = useParams();
  const venueId = params.id as string;

  const { data: venue, isLoading } = useVenue(venueId);
  const { mutate: updateVenue, isPending } = useUpdateVenue();

  const handleSubmit = (data: CreateVenueFormData) => {
    updateVenue(
      { id: venueId, data },
      {
        onSuccess: () => {
          router.push('/dashboard/venues');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Venue not found</p>
        <Link href="/dashboard/venues">
          <Button className="mt-4">Back to Venues</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/venues">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Venue: {venue.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <VenueForm
            initialData={venue}
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Update Venue"
          />
        </CardContent>
      </Card>
    </div>
  );
}
