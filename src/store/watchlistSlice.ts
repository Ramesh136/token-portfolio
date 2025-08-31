import { createSlice } from '@reduxjs/toolkit';
import type {PayloadAction} from "@reduxjs/toolkit"


type HoldingsMap = Record<string, number>;
export interface WatchlistState {
  ids: string[];
  holdings: HoldingsMap;
  lastUpdated: string | null;
}
const initial: WatchlistState = loadFromLS() ?? { ids: [], holdings: {}, lastUpdated: null };

const slice = createSlice({
  name: 'watchlist',
  initialState: initial,
  reducers: {
    addTokens(state, action: PayloadAction<string[]>) {
      for (const id of action.payload) {
        if (!state.ids.includes(id)) state.ids.push(id);
        if (state.holdings[id] == null) state.holdings[id] = 0;
      }
      saveToLS(state);
    },
    removeToken(state, action: PayloadAction<string>) {
      state.ids = state.ids.filter((x) => x !== action.payload);
      delete state.holdings[action.payload];
      saveToLS(state);
    },
    setHolding(state, action: PayloadAction<{ id: string; amount: number }>) {
      const { id, amount } = action.payload;
      state.holdings[id] = isFinite(amount) && amount >= 0 ? amount : 0;
      saveToLS(state);
    },
    setLastUpdated(state, action: PayloadAction<string>) {
      state.lastUpdated = action.payload;
      saveToLS(state);
    },
  },
});

function loadFromLS(): WatchlistState | null {
  try {
    const raw = localStorage.getItem('watchlist');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function saveToLS(state: WatchlistState) {
  try { localStorage.setItem('watchlist', JSON.stringify(state)); } catch {}
}

export const { addTokens, removeToken, setHolding, setLastUpdated } = slice.actions;
export default slice.reducer;
