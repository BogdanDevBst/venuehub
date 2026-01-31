'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useBooking, useUpdateBookingStatus, useCancelBooking } from '@/lib/hooks/use-bookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  CreditCard,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { data: booking, isLoading } = useBooking(bookingId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateBookingStatus();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">Booking not found</h3>
        <Link href="/dashboard/bookings">
          <Button variant="outline">Back to Bookings</Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: 'confirmed' | 'completed') => {
    updateStatus({ id: bookingId, data: { status } });
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      cancelBooking(bookingId);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/dashboard/bookings">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Bookings
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Booking Details
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ID: {booking.id}</span>
            <Badge
              variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'outline' : 'destructive'}
              className={
                  booking.status === 'confirmed' ? "bg-green-600 hover:bg-green-700" :
                  booking.status === 'pending' ? "bg-yellow-600 hover:bg-yellow-700 text-white border-0" :
                  booking.status === 'completed' ? "bg-blue-600 hover:bg-blue-700" :
                  ""
              }
            >
              {booking.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Actions based on status */}
        <div className="flex gap-2">
          {booking.status === 'pending' && (
            <>
              <Button 
                onClick={() => handleStatusChange('confirmed')} 
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Booking
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel} 
                disabled={isCancelling}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}

          {booking.status === 'confirmed' && (
            <>
              <Button 
                onClick={() => handleStatusChange('completed')} 
                disabled={isUpdating}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark Completed
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancel} 
                disabled={isCancelling}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel Booking
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Venue Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-muted-foreground" />
              Venue Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-lg">{booking.venue_name}</p>
              {booking.venue_address && (
                <p className="text-muted-foreground">
                  {booking.venue_address.street}, {booking.venue_address.city}
                </p>
              )}
            </div>
            <Link href={`/dashboard/venues/${booking.venue_id}`}>
              <Button variant="link" className="p-0 h-auto">
                View Venue Details
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-lg">
                {booking.customer_first_name} {booking.customer_last_name}
              </p>
              <p className="text-muted-foreground">{booking.customer_email}</p>
            </div>
            <Link href={`/dashboard/users/${booking.customer_id}`}>
              <Button variant="link" className="p-0 h-auto">
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Schedule & Payment */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
              Schedule & Payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-lg">
                      {format(new Date(booking.start_time), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-lg">
                      {format(new Date(booking.start_time), 'HH:mm')} -{' '}
                      {format(new Date(booking.end_time), 'HH:mm')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Total Amount</p>
                    <p className="text-2xl font-bold">
                      £{parseFloat(booking.total_amount.toString()).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">{booking.payment_status.toUpperCase()}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {booking.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{booking.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
