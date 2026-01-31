'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyBookings } from '@/lib/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: bookings, isLoading } = useMyBookings();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          <p className="text-muted-foreground">
            View and manage your upcoming reservations
          </p>
        </div>
        <Link href="/dashboard/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Book a Venue
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Reservations</CardTitle>
          <CardDescription>History of all your venue bookings.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You haven't made any bookings yet.</p>
              <Link href="/dashboard/bookings/new">
                <Button variant="outline">Browse Venues</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer gap-4"
                  onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
                >
                  <div className="space-y-1">
                    <div className="font-semibold flex items-center gap-2">
                      {booking.venue_name}
                      <Badge
                        className={
                          booking.status === 'confirmed' ? "bg-green-600" :
                          booking.status === 'pending' ? "bg-yellow-600" :
                          booking.status === 'completed' ? "bg-blue-600" :
                          "bg-destructive"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(booking.start_time), 'MMM d, yyyy • HH:mm')} -{' '}
                      {format(new Date(booking.end_time), 'HH:mm')}
                    </div>
                    {booking.venue_address && (
                      <div className="text-xs text-muted-foreground">
                        {booking.venue_address.street}, {booking.venue_address.city}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                    <div className="font-bold text-lg">
                      £{parseFloat(booking.total_amount.toString()).toFixed(2)}
                    </div>
                    <Button variant="ghost" size="sm" className="hidden md:flex">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
