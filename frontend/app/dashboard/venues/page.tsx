'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useVenues, useDeleteVenue } from '@/lib/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search, MapPin, Users, Trash2, Edit, Eye } from 'lucide-react';

export default function VenuesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useVenues(page, 10);
  const { mutate: deleteVenue } = useDeleteVenue();

  const filteredVenues = data?.venues.filter((venue) =>
    venue.name.toLowerCase().includes(search.toLowerCase()) ||
    (typeof venue.address === 'object' && venue.address.city?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteVenue(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Venues</h1>
          <p className="text-muted-foreground">Manage your venue listings</p>
        </div>
        <Link href="/dashboard/venues/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Venue
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Venues Grid */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading venues...</p>
        </div>
      ) : filteredVenues && filteredVenues.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{venue.name}</CardTitle>
                  {venue.is_active ? (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Active
                    </span>
                  ) : (
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    {typeof venue.address === 'object' 
                      ? `${venue.address.city}, ${venue.address.country}`
                      : 'Unknown'}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    Capacity: {venue.capacity}
                  </div>
                  <div className="text-lg font-semibold text-primary">
                    £{venue.price_per_hour}/hour
                  </div>
                </div>

                {venue.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {venue.description}
                  </p>
                )}

                {/* Amenities */}
                {Array.isArray(venue.amenities) && venue.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{venue.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link href={`/dashboard/venues/${venue.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  <Link href={`/dashboard/venues/${venue.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(venue.id, venue.name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No venues found</h3>
            <p className="text-muted-foreground mb-4">
              {search ? 'Try a different search term' : 'Get started by adding your first venue'}
            </p>
            {!search && (
              <Link href="/dashboard/venues/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Venue
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
