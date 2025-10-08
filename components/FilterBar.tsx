import React, { useState, useRef, useEffect } from 'react';
import { FilterIcon, CalendarIcon, FlagIcon, CheckCircleIcon, ChevronDownIcon, SortIcon } from './Icons';

interface FilterBarProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
}

// Custom Dropdown Component
interface CustomDropdownProps {
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ icon, options, selectedValue, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || 'Select';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-slate-700 border border-border-color text-text-main text-sm rounded-lg p-2.5 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          <span className="text-text-secondary mr-2">{icon}</span>
          <span className="font-medium">{selectedLabel}</span>
        </span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-slate-900 rounded-md shadow-lg border border-border-color animate-fade-in-down" style={{ animationDuration: '200ms' }}>
          <ul className="py-1">
            {options.map(option => (
              <li key={option.value}>
                <button
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${
                    selectedValue === option.value
                      ? 'bg-accent text-white'
                      : 'text-text-main hover:bg-slate-800'
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


const FilterBar: React.FC<FilterBarProps> = ({
  statusFilter, setStatusFilter,
  priorityFilter, setPriorityFilter,
  dateFilter, setDateFilter,
  sortOption, setSortOption
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const dateOptions = [
    { value: 'all', label: 'All Due Dates' },
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'overdue', label: 'Overdue' },
  ];

  const sortOptions = [
    { value: 'dueDate_desc', label: 'Due Date (Newest)' },
    { value: 'dueDate_asc', label: 'Due Date (Oldest)' },
    { value: 'fillLevel_desc', label: 'Fill Level (High-Low)' },
    { value: 'fillLevel_asc', label: 'Fill Level (Low-High)' },
    { value: 'priority_desc', label: 'Priority (High-Low)' },
    { value: 'priority_asc', label: 'Priority (Low-High)' },
  ];
  
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-border-color">
        <div className="flex items-center mb-6">
            <FilterIcon />
            <h4 className="text-md font-semibold text-text-main ml-2">Filter & Sort Tasks</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CustomDropdown
                icon={<CheckCircleIcon />}
                options={statusOptions}
                selectedValue={statusFilter}
                onSelect={setStatusFilter}
            />
            <CustomDropdown
                icon={<FlagIcon />}
                options={priorityOptions}
                selectedValue={priorityFilter}
                onSelect={setPriorityFilter}
            />
            <CustomDropdown
                icon={<CalendarIcon />}
                options={dateOptions}
                selectedValue={dateFilter}
                onSelect={setDateFilter}
            />
             <CustomDropdown
                icon={<SortIcon />}
                options={sortOptions}
                selectedValue={sortOption}
                onSelect={setSortOption}
            />
      </div>
    </div>
  );
};

export default FilterBar;