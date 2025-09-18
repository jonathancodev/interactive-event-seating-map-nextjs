import { Venue, SeatStatus } from '@/types/venue';

// Generate a large venue for performance testing
export function generateLargeVenue(): Venue {
  const sections = [];
  const seatStatuses: SeatStatus[] = ['available', 'reserved', 'sold', 'held'];
  
  // Create multiple sections to reach ~15k seats
  for (let sectionIndex = 0; sectionIndex < 10; sectionIndex++) {
    const sectionId = String.fromCharCode(65 + sectionIndex); // A, B, C, etc.
    const rows = [];
    
    // Each section has 30 rows with 50 seats each = 1500 seats per section
    // 10 sections * 1500 = 15,000 seats total
    for (let rowIndex = 1; rowIndex <= 30; rowIndex++) {
      const seats = [];
      
      for (let seatCol = 1; seatCol <= 50; seatCol++) {
        const seatId = `${sectionId}-${rowIndex}-${seatCol.toString().padStart(2, '0')}`;
        
        // Randomize seat status with bias towards available
        const randomValue = Math.random();
        let status: SeatStatus;
        if (randomValue < 0.7) status = 'available';
        else if (randomValue < 0.85) status = 'reserved';
        else if (randomValue < 0.95) status = 'sold';
        else status = 'held';
        
        // Calculate position with some spacing, leaving room for stage at top
        const x = 50 + (seatCol - 1) * 20;
        const y = 80 + (rowIndex - 1) * 25;
        
        // Vary price tiers
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
        x: (sectionIndex % 5) * 1100, // 5 sections per row
        y: Math.floor(sectionIndex / 5) * 800, // 2 rows of sections
        scale: 1,
      },
      rows,
    });
  }
  
  return {
    venueId: 'large-arena-01',
    name: 'Large Test Arena (15k seats)',
    map: { width: 5500, height: 1600 }, // Accommodate all sections
    sections,
  };
}
