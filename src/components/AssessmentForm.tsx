import React from 'react';

interface AssessmentFormProps {
  onSubmit: (data: any) => void;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit }) => {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Needs Assessment</h3>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({}); }} className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (City or ZIP)</label>
          <input type="text" id="location" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        <div>
          <label htmlFor="careType" className="block text-sm font-medium text-gray-700">Type of Care Needed</label>
          <select id="careType" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            <option>Assisted Living</option>
            <option>Memory Care</option>
            <option>Independent Living</option>
            <option>Nursing Home</option>
          </select>
        </div>
        <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Find Care
        </button>
      </form>
    </div>
  );
};
