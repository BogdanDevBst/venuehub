'use client';

import { useState } from 'react';
import { Calendar, dateFnsLocalizer, View, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enGB } from 'date-fns/locale'; // Use enGB for Monday start if desired, or enUS
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingWithDetails } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Setup localizer
const locales = {
  'en-GB': enGB,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarViewProps {
  bookings: BookingWithDetails[];
  onSelectBooking?: (booking: BookingWithDetails) => void;
  className?: string;
}

export function CalendarView({ bookings, onSelectBooking, className }: CalendarViewProps) {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());

  // Transform bookings to calendar events
  const events = bookings.map((booking) => ({
    id: booking.id,
    title: `${booking.venue_name} - ${booking.customer_first_name} ${booking.customer_last_name}`,
    start: new Date(booking.start_time),
    end: new Date(booking.end_time),
    resource: booking,
  }));

  const getEventStyle = (event: any) => {
    const booking = event.resource as BookingWithDetails;
    let backgroundColor = '#3788d8'; // default blue

    switch (booking.status) {
      case 'confirmed':
        backgroundColor = '#16a34a'; // green-600
        break;
      case 'pending':
        backgroundColor = '#ca8a04'; // yellow-600
        break;
      case 'cancelled':
        backgroundColor = '#dc2626'; // red-600
        break;
      case 'completed':
        backgroundColor = '#2563eb'; // blue-600
        break;
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    };
  };

  return (
    <Card className={cn('h-[600px] flex flex-col', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>Bookings Calendar</span>
          <div className="flex gap-2 text-sm font-normal">
            <Badge className="bg-green-600 hover:bg-green-700">Confirmed</Badge>
            <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending</Badge>
            <Badge className="bg-red-600 hover:bg-red-700">Cancelled</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={getEventStyle}
          onSelectEvent={(event) => onSelectBooking?.(event.resource)}
          views={['month', 'week', 'day', 'agenda']}
          popup
        />
      </CardContent>
    </Card>
  );
}
