// SearchHistory component displays user's previous search queries and results
import React from 'react';
import { useSelector } from 'react-redux';
import { addSearch, clearSearchHistory } from '../actions/searchActions';

  // Props for SearchHistory (currently unused)
}

// Main SearchHistory component
const SearchHistory: React.FC<SearchHistoryProps> = () => {
  // Get search history from Redux store
  const searchHistory = useSelector((state) => state.searchHistory);

  // Clear search history handler
  const handleClearSearchHistory = () => {
    clearSearchHistory();
  };

  return (
    <div>
      {/* Title */}
      <h2>Search History</h2>
      {/* List of previous searches */}
      <ul>
        {searchHistory.map((search, index) => (
          <li key={index}>
            <span>Query: {search.query}</span>
            <span>Results: {search.results}</span>
            <span>Timestamp: {search.timestamp}</span>
          </li>
        ))}
      </ul>
      {/* Button to clear search history */}
      <button onClick={handleClearSearchHistory}>Clear Search History</button>
    </div>
  );
};

export default SearchHistory;