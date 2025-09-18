import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { Venue, Seat as SeatType } from '@/types/venue';
import { Seat } from './Seat';

interface SeatingMapProps {
  venue: Venue;
  selectedSeats: string[];
  focusedSeat: string | null;
  onSeatSelect: (seat: SeatType, sectionId: string, rowIndex: number) => void;
  onSeatFocus: (seatId: string | null) => void;
}

export function SeatingMap({ 
  venue, 
  selectedSeats, 
  focusedSeat, 
  onSeatSelect, 
  onSeatFocus 
}: Readonly<SeatingMapProps>) {
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const selectedSeatsSet = useMemo(() => new Set(selectedSeats), [selectedSeats]);

  const allSeats = useMemo(() => {
    const seats: React.ReactNode[] = [];
    let seatCount = 0;
    
    venue.sections.forEach((section) => {
      section.rows.forEach((row) => {
        row.seats.forEach((seat) => {
          if (seatCount < 20000) {
            seats.push(
              <Seat
                key={seat.id}
                seat={seat}
                sectionId={section.id}
                rowIndex={row.index}
                isSelected={selectedSeatsSet.has(seat.id)}
                isFocused={focusedSeat === seat.id}
                onSelect={onSeatSelect}
                onFocus={onSeatFocus}
                transform={section.transform}
              />
            );
          }
          seatCount++;
        });
      });
    });
    
    return seats;
  }, [venue.sections, selectedSeatsSet, focusedSeat, onSeatSelect, onSeatFocus]);

  const handleZoomIn = useCallback(() => {
    setScale(prevScale => Math.min(prevScale * 1.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prevScale => Math.max(prevScale / 1.5, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1);
    setPanOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleDocumentMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y
        });
        e.preventDefault();
      }
    };

    const handleDocumentMouseUp = () => {
      setIsPanning(false);
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, [isPanning, panStart]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const target = e.target as Element;
      if (target.tagName !== 'circle') {
        const touch = e.touches[0];
        setIsPanning(true);
        setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
        e.preventDefault();
      }
    }
  }, [panOffset]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      const touch = e.touches[0];
      setPanOffset({
        x: touch.clientX - panStart.x,
        y: touch.clientY - panStart.y
      });
      e.preventDefault();
    }
  }, [isPanning, panStart]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-gray-900">{venue.name}</h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-black text-sm"
              aria-label="Zoom out"
            >
              -
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-black text-sm"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 text-black text-sm ml-2"
              aria-label="Reset zoom and pan"
            >
              Reset
            </button>
          </div>
        </div>
        
        <div className="text-xs text-center mt-2">
          <span className={isPanning ? "text-blue-600 font-medium" : "text-gray-500"}>
            {isPanning ? "🔄 Panning..." : "💡 Click and drag to pan • Use zoom controls for better view"}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-gray-700">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-gray-700">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-gray-700">Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-violet-500"></div>
            <span className="text-gray-700">Held</span>
          </div>
        </div>

        <div 
          className="w-full max-w-4xl border border-gray-300 rounded bg-white relative"
          style={{ 
            height: '600px',
            overflow: 'hidden'
          }}
        >
          <div 
            className="w-full h-full"
            style={{ 
              touchAction: 'none',
              transform: `scale(${scale}) translate(${panOffset.x / scale}px, ${panOffset.y / scale}px)`, 
              transformOrigin: 'top left',
              minWidth: `${venue.map.width}px`,
              minHeight: `${venue.map.height}px`,
              position: 'relative'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <svg
              width={venue.map.width}
              height={venue.map.height}
              className="block"
              aria-label={`Seating map for ${venue.name}`}
            >
              <rect
                x={0}
                y={0}
                width={venue.map.width}
                height={venue.map.height}
                fill="transparent"
                style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
                onMouseDown={(e) => {
                  setIsPanning(true);
                  setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
                  e.preventDefault();
                }}
              />
              
              <rect
                x={venue.map.width * 0.25}
                y={10}
                width={venue.map.width * 0.5}
                height={40}
                fill="#374151"
                rx={8}
              />
              <text
                x={venue.map.width * 0.5}
                y={35}
                textAnchor="middle"
                className="fill-white text-lg font-bold"
                style={{ fontSize: '16px' }}
              >
                STAGE
              </text>
            
            {allSeats}
            
            {venue.sections.map((section) => (
              <text
                key={`label-${section.id}`}
                x={section.transform.x + 100}
                y={section.transform.y + 65}
                className="fill-gray-600 text-sm font-medium"
                textAnchor="middle"
              >
                {section.label}
              </text>
            ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
