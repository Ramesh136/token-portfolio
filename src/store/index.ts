import { configureStore } from '@reduxjs/toolkit';
import watchlist from './watchlistSlice';
import prices from './pricesSlice';

export const store = configureStore({ reducer: { watchlist, prices } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
