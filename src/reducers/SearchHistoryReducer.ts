// src/reducers/SearchHistoryReducer.ts
import { createReducer } from '@reduxjs/toolkit';

interface SearchHistoryState {
  searchHistory: {
    query: string;
    results: any[];
    timestamp: number;
  }[];
}

const initialState: SearchHistoryState = {
  searchHistory: [],
};

const searchHistoryReducer = createReducer(initialState, {
  addSearch: (state, action) => {
    state.searchHistory.push({
      query: action.payload.query,
      results: action.payload.results,
      timestamp: Date.now(),
    });
  },
  clearSearchHistory: (state) => {
    state.searchHistory = [];
  },
});

export default searchHistoryReducer;