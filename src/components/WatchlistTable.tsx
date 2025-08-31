import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { setHolding, removeToken } from "../store/watchlistSlice";
import Sparkline from "./SparkLine";
import { useState } from "react";
import DotsIcon from "../assets/dots";
import EditIcon from "../assets/edit";
import TrashIcon from "../assets/trash";

// Format helpers
function formatUSD(num: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}
function formatPct(num: number) {
  return `${num.toFixed(2)}%`;
}

export default function WatchlistTable() {
  const dispatch = useDispatch<AppDispatch>();
  const ids = useSelector((s: RootState) => s.watchlist.ids);
  const holdings = useSelector((s: RootState) => s.watchlist.holdings);
  const prices = useSelector((s: RootState) => s.prices.byId);
  const loading = useSelector((s: RootState) => s.prices.loading);
  const error = useSelector((s: RootState) => s.prices.error);

  // Pagination
  const [page, setPage] = useState(0);
  const perPage = 6;
  const totalPages = Math.ceil(ids.length / perPage);

  const pagedIds = ids.slice(page * perPage, page * perPage + perPage);

  const handleOptionsClick = (e:any) => {
    let parentRow = e?.target?.closest("td.action-table-data");
    let parentTableBody = e?.target?.closest("tbody");
    let actiontableDatas = parentTableBody.querySelectorAll("td.action-table-data");
    actiontableDatas.forEach((element:HTMLElement) => {
      if (element !== parentRow) {
        element.classList.contains('active') ? element.classList.remove('active') : '';
      }
    });

    parentRow.classList.toggle("active");
  }

  const handleHoldingsSave = () => {
    console.log("saving");
  }

  const handleEditholding = (e:any) => {
    // @ts-ignore
    let parentRow = e?.target?.closest("tr");
    let handleInput = parentRow.querySelector("input.holding-input");
    // @ts-ignore
    let parentTableBody = e?.target?.closest("tbody");
    let actiontableDatas = parentTableBody.querySelectorAll("td.action-table-data");
    actiontableDatas.forEach((element:HTMLElement) => {
      if (element !== parentRow) {
        element.classList.contains('active') ? element.classList.remove('active') : '';
      }
    });
    handleInput.focus();

  }

  if (loading && !Object.keys(prices).length) {
    return (
      <div className="rounded-xl border border-neutral-800 p-6 text-center text-neutral-400">
        Loading prices…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-700 bg-red-950 p-6 text-center text-red-300">
        {error}
      </div>
    );
  }
  if (!ids.length) {
    return null; // handled in Body.tsx empty state
  }

  return (
    <div className="overflow-x-scroll sm:overflow-hidden rounded-xl border border-neutral-800">
      <table className="min-w-full divide-y divide-neutral-800 text-sm">
        <thead className="bg-[#27272A] text-neutral-400">
          <tr>
            <th className="min-w-[180px] sm:min-w-[140px] px-3 py-2 text-left font-medium">Token</th>
            <th className="min-w-[180px] sm:min-w-[140px] px-3 py-2 text-left font-medium">Price</th>
            <th className="min-w-[180px] sm:min-w-[140px] px-3 py-2 text-left font-medium">24h %</th>
            <th className="min-w-[180px] sm:min-w-[140px] px-3 py-2 text-left font-medium">Sparkline(7d)</th>
            <th className="min-w-[180px] sm:min-w-[140px] px-3 py-2 text-left font-medium">Holdings</th>
            <th className="min-w-[100px] sm:min-w-[140px] max-w-[206px] px-3 py-2 text-left font-medium">Value</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800">
          {pagedIds.map((id) => {
            const coin = prices[id];
            const holding = holdings[id] ?? 0;
            const price = coin?.current_price ?? 0;
            const value = holding * price;
            const pct = coin?.price_change_percentage_24h ?? 0;
            return (
              <tr key={id} className="hover:bg-neutral-800/40 bg-[#212124]">
                {/* Token */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={coin?.image}
                      alt={coin?.symbol}
                      className="h-6 w-6 rounded-sm"
                    />
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-neutral-100 text-left">
                        {coin?.name ?? id}
                      </span>
                      <span className="text-xs uppercase text-neutral-500 text-left">
                        ({coin?.symbol})
                      </span>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-3 py-2 text-left text-[#A1A1AA]">
                  {formatUSD(price)}
                </td>

                {/* 24h % */}
                <td
                  className="px-3 py-2 text-left font-medium text-[#A1A1AA]"
                >
                  {pct>0 ? '+' : ''}{formatPct(pct)}
                </td>

                {/* Sparkline */}
                <td className="px-3 py-2 text-center">
                  {coin?.sparkline_in_7d?.price ? (
                    <Sparkline prices={coin.sparkline_in_7d.price} stroke={pct > 0 ? "green" : (pct < 0 ? "red" : "")} />
                  ) : (
                    <span className="text-neutral-500">—</span>
                  )}
                </td>

                {/* Holdings input */}
                <td className="px-3 py-2 text-left">
                  <input
                    type="number"
                    id={id}
                    min="0"
                    step="any"
                    className="holding-input w-20 h-8 rounded-md px-2 py-1 text-left text-[#F4F4F5]"
                    value={holding}
                    onChange={(e) =>
                      dispatch(
                        setHolding({
                          id,
                          amount: parseFloat(e.target.value) || 0,
                        })
                      )
                      
                    }
                  />
                  <button
                    className="holdings-save py-1.5 px-2.5 h-8 ml-3 bg-[#A9E851] text-[#18181B] rounded-md"
                    onClick={handleHoldingsSave}
                  >Save</button>
                </td>

                {/* Value */}
                <td className="px-3 py-2 text-left text-[#F4F4F5]">
                  {holding > 0 ? formatUSD(value) : "—"}
                </td>

                {/* Row menu (remove) */}
                <td className="px-3 py-2 text-right relative action-table-data">
                  <div className="row-actions--wrapper flex flex-col absolute -left-full transform translate-x-[-45%] sm:translate-x-[-8%] -translate-y-[34%] rounded-[8px] bg-[#27272A]">
                    <button className="flex items-center gap-3 px-2 py-2 whitespace-nowrap border-b-[0.5px] border-[#FFFFFF14]"
                      onClick={(e) => handleEditholding(e)}
                    ><EditIcon className="w-4 h-4" /> Edit Holdings</button>
                    <button 
                    className="flex items-center gap-3 px-2 py-2" 
                    onClick={() => dispatch(removeToken(id))}
                    ><TrashIcon className="w-4 h-4" /> Remove</button>
                  </div>
                  <button
                    onClick={(e) => handleOptionsClick(e)}
                    className="rounded-md px-2 py-1 text-xs text-red-400"
                  >
                    <DotsIcon className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-800  px-3 py-2 text-xs text-neutral-400">
          <span>
            {page * perPage + 1} –{" "}
            {Math.min((page + 1) * perPage, ids.length)} of {ids.length} results
          </span>
          <div className="flex gap-2 items-center">
            <span>{page+1} of {totalPages} pages</span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-md border border-neutral-700 px-2 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="rounded-md border border-neutral-700 px-2 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
