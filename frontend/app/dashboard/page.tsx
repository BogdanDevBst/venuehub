'use client';

import { useVenues } from '@/lib/hooks/use-venues';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, TrendingUp, Users } from 'lucide-react';

export default function DashboardPage() {
  const { data: venuesData } = useVenues(1, 100);

  const stats = [
    {
      name: 'Total Venues',
      value: venuesData?.total || 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Bookings',
      value: '0',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Monthly Revenue',
      value: '£0',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Total Customers',
      value: '0',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.name}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-full`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Venues</CardTitle>
          </CardHeader>
          <CardContent>
            {venuesData?.venues && venuesData.venues.length > 0 ? (
              <div className="space-y-4">
                {venuesData.venues.slice(0, 5).map((venue) => (
                  <div key={venue.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{venue.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {typeof venue.address === 'object' ? venue.address.city : 'Unknown'}
                      </p>
                    </div>
                    <span className="text-sm font-medium">£{venue.price_per_hour}/hr</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No venues yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              No upcoming bookings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
