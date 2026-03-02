// components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  AdjustmentsHorizontalIcon,
} from '@heroicons/react/24/outline';

const SearchBar = ({
  onSearch,
  onFilter,
  placeholder = 'Search...',
  filters = [],
  initialFilters = {},
  suggestions = [],
  debounceTime = 300,
  className = '',
  showFilterButton = true,
  showClearButton = true,
  size = 'md', // sm, md, lg
  variant = 'default', // default, minimal, rounded
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [filterCount, setFilterCount] = useState(0);
  
  const searchRef = useRef(null);
  const filterRef = useRef(null);
  const debounceTimer = useRef(null);

  // Size variants
  const sizeStyles = {
    sm: {
      input: 'py-1.5 text-sm',
      icon: 'h-4 w-4',
      button: 'p-1.5',
      filterPanel: 'top-10',
    },
    md: {
      input: 'py-2.5 text-base',
      icon: 'h-5 w-5',
      button: 'p-2',
      filterPanel: 'top-12',
    },
    lg: {
      input: 'py-3 text-lg',
      icon: 'h-6 w-6',
      button: 'p-2.5',
      filterPanel: 'top-14',
    },
  };

  // Variant styles
  const variantStyles = {
    default: {
      container: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm',
      input: 'bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500',
    },
    minimal: {
      container: 'bg-slate-100 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700',
      input: 'bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500',
    },
    rounded: {
      container: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-full',
      input: 'bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500',
    },
  };

  useEffect(() => {
    // Calculate active filter count
    const count = Object.values(selectedFilters).filter(value => 
      value && (Array.isArray(value) ? value.length > 0 : true)
    ).length;
    setFilterCount(count);

    // Handle click outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedFilters]);

  // Debounced search
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm, selectedFilters);
      }
    }, debounceTime);

    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, selectedFilters, debounceTime, onSearch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('', selectedFilters);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...selectedFilters, [filterKey]: value };
    setSelectedFilters(newFilters);
    
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleRemoveFilter = (filterKey) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[filterKey];
    setSelectedFilters(newFilters);
    
    if (onFilter) {
      onFilter(newFilters);
    }
  };

  const handleClearAllFilters = () => {
    setSelectedFilters({});
    if (onFilter) {
      onFilter({});
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(suggestion, selectedFilters);
    }
  };

  // Filter input renderer based on type
  const renderFilterInput = (filter) => {
    switch (filter.type) {
      case 'select':
        return (
          <select
            value={selectedFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">All {filter.label}</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {filter.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFilters[filter.key]?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = selectedFilters[filter.key] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleFilterChange(filter.key, newValues);
                  }}
                  className="w-4 h-4 text-cyan-600 bg-slate-100 border-slate-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {filter.options.map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={filter.key}
                  value={option.value}
                  checked={selectedFilters[filter.key] === option.value}
                  onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                  className="w-4 h-4 text-cyan-600 bg-slate-100 border-slate-300 focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={selectedFilters[filter.key]?.min || ''}
                onChange={(e) => handleFilterChange(filter.key, { 
                  ...selectedFilters[filter.key], 
                  min: e.target.value 
                })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
              <span className="text-slate-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={selectedFilters[filter.key]?.max || ''}
                onChange={(e) => handleFilterChange(filter.key, { 
                  ...selectedFilters[filter.key], 
                  max: e.target.value 
                })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={selectedFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
          />
        );

      default:
        return (
          <input
            type="text"
            placeholder={`Filter by ${filter.label}`}
            value={selectedFilters[filter.key] || ''}
            onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
          />
        );
    }
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Main Search Bar */}
      <div className={`relative flex items-center ${variantStyles[variant].container} rounded-lg`}>
        {/* Search Icon */}
        <div className="flex items-center pl-3">
          <MagnifyingGlassIcon className={`${sizeStyles[size].icon} text-slate-400 dark:text-slate-500`} />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={placeholder}
          className={`flex-1 ${sizeStyles[size].input} ${variantStyles[variant].input} outline-none px-3`}
          onFocus={() => setShowSuggestions(true)}
        />

        {/* Clear Button */}
        {showClearButton && searchTerm && (
          <button
            onClick={handleClearSearch}
            className={`${sizeStyles[size].button} text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors`}
          >
            <XMarkIcon className={sizeStyles[size].icon} />
          </button>
        )}

        {/* Filter Button */}
        {showFilterButton && filters.length > 0 && (
          <>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`${sizeStyles[size].button} relative text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors`}
              >
                {filterCount > 0 ? (
                  <AdjustmentsHorizontalIcon className={sizeStyles[size].icon} />
                ) : (
                  <FunnelIcon className={sizeStyles[size].icon} />
                )}
                {filterCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {filterCount}
                  </span>
                )}
              </button>

              {/* Filter Panel */}
              {showFilters && (
                <div className={`absolute right-0 ${sizeStyles[size].filterPanel} w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden`}>
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <FunnelIcon className="h-4 w-4" />
                        Filters
                      </h3>
                      {filterCount > 0 && (
                        <button
                          onClick={handleClearAllFilters}
                          className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto p-4 space-y-4">
                    {filters.map((filter) => (
                      <div key={filter.key} className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          {filter.label}
                        </label>
                        {renderFilterInput(filter)}
                      </div>
                    ))}
                  </div>

                  <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Active Filters Tags */}
      {filterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {Object.entries(selectedFilters).map(([key, value]) => {
            const filter = filters.find(f => f.key === key);
            if (!filter || !value) return null;

            let displayValue = value;
            if (Array.isArray(value)) {
              displayValue = value.join(', ');
            } else if (typeof value === 'object' && value.min && value.max) {
              displayValue = `${value.min} - ${value.max}`;
            }

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-sm border border-cyan-200 dark:border-cyan-800"
              >
                <span className="font-medium">{filter.label}:</span>
                <span>{displayValue}</span>
                <button
                  onClick={() => handleRemoveFilter(key)}
                  className="ml-1 hover:text-cyan-900 dark:hover:text-cyan-100"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && searchTerm && (
        <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
              >
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400" />
                <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;