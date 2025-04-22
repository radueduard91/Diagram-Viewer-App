// src/components/SearchComponent.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface SearchComponentProps {
  onSearch: (query: string) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
  return (
    <div className="mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search entities, attributes, or systems..."
          className="w-full pl-10 pr-4 py-2 border rounded-md"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default SearchComponent;