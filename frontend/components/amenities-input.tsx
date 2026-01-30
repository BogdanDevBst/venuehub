'use client';

import React, { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AmenitiesInputProps {
  amenities: string[];
  onChange: (amenities: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  'WiFi',
  'Projector',
  'Whiteboard',
  'Parking',
  'Air Conditioning',
  'Kitchen',
  'Sound System',
  'Stage',
  'Microphone',
  'Video Conferencing',
  'Catering',
  'Accessible',
];

export function AmenitiesInput({
  amenities,
  onChange,
  suggestions = DEFAULT_SUGGESTIONS,
  placeholder = 'Add amenity (e.g., WiFi, Projector)',
  className,
}: AmenitiesInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      !amenities.includes(suggestion) &&
      suggestion.toLowerCase().includes(inputValue.toLowerCase())
  );

  const addAmenity = (amenity: string) => {
    const trimmed = amenity.trim();
    if (trimmed && !amenities.includes(trimmed)) {
      onChange([...amenities, trimmed]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    onChange(amenities.filter((a) => a !== amenityToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addAmenity(inputValue);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setShowSuggestions(value.length > 0);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Input with Add Button */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(inputValue.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder={placeholder}
            />

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                {filteredSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addAmenity(suggestion)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="button"
            onClick={() => addAmenity(inputValue)}
            variant="outline"
            size="icon"
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Selected Amenities */}
      {amenities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {amenities.map((amenity) => (
            <Badge
              key={amenity}
              variant="secondary"
              className="pl-3 pr-1 py-1 gap-1 text-sm"
            >
              {amenity}
              <button
                type="button"
                onClick={() => removeAmenity(amenity)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Quick Add Suggestions */}
      {amenities.length === 0 && !inputValue && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 6).map((suggestion) => (
              <Button
                key={suggestion}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addAmenity(suggestion)}
                className="h-7 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
