import { useEffect, useCallback } from 'react';
import { Venue, Seat } from '@/types/venue';

interface UseKeyboardNavigationProps {
  venue: Venue | null;
  focusedSeat: string | null;
  onSeatFocus: (seatId: string | null) => void;
  onSeatSelect: (seat: Seat, sectionId: string, rowIndex: number) => void;
}

export function useKeyboardNavigation({
  venue,
  focusedSeat,
  onSeatFocus,
  onSeatSelect,
}: UseKeyboardNavigationProps) {
  const findSeatById = useCallback((seatId: string) => {
    if (!venue) return null;
    
    for (const section of venue.sections) {
      for (const row of section.rows) {
        const seat = row.seats.find(s => s.id === seatId);
        if (seat) {
          return { seat, section, row };
        }
      }
    }
    return null;
  }, [venue]);

  const getAvailableSeats = useCallback(() => {
    if (!venue) return [];
    
    const seats: Array<{ seat: Seat; sectionId: string; rowIndex: number }> = [];
    venue.sections.forEach(section => {
      section.rows.forEach(row => {
        row.seats.forEach(seat => {
          if (seat.status === 'available') {
            seats.push({
              seat,
              sectionId: section.id,
              rowIndex: row.index,
            });
          }
        });
      });
    });
    return seats;
  }, [venue]);

  const findNextSeat = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (!venue || !focusedSeat) return null;
    
    const currentSeatData = findSeatById(focusedSeat);
    if (!currentSeatData) return null;
    
    const { seat: currentSeat, section: currentSection, row: currentRow } = currentSeatData;
    
    let targetSeat = null;
    
    switch (direction) {
      case 'left': {
        const leftSeat = currentRow.seats.find(s => 
          s.col === currentSeat.col - 1 && s.status === 'available'
        );
        if (leftSeat) {
          targetSeat = { seat: leftSeat, sectionId: currentSection.id, rowIndex: currentRow.index };
        }
        break;
      }
      case 'right': {
        const rightSeat = currentRow.seats.find(s => 
          s.col === currentSeat.col + 1 && s.status === 'available'
        );
        if (rightSeat) {
          targetSeat = { seat: rightSeat, sectionId: currentSection.id, rowIndex: currentRow.index };
        }
        break;
      }
      case 'up': {
        const upperRow = currentSection.rows.find(r => r.index === currentRow.index - 1);
        if (upperRow) {
          const upperSeat = upperRow.seats.find(s => 
            s.col === currentSeat.col && s.status === 'available'
          ) || upperRow.seats.find(s => s.status === 'available');
          if (upperSeat) {
            targetSeat = { seat: upperSeat, sectionId: currentSection.id, rowIndex: upperRow.index };
          }
        }
        break;
      }
      case 'down': {
        const lowerRow = currentSection.rows.find(r => r.index === currentRow.index + 1);
        if (lowerRow) {
          const lowerSeat = lowerRow.seats.find(s => 
            s.col === currentSeat.col && s.status === 'available'
          ) || lowerRow.seats.find(s => s.status === 'available');
          if (lowerSeat) {
            targetSeat = { seat: lowerSeat, sectionId: currentSection.id, rowIndex: lowerRow.index };
          }
        }
        break;
      }
    }
    
    return targetSeat;
  }, [venue, focusedSeat, findSeatById]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!venue) return;
      
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement ||
          event.target instanceof HTMLSelectElement) {
        return;
      }
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'ArrowDown': {
          event.preventDefault();
          
          if (!focusedSeat) {
            const availableSeats = getAvailableSeats();
            if (availableSeats.length > 0) {
              onSeatFocus(availableSeats[0].seat.id);
            }
            return;
          }
          
          const direction = event.key === 'ArrowLeft' ? 'left' :
                           event.key === 'ArrowRight' ? 'right' :
                           event.key === 'ArrowUp' ? 'up' : 'down';
          
          const nextSeat = findNextSeat(direction);
          if (nextSeat) {
            onSeatFocus(nextSeat.seat.id);
          }
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (focusedSeat) {
            const seatData = findSeatById(focusedSeat);
            if (seatData && seatData.seat.status === 'available') {
              onSeatSelect(seatData.seat, seatData.section.id, seatData.row.index);
            }
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          onSeatFocus(null);
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [venue, focusedSeat, onSeatFocus, onSeatSelect, findSeatById, findNextSeat, getAvailableSeats]);
}
