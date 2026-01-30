'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useVenue, useDeleteVenue } from '@/lib/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Loader2,
  Building2,
} from 'lucide-react';

export default function VenueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.id as string;

  const { data: venue, isLoading } = useVenue(venueId);
  const { mutate: deleteVenue } = useDeleteVenue();

  const handleDelete = () => {
    if (venue && confirm(`Are you sure you want to delete "${venue.name}"?`)) {
      deleteVenue(venueId, {
        onSuccess: () => {
          router.push('/dashboard/venues');
        },
      });
    }
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
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Venue not found</h3>
        <Link href="/dashboard/venues">
          <Button className="mt-4">Back to Venues</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link href="/dashboard/venues">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Venues
          </Button>
        </Link>
      </div>

      {/* Title and Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{venue.name}</h1>
          {venue.is_active ? (
            <Badge variant="default">Active</Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/venues/${venueId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {venue.images && venue.images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border bg-muted"
                    >
                      <img
                        src={image}
                        alt={`${venue.name} - Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                          Primary
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {venue.description && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {venue.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Amenities */}
          {venue.amenities && venue.amenities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {venue.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Price per Hour</p>
                  <p className="text-2xl font-bold text-primary">
                    £{venue.price_per_hour}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacity</p>
                  <p className="text-lg font-semibold">{venue.capacity} people</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="text-sm">
                  <p>{venue.address.street}</p>
                  <p>
                    {venue.address.city}, {venue.address.postcode}
                  </p>
                  <p className="text-muted-foreground">{venue.address.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{new Date(venue.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{new Date(venue.updated_at).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
