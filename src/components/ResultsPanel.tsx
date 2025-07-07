import React from 'react';

interface Facility {
  id: string;
  name: string;
  address: string;
  [key: string]: any;
}

interface ResultsPanelProps {
  facilities: Facility[];
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ facilities }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Search Results</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {facilities.length > 0 ? (
          facilities.map(facility => (
            <div key={facility.id} className="p-4 border rounded-md">
              <h4 className="font-bold text-lg">{facility.name}</h4>
              <p className="text-gray-600">{facility.address}</p>
            </div>
          ))
        ) : (
          <p>No results to display.</p>
        )}
      </div>
    </div>
  );
};
