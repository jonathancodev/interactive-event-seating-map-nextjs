import React from 'react';
import { SelectedSeat } from '@/types/venue';

interface SelectionSummaryProps {
  selectedSeats: SelectedSeat[];
  totalPrice: number;
  maxSeats: number;
  onClearSelection: () => void;
}

export function SelectionSummary({ 
  selectedSeats, 
  totalPrice, 
  maxSeats, 
  onClearSelection 
}: Readonly<SelectionSummaryProps>) {
  const seatCount = selectedSeats.length;
  const remainingSeats = maxSeats - seatCount;

  if (seatCount === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">Selection Summary</h3>
        <p className="text-sm text-gray-600">
          No seats selected. You can select up to {maxSeats} seats.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Selection Summary</h3>
        <button
          onClick={onClearSelection}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
          aria-label="Clear all selected seats"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Selected Seats:</span>
          <span className="font-medium text-gray-900">
            {seatCount} of {maxSeats}
          </span>
        </div>
        
        {remainingSeats > 0 && (
          <p className="text-xs text-gray-500">
            You can select {remainingSeats} more seat{remainingSeats !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="border-t pt-3">
        <div className="max-h-32 overflow-y-auto space-y-1">
          {selectedSeats.map((seat) => (
            <div key={seat.id} className="flex justify-between text-xs">
              <span className="text-gray-600">
                {seat.sectionId}-{seat.rowIndex}-{seat.col.toString().padStart(2, '0')}
              </span>
              <span className="font-medium text-gray-900">${seat.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-3">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-900">Total:</span>
          <span className="text-xl font-bold text-gray-900">${totalPrice}</span>
        </div>
      </div>

      {seatCount > 0 && (
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
          aria-label={`Proceed with ${seatCount} selected seats totaling $${totalPrice}`}
        >
          Continue to Checkout
        </button>
      )}
    </div>
  );
}
