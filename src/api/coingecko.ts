let API_KEY = import.meta.env.VITE_COINGECKO_API_KEY ;

const options = {
  method: 'GET',
  headers: {accept: 'application/json', 'x-cg-demo-api-key': API_KEY}
};


export async function fetchMarkets(ids: string[]) {
  if (!ids.length) return [];
  const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
  url.searchParams.set('vs_currency', 'usd');
  url.searchParams.set('ids', ids.join(','));
  url.searchParams.set('sparkline', 'true');
  const res = await fetch(url.toString() , options);
  if (!res.ok) throw new Error('Failed to load markets');
  return res.json();
}

export async function searchCoins(query: string) {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}` , options
  );
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.coins as Array<{ id: string; name: string; symbol: string; thumb: string }>;
}

export async function trendingCoins() {
  const res = await fetch('https://api.coingecko.com/api/v3/search/trending' , options);
  if (!res.ok) throw new Error('Trending failed');
  const data = await res.json();
  // Normalize to {id,name,symbol,thumb}
  return (data.coins ?? []).map((c: any) => ({
    id: c.item.id,
    name: c.item.name,
    symbol: c.item.symbol,
    thumb: c.item.small,
  })) as Array<{ id: string; name: string; symbol: string; thumb: string }>;
}
