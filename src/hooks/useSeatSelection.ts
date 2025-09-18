import { useState, useCallback } from 'react';
import { Seat, SelectedSeat } from '@/types/venue';
import { getPriceForTier } from '@/utils/pricing';
import { useLocalStorage } from './useLocalStorage';

const MAX_SELECTED_SEATS = 8;
const STORAGE_KEY = 'selected-seats';

export function useSeatSelection() {
  const [selectedSeats, setSelectedSeats] = useLocalStorage<SelectedSeat[]>(STORAGE_KEY, []);
  const [focusedSeat, setFocusedSeat] = useState<string | null>(null);

  const isSelected = useCallback((seatId: string) => {
    return selectedSeats.some(seat => seat.id === seatId);
  }, [selectedSeats]);

  const canSelectMore = selectedSeats.length < MAX_SELECTED_SEATS;

  const selectSeat = useCallback((
    seat: Seat,
    sectionId: string,
    rowIndex: number
  ) => {
    if (seat.status !== 'available') return false;

    const isCurrentlySelected = isSelected(seat.id);
    
    if (isCurrentlySelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
      return true;
    } else if (canSelectMore) {
      const selectedSeat: SelectedSeat = {
        ...seat,
        sectionId,
        rowIndex,
        price: getPriceForTier(seat.priceTier),
      };
      setSelectedSeats([...selectedSeats, selectedSeat]);
      return true;
    }
    
    return false;
  }, [selectedSeats, isSelected, canSelectMore, setSelectedSeats]);

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
  }, [setSelectedSeats]);

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return {
    selectedSeats,
    focusedSeat,
    setFocusedSeat,
    isSelected,
    selectSeat,
    clearSelection,
    canSelectMore,
    totalPrice,
    maxSeats: MAX_SELECTED_SEATS,
  };
}
