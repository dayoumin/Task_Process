/**
 * Filter panel for data filtering
 */

import React from 'react';
import type { FilterOptionsClient } from '@task-process/shared-types';

interface FilterPanelProps {
  filters: FilterOptionsClient;
  onFilterChange: (filters: FilterOptionsClient) => void;
  departments: Array<{ id: string; name: string }>;
  processTypes: string[];
  users: Array<{ id: string; name: string }>;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFilterChange,
  departments,
  processTypes,
  users,
}) => {
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value ? new Date(value) : null,
      },
    });
  };

  const handleMultiSelect = (field: keyof FilterOptionsClient, value: string) => {
    const currentValues = filters[field] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];

    onFilterChange({
      ...filters,
      [field]: newValues,
    });
  };

  const handleClearAll = () => {
    onFilterChange({
      dateRange: { start: null, end: null },
      departments: [],
      processTypes: [],
      users: [],
      status: [],
    });
  };

  const hasActiveFilters =
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.departments.length > 0 ||
    filters.processTypes.length > 0 ||
    filters.users.length > 0 ||
    filters.status.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-primary-600 hover:text-primary-800 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="date"
              value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Departments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departments
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
            {departments.map((dept) => (
              <label key={dept.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.departments.includes(dept.id)}
                  onChange={() => handleMultiSelect('departments', dept.id)}
                  className="mr-2 rounded"
                />
                <span className="text-sm">{dept.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Process Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Process Types
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
            {processTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.processTypes.includes(type)}
                  onChange={() => handleMultiSelect('processTypes', type)}
                  className="mr-2 rounded"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Users */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Users
          </label>
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-1">
            {users.map((user) => (
              <label key={user.id} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.users.includes(user.id)}
                  onChange={() => handleMultiSelect('users', user.id)}
                  className="mr-2 rounded"
                />
                <span className="text-sm">{user.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="space-y-1">
            {['completed', 'in_progress', 'draft'].map((status) => (
              <label key={status} className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleMultiSelect('status', status)}
                  className="mr-2 rounded"
                />
                <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
