import React, { useState } from 'react';

export function KeyboardInstructions() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="text-sm text-blue-600 hover:text-blue-700 underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        aria-expanded={isVisible}
        aria-controls="keyboard-instructions"
      >
        Keyboard Navigation Help
      </button>
      
      {isVisible && (
        <div
          id="keyboard-instructions"
          className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 w-80"
          aria-label="Keyboard navigation instructions"
        >
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Keyboard Navigation</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Arrow Keys:</span>
                <span className="text-gray-600">Navigate between seats</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Enter/Space:</span>
                <span className="text-gray-600">Select/deselect seat</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Escape:</span>
                <span className="text-gray-600">Clear focus</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Tab:</span>
                <span className="text-gray-600">Navigate UI elements</span>
              </div>
            </div>
            
            <div className="pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Use arrow keys to navigate between available seats. 
                Press Enter or Space to select a seat. 
                Only available seats can be focused and selected.
              </p>
            </div>
            
            <button
              onClick={() => setIsVisible(false)}
              className="w-full mt-3 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
