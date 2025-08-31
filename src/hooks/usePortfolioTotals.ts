import { useSelector } from 'react-redux';
import type { RootState } from '../store';

export function usePortfolioTotals() {
  const { ids, holdings } = useSelector((s: RootState) => s.watchlist);
  const prices = useSelector((s: RootState) => s.prices.byId);

  const items = ids.map((id) => {
    const coin = prices[id];
    const price = coin?.current_price ?? 0;
    const amount = holdings[id] ?? 0;
    const value = amount * price;
    return { id, name: coin?.name ?? id, symbol: coin?.symbol, value };
  });

  const total = items.reduce((sum, i) => sum + i.value, 0);

  // percentages for donut
  const pie = items.map((i) => ({ name: i.name, value: i.value || 0 }));

  return { total, pie, items };
}
