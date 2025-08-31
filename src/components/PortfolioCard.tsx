import { useSelector } from "react-redux";
import type { RootState } from "../store";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function formatUSD(num: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(num);
}

export default function PortfolioCard() {
  const prices = useSelector((s: RootState) => s.prices.byId);
  const holdings = useSelector((s: RootState) => s.watchlist.holdings);
  const lastUpdated = useSelector((s: RootState) => s.watchlist.lastUpdated);

  // Build portfolio data
  const data = Object.entries(holdings)
    .map(([id, amount]) => {
      const coin = prices[id];
      if (!coin) return null;
      const value = amount * coin.current_price;
      return {
        id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        value,
      };
    })
    .filter(Boolean) as { id: string; name: string; symbol: string; value: number }[];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  // Chart colors (fixed palette)
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];
  // Attach percentage
  const chartData = data.map((d, i) => ({
    ...d,
    percent: total > 0 ? (d.value / total) * 100 : 0,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#27272A] p-6">
      <div className={`flex flex-col items-start gap-4 sm:flex-row justify-between relative ${data.length <= 0 && 'sm:pb-8' }`}>
        {/* Total value */}
        <div className="text-left">
          <h2 className="text-lg font-semibold text-[#A1A1AA]">
            Portfolio Total
          </h2>
          <div className="text-6xl font-[500] text-neutral-100">
            {formatUSD(total)}
          </div>
          {lastUpdated && (
            <div className="text-xs text-neutral-500 static sm:absolute bottom-0 left-0 pt-[20px] sm:p-0">
              Last updated {new Date(lastUpdated).toLocaleTimeString()} , Across {data.length} tokens
            </div>
          )}
        </div>

        {/* Donut chart */}
        <div className="flex flex-col w-[100%] sm:w-[50%] items-start gap-4">
          <h2 className="text-lg font-semibold text-[#A1A1AA] sm:ml-7">
            Portfolio Total
          </h2>
          <div className="relative flex flex-col gap-4 items-start w-[100%] sm:flex-row">
            <div className="flex w-[100%] sm:w-auto sm:justify-center items-start mt-0 sm:-mt-[20px]">
              {data.length > 0 ? (
                <ResponsiveContainer height={200} width={200}>
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="symbol"
                      innerRadius="40%"
                      outerRadius="80%"
                      paddingAngle={0}
                    >
                      {data.map((entry, index) => (
                        <Cell
                          key={entry.id}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: number) => formatUSD(val)}
                      labelFormatter={(label) => `Token: ${label}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-neutral-500 sm:ml-7 sm:mt-5">
                  No holdings yet
                </div>
              )}

            </div>
            {/* Legend */}
            <div className="flex-1 w-[100%] sm:w-auto space-y-4 max-h-[265px] overflow-y-scroll pr-5">
              {chartData.map((d) => (
                <div key={d.id} className="flex gap-4 items-center justify-between">
                  <span
                    className="flex items-center gap-2 font-[500]"
                    style={{ color: d.color }}
                  >
                    {d.name} ({d.symbol})
                  </span>
                  <span className="text-neutral-300">
                    {d.percent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
