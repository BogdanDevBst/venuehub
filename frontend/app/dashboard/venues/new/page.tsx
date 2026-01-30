'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateVenue } from '@/lib/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VenueForm } from '@/components/venue-form';
import { ArrowLeft } from 'lucide-react';
import { CreateVenueFormData } from '@/lib/schemas/venue-schema';

export default function NewVenuePage() {
  const router = useRouter();
  const { mutate: createVenue, isPending } = useCreateVenue();

  const handleSubmit = (data: CreateVenueFormData) => {
    createVenue(data, {
      onSuccess: () => {
        router.push('/dashboard/venues');
      },
    });
  };

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
          <CardTitle>Create New Venue</CardTitle>
        </CardHeader>
        <CardContent>
          <VenueForm
            onSubmit={handleSubmit}
            isSubmitting={isPending}
            submitLabel="Create Venue"
          />
        </CardContent>
      </Card>
    </div>
  );
}
