'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ImageUpload } from '@/components/image-upload';
import { AmenitiesInput } from '@/components/amenities-input';
import { createVenueSchema, CreateVenueFormData } from '@/lib/schemas/venue-schema';
import { Venue } from '@/lib/types';

interface VenueFormProps {
  initialData?: Venue;
  onSubmit: (data: CreateVenueFormData) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const COUNTRIES = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Ireland',
];

export function VenueForm({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Create Venue',
}: VenueFormProps) {
  const form = useForm<CreateVenueFormData>({
    resolver: zodResolver(createVenueSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description || '',
          address: initialData.address,
          capacity: initialData.capacity,
          pricePerHour: initialData.price_per_hour,
          amenities: initialData.amenities || [],
          images: initialData.images || [],
        }
      : {
          name: '',
          description: '',
          address: {
            street: '',
            city: '',
            postcode: '',
            country: 'United Kingdom',
          },
          capacity: 0,
          pricePerHour: 0,
          amenities: [],
          images: [],
        },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Venue Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Grand Conference Hall" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your venue, its features, and what makes it special..."
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional but recommended to attract more bookings
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Address</h3>

          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Street Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="123 Main Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    City <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="London" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address.postcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Postcode <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="SW1A 1AA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Country <span className="text-destructive">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Capacity & Pricing */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Capacity & Pricing</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Capacity <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="50"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Maximum number of people</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pricePerHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Price per Hour (£) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Hourly rental rate</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Amenities</h3>
          <FormField
            control={form.control}
            name="amenities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Available Amenities</FormLabel>
                <FormControl>
                  <AmenitiesInput
                    amenities={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>
                  Add amenities to help customers find your venue
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Images */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Images</h3>
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Venue Photos</FormLabel>
                <FormControl>
                  <ImageUpload images={field.value} onChange={field.onChange} />
                </FormControl>
                <FormDescription>
                  Upload photos of your venue. The first image will be the primary photo.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4 border-t">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
