# Interactive Event Seating Map

A responsive React + TypeScript + Next.js application that renders an interactive seating map for events. Users can select up to 8 seats with full keyboard navigation, drag-to-pan navigation, zoom controls, and persistent selections.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Quick Start Guide

1. **Main Application**: Visit `/` to see the interactive seating map with sample venue
2. **Performance Test**: Visit `/test-15k` to test with 15,000 seats and monitor FPS
3. **Navigation**: Click and drag anywhere to pan, use zoom controls for detailed view
4. **Selection**: Click on green (available) seats to select up to 8 seats
5. **Keyboard**: Use arrow keys for accessibility navigation between seats

## Architecture & Design Decisions

### Key Architecture Choices & Trade-offs

#### **1. SVG vs Canvas Rendering**
**Choice**: SVG-based rendering for seat visualization
**Trade-offs**:
- **Pros**: Scalable vector graphics, accessibility support, CSS styling, DOM events
- **Cons**: Performance degrades with >20k elements, larger memory footprint
- **Rationale**: SVG provides better accessibility and interaction handling for seat selection

#### **2. Component-Based Architecture**
**Choice**: React component hierarchy with custom hooks for business logic
**Trade-offs**:
- **Pros**: Reusable components, clear separation of concerns, testable logic
- **Cons**: More complex state management, potential prop drilling
- **Rationale**: Maintainability and code organization outweigh complexity

#### **3. Client-Side State Management**
**Choice**: Local React state + localStorage instead of external state library
**Trade-offs**:
- **Pros**: Simpler setup, no external dependencies, faster initial load
- **Cons**: Limited scalability for complex state, manual persistence logic
- **Rationale**: Application state is simple enough to not require Redux/Zustand

#### **4. Performance Optimization Strategy**
**Choice**: DOM element capping (20k limit) + React.memo instead of virtualization
**Trade-offs**:
- **Pros**: Simpler implementation, works well for most venues, maintains interactivity
- **Cons**: Hard limit on venue size, not suitable for 50k+ seat venues
- **Rationale**: Covers 95% of real-world venues while keeping complexity manageable

#### **5. Pan/Zoom Implementation**
**Choice**: CSS transforms + document-level mouse events instead of third-party library
**Trade-offs**:
- **Pros**: No external dependencies, full control over behavior, lightweight
- **Cons**: More implementation work, potential browser compatibility issues
- **Rationale**: Custom implementation provides better integration with seat selection

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
6. **Document-level events**: Mouse tracking uses document events for smooth panning
7. **Optimized event handling**: Prevents interference between seat clicks and pan gestures

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

### Navigation & Interaction
- **Drag-to-Pan**: Click and drag anywhere to navigate the venue at any zoom level
- **Zoom Controls**: Zoom in/out buttons with percentage display and reset functionality
- **Smart Event Handling**: Pan gestures don't interfere with seat selection
- **Cross-Platform**: Mouse support for desktop, touch support for mobile
- **Visual Feedback**: Cursor changes and live panning status indicators

### Responsive Design
- **Mobile-first**: Optimized layout for mobile devices with touch interactions
- **Flexible grid**: Uses CSS Grid with responsive breakpoints
- **Content reordering**: Summary appears first on mobile, after details on desktop
- **Touch-friendly**: Appropriately sized touch targets and touch panning support

## Features

**Core Requirements**
- Load venue.json and render all seats in correct positions
- Smooth rendering performance for large venues (15k+ seats)
- Mouse and keyboard seat selection
- Seat details display on click/focus
- Up to 8 seat selection limit with live summary
- localStorage persistence across page reloads
- Full accessibility with ARIA labels and keyboard navigation
- Responsive design for desktop and mobile

**Additional Features**
- **Drag-to-pan navigation** at all zoom levels for intuitive venue exploration
- **Zoom controls** (in/out/reset) with visual percentage feedback
- **Performance test mode** with 15k seats and real-time FPS monitoring
- **Visual legend** for seat status colors with clear indicators
- **Keyboard navigation help** dialog with comprehensive shortcuts
- **Loading states** and error handling with user-friendly messages
- **Price tier system** with dynamic pricing across multiple tiers
- **Touch-friendly interface** with native mobile gesture support

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
│   ├── page.tsx         # Main seating map application
│   ├── test-15k/        # Performance test with 15k seats
│   │   └── page.tsx     # Large venue performance testing
│   ├── layout.tsx       # Root layout component
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── SeatingMap.tsx   # Main seating visualization with zoom/pan
│   ├── Seat.tsx         # Individual seat component with interactions
│   ├── SeatDetails.tsx  # Seat information panel
│   ├── SelectionSummary.tsx # Cart/summary component
│   └── KeyboardInstructions.tsx # Accessibility help dialog
├── hooks/               # Custom React hooks
│   ├── useSeatSelection.ts # Selection state management
│   ├── useLocalStorage.ts  # Persistence hook
│   └── useKeyboardNavigation.ts # Keyboard controls
├── types/               # TypeScript type definitions
│   └── venue.ts         # Venue data interfaces
└── utils/               # Utility functions
    ├── pricing.ts       # Price tier calculations
    └── generateVenueData.ts # Large venue generation (15k seats)

