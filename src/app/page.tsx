'use client';

import React, { useState, useEffect } from 'react';
import { Venue, Seat, Section } from '@/types/venue';
import { SeatingMap } from '@/components/SeatingMap';
import { SeatDetails } from '@/components/SeatDetails';
import { SelectionSummary } from '@/components/SelectionSummary';
import { KeyboardInstructions } from '@/components/KeyboardInstructions';
import { useSeatSelection } from '@/hooks/useSeatSelection';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';

export default function Home() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSeat, setCurrentSeat] = useState<{
    seat: Seat;
    section: Section;
    rowIndex: number;
  } | null>(null);

  const {
    selectedSeats,
    focusedSeat,
    setFocusedSeat,
    isSelected,
    selectSeat,
    clearSelection,
    canSelectMore,
    totalPrice,
    maxSeats,
  } = useSeatSelection();

  useEffect(() => {
    const loadVenue = async () => {
      try {
        const response = await fetch('/venue.json');
        if (!response.ok) {
          throw new Error('Failed to load venue data');
        }
        const venueData: Venue = await response.json();
        setVenue(venueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, []);

  useEffect(() => {
    if (!venue || !focusedSeat) {
      setCurrentSeat(null);
      return;
    }

    for (const section of venue.sections) {
      for (const row of section.rows) {
        const seat = row.seats.find(s => s.id === focusedSeat);
        if (seat) {
          setCurrentSeat({ seat, section, rowIndex: row.index });
          return;
        }
      }
    }
  }, [venue, focusedSeat]);

  const handleSeatSelect = (seat: Seat, sectionId: string, rowIndex: number) => {
    const success = selectSeat(seat, sectionId, rowIndex);
    if (!success && !isSelected(seat.id) && !canSelectMore) {
      alert(`You can only select up to ${maxSeats} seats.`);
    }
  };

  const handleSeatFocus = (seatId: string | null) => {
    setFocusedSeat(seatId);
  };

  useKeyboardNavigation({
    venue,
    focusedSeat,
    onSeatFocus: handleSeatFocus,
    onSeatSelect: handleSeatSelect,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading venue...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No venue data available</p>
      </div>
    );
  }

  const selectedSeatIds = selectedSeats.map(seat => seat.id);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Interactive Event Seating
          </h1>
          <p className="text-gray-600">
            Select up to {maxSeats} seats for your event
          </p>
          <div className="flex justify-center gap-4">
            <KeyboardInstructions />
            <a 
              href="/test-15k" 
              className="text-blue-600 hover:text-blue-700 underline text-sm"
            >
              Test 15k Seats Performance →
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 order-2 xl:order-1">
            <SeatingMap
              venue={venue}
              selectedSeats={selectedSeatIds}
              focusedSeat={focusedSeat}
              onSeatSelect={handleSeatSelect}
              onSeatFocus={handleSeatFocus}
            />
          </div>

          <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
            <div className="block xl:hidden">
              <SelectionSummary
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                maxSeats={maxSeats}
                onClearSelection={clearSelection}
              />
            </div>
            
            <SeatDetails
              seat={currentSeat?.seat ?? null}
              section={currentSeat?.section ?? null}
              rowIndex={currentSeat?.rowIndex ?? null}
              isSelected={currentSeat ? isSelected(currentSeat.seat.id) ?? false : false}
            />

            <div className="hidden xl:block">
              <SelectionSummary
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
                maxSeats={maxSeats}
                onClearSelection={clearSelection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
