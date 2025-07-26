// src/store.ts
import { createStore, combineReducers } from 'redux';
import searchHistoryReducer from './reducers/SearchHistoryReducer';

const rootReducer = combineReducers({
  searchHistory: searchHistoryReducer,
});

const store = createStore(rootReducer);

export default store;