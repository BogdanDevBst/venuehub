'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBookings } from '@/lib/hooks/use-bookings';
import { CalendarView } from '@/components/calendar-view';
import { Button } from '@/components/ui/button';
import { Plus, List, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function BookingsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBookings(page);

  const bookings = data?.bookings || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your venue bookings and schedule
          </p>
        </div>
        <Link href="/dashboard/bookings/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="calendar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="mr-2 h-4 w-4" />
            List
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          {isLoading ? (
            <div className="flex items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <CalendarView
              bookings={bookings}
              onSelectBooking={(booking) =>
                router.push(`/dashboard/bookings/${booking.id}`)
              }
            />
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                A list of all bookings across your venues.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No bookings found.
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/dashboard/bookings/${booking.id}`)
                      }
                    >
                      <div className="space-y-1">
                        <div className="font-semibold flex items-center gap-2">
                          {booking.venue_name}
                          <Badge
                            variant={
                              booking.status === 'confirmed'
                                ? 'default' // green-ish usually default or secondary
                                : booking.status === 'pending'
                                ? 'outline' // yellow-ish
                                : 'destructive' // red
                            }
                            className={
                                booking.status === 'confirmed' ? "bg-green-600 hover:bg-green-700" :
                                booking.status === 'pending' ? "bg-yellow-600 hover:bg-yellow-700 text-white border-0" :
                                booking.status === 'completed' ? "bg-blue-600 hover:bg-blue-700" :
                                ""
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {booking.customer_first_name} {booking.customer_last_name} •{' '}
                          {format(new Date(booking.start_time), 'MMM d, yyyy HH:mm')} -{' '}
                          {format(new Date(booking.end_time), 'HH:mm')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          £{parseFloat(booking.total_amount.toString()).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {booking.payment_status}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination could be added here */}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
