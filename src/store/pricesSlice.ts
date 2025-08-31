import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMarkets } from '../api/coingecko';

export const loadPrices = createAsyncThunk(
  'prices/load',
  async (ids: string[]) => {
    const rows = await fetchMarkets(ids);
    const byId: Record<string, any> = {};
    rows.forEach((r: any) => (byId[r.id] = r));
    return byId;
  }
);

interface PricesState { byId: Record<string, any>; loading: boolean; error: string | null; }
const initial: PricesState = { byId: {}, loading: false, error: null };

const slice = createSlice({
  name: 'prices',
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadPrices.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(loadPrices.fulfilled, (state, action) => { state.loading = false; state.byId = action.payload; });
    builder.addCase(loadPrices.rejected, (state, action) => { state.loading = false; state.error = action.error.message ?? 'Error'; });
  },
});

export default slice.reducer;
