// src/components/SearchHistory.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { addSearch, clearSearchHistory } from '../actions/searchActions';

interface SearchHistoryProps {
  // Add any props needed for the component
}

const SearchHistory: React.FC<SearchHistoryProps> = () => {
  const searchHistory = useSelector((state) => state.searchHistory);

  const handleClearSearchHistory = () => {
    clearSearchHistory();
  };

  return (
    <div>
      <h2>Search History</h2>
      <ul>
        {searchHistory.map((search, index) => (
          <li key={index}>
            <span>Query: {search.query}</span>
            <span>Results: {search.results}</span>
            <span>Timestamp: {search.timestamp}</span>
          </li>
        ))}
      </ul>
      <button onClick={handleClearSearchHistory}>Clear Search History</button>
    </div>
  );
};

export default SearchHistory;