// src/actions/searchActions.ts
import { createAction } from '@reduxjs/toolkit';

export const addSearch = createAction('addSearch', (query: string, results: any[]) => {
  return { payload: { query, results } };
});

export const clearSearchHistory = createAction('clearSearchHistory');