import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { loadPrices } from "../store/pricesSlice";
import { setLastUpdated } from "../store/watchlistSlice";

// import ConnectButton from "./Wallet/ConnectButton";
import PortfolioCard from "./PortfolioCard";
import WatchlistTable from "./WatchListTable";
import AddTokenModal from "./AddTokenModal";
// import { usePortfolioTotals } from "../hooks/usePortfolioTotals";
import Logo from "../assets/logo";
import { useEventListneres } from "../hooks/useEventlisteners";
import StarIcon from "../assets/star";
import RefreshIcon from "../assets/refresh";
import PlusIcon from "../assets/plus";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CustomConnectButton from "./CustomConnectButton";

function formatTime(iso: string | null) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return "—";
  }
}

export default function Body() {
  const dispatch = useDispatch<AppDispatch>();
  const [isAddOpen, setAddOpen] = useState(false);

  // Redux state
  const ids = useSelector((s: RootState) => s.watchlist.ids);
  const lastUpdated = useSelector((s: RootState) => s.watchlist.lastUpdated);
  const loading = useSelector((s: RootState) => s.prices.loading);
  // const error = useSelector((s: RootState) => s.prices.error);
  // const pricesById = useSelector((s: RootState) => s.prices.byId);

  // const { total, pie } = usePortfolioTotals();

  // For event delegation and cltr+s to open search modal
  useEventListneres({ setAddOpen });

  // console.log("env",import.meta.env.VITE_COINGECKO_API_KEY);
  

  // Fetch prices whenever the watchlist changes
  useEffect(() => {
    if (!ids.length) return;
    (async () => {
      try {
        await dispatch(loadPrices(ids)).unwrap();
        dispatch(setLastUpdated(new Date().toISOString()));
      } catch {
        // handled by slice error
      }
    })();
  }, [ids, dispatch]);

  // “Refresh Prices” button
  const onRefresh = async () => {
    if (!ids.length) return;
    try {
      await dispatch(loadPrices(ids)).unwrap();
      dispatch(setLastUpdated(new Date().toISOString()));
    } catch {
      // handled by slice error
    }
  };

  // Simple empty state flag
  const isEmpty = useMemo(() => ids.length === 0, [ids.length]);

  return (
    <div className="min-h-screen bg-[#212124] text-neutral-100">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-[#212124] backdrop-blur">
        <div className="mx-auto flex w-full items-center justify-between">
          <div className="flex items-center justify-start  gap-3 py-3">
            <Logo className="w-7 h-7" />
            <span className="text-lg font-semibold tracking-tight">Token Portfolio</span>
          </div>
            {/* <ConnectButton /> */}
            <CustomConnectButton />
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto w-full py-6 space-y-6">
        {/* Portfolio card */}
        <PortfolioCard
        // total={total}
        // pieData={pie}
        // lastUpdatedLabel={formatTime(lastUpdated)}
        // loading={loading && !Object.keys(pricesById).length}
        // error={error ?? undefined}
        />

        {/* Watchlist header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start sm:items-center gap-2 sm:flex-row">
            <div className="text-base font-semibold flex items-start sm:items-center gap-3"><StarIcon className="w-5 h-5" /> Watchlist</div>
            {loading ? (
              <span className="text-xs text-neutral-400">Refreshing…</span>
            ) : lastUpdated ? (
              <span className="text-xs text-neutral-500 text-left sm:text-center hidden sm:inline">
                Last updated: {formatTime(lastUpdated)}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              disabled={!ids.length || loading}
              className="flex items-center gap-2 rounded-md border border-neutral-700 px-3 py-1.5 text-sm hover:bg-neutral-800 disabled:opacity-60"
              title="Reload market data"
            >
              <RefreshIcon className="w-4 h-4" /> <span className="hidden sm:inline"> Refresh Prices</span>
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 rounded-md bg-lime-500 px-3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-lime-400"
            >
              <PlusIcon className="w-4 h-4" /> Add Token
            </button>
          </div>
        </div>

        {/* Watchlist table or empty state */}
        {isEmpty ? (
          <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center">
            <p className="text-neutral-300">No tokens yet.</p>
            <p className="mt-1 text-sm text-neutral-500">
              <span className="font-medium text-neutral-200">(CTRL+S)</span> or  Click <span className="font-medium text-neutral-200">“Add Token”</span> to build your
              watchlist.
            </p>
          </div>
        ) : (
          <WatchlistTable />
        )}
      </main>

      {/* Add Token Modal */}
      {isAddOpen && <AddTokenModal open={isAddOpen} onClose={() => setAddOpen(false)} />}
    </div>
  );
}
