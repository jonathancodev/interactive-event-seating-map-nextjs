# Interactive Event Seating Map

A responsive React + TypeScript application that renders an interactive seating map for events. Users can select up to 8 seats with full keyboard navigation support and persistent selections.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Architecture & Design Decisions

### Component Architecture
The application follows a modular component architecture with clear separation of concerns:

- **`SeatingMap`**: Main SVG-based rendering component with zoom controls and performance optimizations
- **`Seat`**: Individual seat component with accessibility features and interaction handling
- **`SeatDetails`**: Information panel showing selected seat details
- **`SelectionSummary`**: Live cart/summary with pricing and seat count
- **`KeyboardInstructions`**: Accessible help dialog for keyboard navigation

### Performance Optimizations
To handle large venues (≈15k seats) while maintaining 60fps:

1. **React.memo**: Seat components are memoized to prevent unnecessary re-renders
2. **Set-based lookups**: Selected seats use Set for O(1) lookup performance
3. **Seat limit rendering**: Caps DOM elements at 20k for browser performance
4. **Efficient re-rendering**: Uses useMemo and useCallback to minimize render cycles
5. **SVG rendering**: Vector graphics scale efficiently and perform well at large scales

### State Management
- **Custom hooks**: `useSeatSelection` for seat selection logic, `useLocalStorage` for persistence
- **Keyboard navigation**: `useKeyboardNavigation` hook handles arrow key navigation between seats
- **Local storage**: Selections persist across page reloads using localStorage

### Accessibility Features
- **ARIA labels**: All interactive elements have descriptive aria-labels
- **Keyboard navigation**: Full arrow key navigation between available seats
- **Focus management**: Visual focus indicators and proper tab order
- **Screen reader support**: Semantic HTML and proper role attributes
- **Keyboard shortcuts**: Enter/Space to select, Escape to clear focus

### Responsive Design
- **Mobile-first**: Optimized layout for mobile devices with touch interactions
- **Flexible grid**: Uses CSS Grid with responsive breakpoints
- **Content reordering**: Summary appears first on mobile, after details on desktop
- **Touch-friendly**: Appropriately sized touch targets for mobile interaction

## Features

✅ **Core Requirements**
- Load venue.json and render all seats in correct positions
- Smooth rendering performance for large venues (15k+ seats)
- Mouse and keyboard seat selection
- Seat details display on click/focus
- Up to 8 seat selection limit with live summary
- localStorage persistence across page reloads
- Full accessibility with ARIA labels and keyboard navigation
- Responsive design for desktop and mobile

✅ **Additional Features**
- Zoom controls for better venue navigation
- Visual legend for seat status colors
- Keyboard navigation help dialog
- Loading states and error handling
- Price tier system with dynamic pricing
- Touch-friendly mobile interface

## Technical Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS for responsive design
- **Performance**: React 19 with concurrent features
- **Accessibility**: WCAG 2.1 compliant implementation

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── SeatingMap.tsx   # Main seating visualization
│   ├── Seat.tsx         # Individual seat component
│   ├── SeatDetails.tsx  # Seat information panel
│   ├── SelectionSummary.tsx # Cart/summary component
│   └── KeyboardInstructions.tsx # Accessibility help
├── hooks/               # Custom React hooks
│   ├── useSeatSelection.ts # Selection state management
│   ├── useLocalStorage.ts  # Persistence hook
│   └── useKeyboardNavigation.ts # Keyboard controls
├── types/               # TypeScript type definitions
│   └── venue.ts         # Venue data interfaces
└── utils/               # Utility functions
    ├── pricing.ts       # Price tier calculations
    └── generateVenueData.ts # Large venue generation
```

## Data Format

The application loads venue data from `public/venue.json`. The data structure includes:
- Venue metadata (name, dimensions)
- Sections with transformation coordinates
- Rows containing seat arrays
- Seat properties (position, status, price tier)

## Incomplete Features / TODOs

- **Virtual scrolling**: For venues with >20k seats, implement viewport culling
- **Advanced filtering**: Filter seats by price tier or availability
- **Seat recommendations**: Suggest optimal seat groupings
- **Animation**: Smooth transitions for seat selection/deselection
- **Multi-venue support**: Support for multiple venue configurations
- **Testing**: Comprehensive unit and integration test coverage

## Running Tests

Currently no tests are implemented. To add testing:

```bash
# Install testing dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# Run tests (when implemented)
pnpm test
```

Recommended test coverage:
- Component rendering and interaction tests
- Keyboard navigation functionality
- Seat selection logic and limits
- LocalStorage persistence
- Performance benchmarks for large venues

## Browser Support

- Modern browsers with ES2017+ support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Keyboard navigation requires focus-visible support
