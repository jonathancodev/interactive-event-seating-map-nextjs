import React from 'react';
import { Seat, Section } from '@/types/venue';
import { getPriceForTier, getPriceTierLabel } from '@/utils/pricing';

interface SeatDetailsProps {
  seat: Seat | null;
  section: Section | null;
  rowIndex: number | null;
  isSelected: boolean;
}

export function SeatDetails({ seat, section, rowIndex, isSelected }: Readonly<SeatDetailsProps>) {
  if (!seat || !section || rowIndex === null) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <p className="text-gray-500 text-sm">Click or focus on a seat to see details</p>
      </div>
    );
  }

  const price = getPriceForTier(seat.priceTier);
  const tierLabel = getPriceTierLabel(seat.priceTier);

  const statusColors = {
    available: 'text-green-600 bg-green-50',
    reserved: 'text-amber-600 bg-amber-50',
    sold: 'text-red-600 bg-red-50',
    held: 'text-purple-600 bg-purple-50',
  };

  const statusColor = statusColors[seat.status] || 'text-gray-600 bg-gray-50';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Seat Details</h3>
        {isSelected && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Selected
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Section:</span>
          <span className="text-sm font-medium text-gray-900">{section.label}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Row:</span>
          <span className="text-sm font-medium text-gray-900">{rowIndex}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Seat:</span>
          <span className="text-sm font-medium text-gray-900">{seat.col}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
            {seat.status}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Price Tier:</span>
          <span className="text-sm font-medium text-gray-900">{tierLabel}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Price:</span>
          <span className="text-sm font-bold text-gray-900">${price}</span>
        </div>
      </div>
    </div>
  );
}
