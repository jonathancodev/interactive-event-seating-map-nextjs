import React, { memo } from 'react';
import { Seat as SeatType, SeatStatus } from '@/types/venue';

interface SeatProps {
  seat: SeatType;
  sectionId: string;
  rowIndex: number;
  isSelected: boolean;
  isFocused: boolean;
  onSelect: (seat: SeatType, sectionId: string, rowIndex: number) => void;
  onFocus: (seatId: string | null) => void;
  transform: { x: number; y: number; scale: number };
}

const getSeatColor = (status: SeatStatus, isSelected: boolean): string => {
  if (isSelected) return '#3B82F6'; // blue-500
  
  switch (status) {
    case 'available':
      return '#10B981'; // emerald-500
    case 'reserved':
      return '#F59E0B'; // amber-500
    case 'sold':
      return '#EF4444'; // red-500
    case 'held':
      return '#8B5CF6'; // violet-500
    default:
      return '#6B7280'; // gray-500
  }
};

const getSeatLabel = (seat: SeatType, sectionId: string, rowIndex: number): string => {
  return `Section ${sectionId}, Row ${rowIndex}, Seat ${seat.col}, ${seat.status}`;
};

export const Seat = memo<SeatProps>(({
  seat,
  sectionId,
  rowIndex,
  isSelected,
  isFocused,
  onSelect,
  onFocus,
  transform,
}) => {
  const isClickable = seat.status === 'available';
  const seatColor = getSeatColor(seat.status, isSelected);
  const actualX = (seat.x * transform.scale) + transform.x;
  const actualY = (seat.y * transform.scale) + transform.y;
  
  const handleClick = () => {
    if (isClickable) {
      onSelect(seat, sectionId, rowIndex);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (isClickable) {
        onSelect(seat, sectionId, rowIndex);
      }
    }
  };

  const handleFocus = () => {
    onFocus(seat.id);
  };

  const handleBlur = () => {
    onFocus(null);
  };

  return (
    <circle
      cx={actualX}
      cy={actualY}
      r={8}
      fill={seatColor}
      stroke={isFocused ? '#1F2937' : 'transparent'}
      strokeWidth={isFocused ? 2 : 0}
      className={`${isClickable ? 'cursor-pointer' : 'cursor-not-allowed'} transition-all duration-200 hover:opacity-80`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      tabIndex={isClickable ? 0 : -1}
      aria-label={getSeatLabel(seat, sectionId, rowIndex)}
      aria-pressed={isSelected}
      role="button"
    />
  );
});

Seat.displayName = 'Seat';
