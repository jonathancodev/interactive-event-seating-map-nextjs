'use client';

import React, { useState, useEffect } from 'react';
import { Venue, Seat, Section } from '@/types/venue';
import { SeatingMap } from '@/components/SeatingMap';
import { SeatDetails } from '@/components/SeatDetails';
import { SelectionSummary } from '@/components/SelectionSummary';
import { KeyboardInstructions } from '@/components/KeyboardInstructions';
import { useSeatSelection } from '@/hooks/useSeatSelection';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { generateLargeVenue } from '@/utils/generateVenueData';

// Performance monitor component
function PerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [renderTime, setRenderTime] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const measureFPS = () => {
      const currentTime = performance.now();
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      for (const entry of entries) {
        if (entry.entryType === 'measure') {
          setRenderTime(Math.round(entry.duration));
        }
      }
    });
    
    observer.observe({ entryTypes: ['measure'] });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-black text-white p-3 rounded-lg text-sm font-mono z-50">
      <div>FPS: {fps}</div>
      <div>Render: {renderTime}ms</div>
    </div>
  );
}

export default function Test15kPage() {
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [seatCount, setSeatCount] = useState(0);
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

  // Generate large venue data
  useEffect(() => {
    const loadVenue = async () => {
      try {
        performance.mark('venue-generation-start');
        const largeVenue = generateLargeVenue();
        performance.mark('venue-generation-end');
        performance.measure('venue-generation', 'venue-generation-start', 'venue-generation-end');
        
        // Count total seats
        let totalSeats = 0;
        largeVenue.sections.forEach(section => {
          section.rows.forEach(row => {
            totalSeats += row.seats.length;
          });
        });
        
        setSeatCount(totalSeats);
        setVenue(largeVenue);
      } catch (err) {
        console.error('Error generating venue:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVenue();
  }, []);

  // Update current seat details when focused seat changes
  useEffect(() => {
    if (!venue || !focusedSeat) {
      setCurrentSeat(null);
      return;
    }

    // Find the focused seat in the venue data
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

  // Enable keyboard navigation
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
          <p className="text-gray-600">Generating 15k seats venue...</p>
        </div>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to generate venue data</p>
      </div>
    );
  }

  const selectedSeatIds = selectedSeats.map(seat => seat.id);

  return (
    <>
      <PerformanceMonitor />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="text-center space-y-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Performance Test: 15k Seats
            </h1>
            <p className="text-gray-600">
              Testing with {seatCount.toLocaleString()} seats - Select up to {maxSeats} seats
            </p>
            <div className="flex justify-center gap-4">
              <KeyboardInstructions />
              <a 
                href="/" 
                className="text-blue-600 hover:text-blue-700 underline text-sm"
              >
                ← Back to Normal View
              </a>
            </div>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main seating map */}
            <div className="xl:col-span-3 order-2 xl:order-1">
              <SeatingMap
                venue={venue}
                selectedSeats={selectedSeatIds}
                focusedSeat={focusedSeat}
                onSeatSelect={handleSeatSelect}
                onSeatFocus={handleSeatFocus}
              />
            </div>

            {/* Sidebar with details and summary */}
            <div className="space-y-4 sm:space-y-6 order-1 xl:order-2">
              {/* Mobile: Show selection summary first */}
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

              {/* Desktop: Show selection summary after details */}
              <div className="hidden xl:block">
                <SelectionSummary
                  selectedSeats={selectedSeats}
                  totalPrice={totalPrice}
                  maxSeats={maxSeats}
                  onClearSelection={clearSelection}
                />
              </div>

              {/* Performance info */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Performance Info</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Total Seats: {seatCount.toLocaleString()}</div>
                  <div>Rendered Seats: {Math.min(seatCount, 20000).toLocaleString()}</div>
                  <div>Selected: {selectedSeats.length}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
