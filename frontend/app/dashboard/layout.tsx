'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useLogout } from '@/lib/hooks/use-auth';
import { Building2, LayoutDashboard, Calendar, Settings, LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Only redirect if we are sure the user is not authenticated (after hydration)
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  // Show loading state while waiting for hydration
  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Venues', href: '/dashboard/venues', icon: Building2 },
    { name: 'Bookings', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="ml-2 text-xl font-bold">VenueHub</span>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col p-4 border-t">
            <div className="mb-3">
              <p className="text-sm font-medium">{user?.first_name} {user?.last_name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-1 inline-block">
                {user?.role}
              </span>
            </div>
            <Button variant="outline" onClick={logout} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
            <div className="flex items-center h-16 px-4 border-b">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">VenueHub</span>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t">
              <Button variant="outline" onClick={logout} className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="md:pl-64">
        <header className="bg-white border-b md:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <Building2 className="h-8 w-8 text-primary" />
            <div className="w-10" />
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