public/
└── venue.json           # Sample venue configuration data
```

## Data Format

The application loads venue data from `public/venue.json`. The data structure includes:
- **Venue metadata**: Name, unique ID, and SVG canvas dimensions
- **Sections**: Labeled areas with transformation coordinates for positioning
- **Rows**: Numbered rows within each section containing seat arrays
- **Seat properties**: Unique ID, column position, x/y coordinates, price tier, and status

### Sample Data Structure
```json
{
  "venueId": "arena-01",
  "name": "Metropolis Arena", 
  "map": { "width": 1024, "height": 768 },
  "sections": [
    {
      "id": "A",
      "label": "Lower Bowl A",
      "transform": { "x": 0, "y": 0, "scale": 1 },
      "rows": [
        {
          "index": 1,
          "seats": [
            {
              "id": "A-1-01",
              "col": 1,
              "x": 50, "y": 80,
              "priceTier": 1,
              "status": "available"
            }
          ]
        }
      ]
    }
  ]
}
```

## Application Routes

- **`/`** - Main seating map with sample venue (18 seats)
- **`/test-15k`** - Performance test with generated 15,000 seats and FPS monitoring

## Navigation Guide

### Desktop Navigation
1. **Drag to Pan**: Click and drag anywhere on the venue to navigate
2. **Zoom Controls**: Use +/- buttons or scroll wheel for zoom
3. **Seat Selection**: Click directly on available seats (green circles)
4. **Keyboard Navigation**: Use arrow keys to navigate between seats
5. **Reset**: Click "Reset" to return to original position and zoom

### Mobile Navigation
1. **Touch Pan**: Touch and drag to navigate the venue
2. **Pinch Zoom**: Use native pinch gestures (browser-supported)
3. **Tap Selection**: Tap available seats to select them
4. **Touch Controls**: Use on-screen zoom buttons for precise control

## Performance Features

- **Real-time FPS monitoring** in test mode
- **Smooth 60fps performance** with 15,000+ seats
- **Efficient rendering** with 20k DOM element limit
- **Optimized event handling** for large datasets
- **Memory management** with proper cleanup

## Incomplete Features / TODOs

### High Priority
- **Testing**: Comprehensive unit and integration test coverage
  - Component rendering and interaction tests
  - Keyboard navigation functionality  
  - Seat selection logic and limits
  - LocalStorage persistence
  - Performance benchmarks for large venues

- **Virtual scrolling**: For venues with >20k seats, implement viewport culling
  - Would enable support for massive venues (50k+ seats)
  - Trade-off: Increased complexity vs. current 20k hard limit

### Medium Priority  
- **Advanced filtering**: Filter seats by price tier or availability
  - Price range sliders, availability filters
  - Section-based filtering and highlighting

- **Seat recommendations**: Suggest optimal seat groupings based on party size
  - Algorithm to find best available seats together
  - Consider price, proximity to stage, accessibility needs

- **Animation**: Smooth transitions for seat selection/deselection
  - CSS transitions for seat state changes
  - Smooth zoom/pan animations

### Low Priority
- **Multi-venue support**: Dynamic venue loading and switching
  - API integration for multiple venue configurations
  - Venue selection UI component

- **Gesture recognition**: Advanced touch gestures (double-tap zoom, etc.)
  - Double-tap to zoom to specific areas
  - Pinch-to-zoom integration improvements

- **Advanced accessibility**: Enhanced screen reader support
  - Spatial audio cues for seat navigation
  - Voice commands for seat selection

### Technical Debt
- **Error boundaries**: Graceful error handling for component failures
- **Internationalization**: Multi-language support for venue labels
- **Performance monitoring**: Real-time performance tracking in production
- **Caching strategy**: Optimize venue data loading and caching

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
