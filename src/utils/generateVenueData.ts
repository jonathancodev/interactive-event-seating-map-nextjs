import { Venue, SeatStatus } from '@/types/venue';

export function generateLargeVenue(): Venue {
  const sections = [];
  const seatStatuses: SeatStatus[] = ['available', 'reserved', 'sold', 'held'];
  
  for (let sectionIndex = 0; sectionIndex < 10; sectionIndex++) {
    const sectionId = String.fromCharCode(65 + sectionIndex); // A, B, C, etc.
    const rows = [];
    
    for (let rowIndex = 1; rowIndex <= 30; rowIndex++) {
      const seats = [];
      
      for (let seatCol = 1; seatCol <= 50; seatCol++) {
        const seatId = `${sectionId}-${rowIndex}-${seatCol.toString().padStart(2, '0')}`;
        
        const randomValue = Math.random();
        let status: SeatStatus;
        if (randomValue < 0.7) status = 'available';
        else if (randomValue < 0.85) status = 'reserved';
        else if (randomValue < 0.95) status = 'sold';
        else status = 'held';
        
        const x = 50 + (seatCol - 1) * 20;
        const y = 80 + (rowIndex - 1) * 25;
        
        const priceTier = rowIndex <= 10 ? 1 : rowIndex <= 20 ? 2 : 3;
        
        seats.push({
          id: seatId,
          col: seatCol,
          x,
          y,
          priceTier,
          status,
        });
      }
      
      rows.push({
        index: rowIndex,
        seats,
      });
    }
    
    sections.push({
      id: sectionId,
      label: `Section ${sectionId}`,
      transform: {
        x: (sectionIndex % 5) * 1100,
        y: Math.floor(sectionIndex / 5) * 800,
        scale: 1,
      },
      rows,
    });
  }
  
  return {
    venueId: 'large-arena-01',
    name: 'Large Test Arena (15k seats)',
    map: { width: 5500, height: 1600 },
    sections,
  };
}
