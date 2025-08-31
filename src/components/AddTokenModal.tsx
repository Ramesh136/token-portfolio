import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { addTokens } from "../store/watchlistSlice";
import { searchCoins, trendingCoins } from "../api/coingecko";
import StarIcon from "../assets/star";
import CheckCircleIcon from "../assets/checkedCircle";
import CircleOutlineIcon from "../assets/uncheckedCircle";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function AddTokenModal({ open, onClose }: Props) {

  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const ids = useSelector((s: RootState) => s.watchlist.ids);
  const [results, setResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [trendingLoading , setTrendingLoading] = useState(false);

  // Load trending on mount
  useEffect(() => {
    if (!open || !ids) return;
    setTrending([]);
    setTrendingLoading(true);
    trendingCoins().then((res) => {
      let nonAddedTokens = res.filter(token => !ids.includes(token.id))
      setTrending(nonAddedTokens);
      setTrendingLoading(false);
    }).finally(()=>setTrendingLoading(false));
  }, [open]);

  // Handle search
  useEffect(() => {
    if (!open || !search || !ids) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      searchCoins(search).then((res) => {
        // console.log("search result coins",res);
        let nonAddedTokens = res.filter(token => !ids.includes(token.id))
        setResults(nonAddedTokens ?? []);
        setLoading(false);
      }).finally(()=>setLoading(false));
    }, 400);
    return () => clearTimeout(t);
  }, [search, open]);

  const list = search ? results : trending;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full m-4 max-w-2xl rounded-xl border border-neutral-800 bg-neutral-900 py-6 px-1.5">
        <h2 className="mb-4 text-lg font-semibold text-neutral-100">
          Add Token
        </h2>

        {/* Search */}
        <input
          type="text"
          placeholder="Search tokens…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 w-full rounded-md border border-neutral-700 bg-neutral-800 px-2 py-2 text-neutral-100 placeholder-neutral-500"
        />

        {/* List */}
        <div className="max-h-72 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-neutral-400">Searching…</div>
          ) : list.length === 0 ? (
            <div className="p-4 text-center text-neutral-500">
              {search ? "No results found" : (!trendingLoading ? "Search for more tokens" : "Loading trending…")}
            </div>
          ) : (<>
          <h4 className="text-left pb-4 px-4 text-[#71717A] text-xs">{search.length > 0 ? "Search results" :"Trending results"}</h4>
            <ul className="divide-y divide-neutral-800">
              {list.map((coin: any) => (
                <label
                  key={coin.id}
                  className={`flex items-center rounded-md justify-between px-2 py-3 hover:bg-neutral-800/50 ${selected?.includes(coin.id) ? 'selected' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={coin.large || coin.thumb || coin.image}
                      alt={coin.symbol}
                      className="h-6 w-6 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium text-neutral-100">
                        {coin.name}
                      </div>
                      <div className="text-xs uppercase text-neutral-500 text-left">
                        {coin.symbol}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    name="selectCoin"
                    className="hidden"
                    checked={selected?.includes(coin.id)}
                    onChange={(e) => setSelected((prev) => {
                      if (e.target.checked) {
                        return prev !== null ? [...prev, coin.id] : [coin.id]
                      }
                      else {
                        return prev !== null ? prev.filter(e => e !== coin.id) : []
                      }
                    })}
                  />
                  <div className="flex items-center gap-3">
                    {selected?.includes(coin.id)
                      ? <><StarIcon className="w-4 h-4" /><CheckCircleIcon className="w-5 h-5" /></>
                      : <CircleOutlineIcon className="w-5 h-5" />
                    }
                  </div>
                </label>
              ))}
            </ul>
          </>

          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-700 px-4 py-2 text-neutral-400 hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            disabled={!selected || !selected?.length || selected?.length <= 0}
            onClick={() => {
              if (selected) {
                dispatch(addTokens(selected));
                onClose();
                setSelected(null);
                setSearch("");
              }
            }}
            className="rounded-md bg-[#A9E851] px-4 py-2 font-medium text-[#18181B] disabled:opacity-50"
          >
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
