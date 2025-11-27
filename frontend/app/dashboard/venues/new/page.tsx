'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCreateVenue } from '@/lib/hooks/use-venues';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { CreateVenueData, Address } from '@/lib/types';

export default function NewVenuePage() {
  const router = useRouter();
  const { mutate: createVenue, isPending } = useCreateVenue();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    street: '',
    city: '',
    postcode: '',
    country: '',
    capacity: '',
    pricePerHour: '',
  });

  const [amenities, setAmenities] = useState<string[]>([]);
  const [currentAmenity, setCurrentAmenity] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const addAmenity = () => {
    if (currentAmenity.trim() && !amenities.includes(currentAmenity.trim())) {
      setAmenities([...amenities, currentAmenity.trim()]);
      setCurrentAmenity('');
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities(amenities.filter((a) => a !== amenity));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const addImageField = () => {
    setImages([...images, '']);
  };

  const removeImageField = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Venue name is required';
    }

    if (!formData.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.postcode.trim()) {
      newErrors.postcode = 'Postcode is required';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }

    const capacity = parseInt(formData.capacity);
    if (!formData.capacity || isNaN(capacity) || capacity <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }

    const price = parseFloat(formData.pricePerHour);
    if (!formData.pricePerHour || isNaN(price) || price <= 0) {
      newErrors.pricePerHour = 'Price must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const address: Address = {
      street: formData.street,
      city: formData.city,
      postcode: formData.postcode,
      country: formData.country,
    };

    const venueData: CreateVenueData = {
      name: formData.name,
      description: formData.description || undefined,
      address,
      capacity: parseInt(formData.capacity),
      pricePerHour: parseFloat(formData.pricePerHour),
      amenities,
      images: images.filter((img) => img.trim() !== ''),
    };

    createVenue(venueData, {
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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div>
                <Label htmlFor="name">
                  Venue Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Grand Conference Hall"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your venue..."
                  rows={4}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>

              <div>
                <Label htmlFor="street">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="123 Main Street"
                  className={errors.street ? 'border-destructive' : ''}
                />
                {errors.street && (
                  <p className="text-sm text-destructive mt-1">{errors.street}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="London"
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="postcode">
                    Postcode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="SW1A 1AA"
                    className={errors.postcode ? 'border-destructive' : ''}
                  />
                  {errors.postcode && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.postcode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="country">
                  Country <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="United Kingdom"
                  className={errors.country ? 'border-destructive' : ''}
                />
                {errors.country && (
                  <p className="text-sm text-destructive mt-1">{errors.country}</p>
                )}
              </div>
            </div>

            {/* Capacity & Pricing */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Capacity & Pricing</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="capacity">
                    Capacity <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="50"
                    min="1"
                    className={errors.capacity ? 'border-destructive' : ''}
                  />
                  {errors.capacity && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.capacity}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="pricePerHour">
                    Price per Hour (£) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pricePerHour"
                    name="pricePerHour"
                    type="number"
                    step="0.01"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    placeholder="100.00"
                    min="0"
                    className={errors.pricePerHour ? 'border-destructive' : ''}
                  />
                  {errors.pricePerHour && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.pricePerHour}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Amenities</h3>

              <div className="flex gap-2">
                <Input
                  value={currentAmenity}
                  onChange={(e) => setCurrentAmenity(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  placeholder="Add amenity (e.g., WiFi, Projector)"
                />
                <Button type="button" onClick={addAmenity} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(amenity)}
                        className="hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>

              {images.map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="Image URL"
                  />
                  {images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeImageField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              <Button type="button" onClick={addImageField} variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Image URL
              </Button>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create Venue'}
              </Button>
              <Link href="/dashboard/venues">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
