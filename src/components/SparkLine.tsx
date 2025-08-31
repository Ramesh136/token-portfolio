import { LineChart, Line, ResponsiveContainer } from 'recharts';

export default function Sparkline({ prices , stroke }: { prices: number[] , stroke : string }) {
  const data = prices.map((y, x) => ({ x, y }));
  return (
    <div className="h-10 w-28">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
          <Line type="monotone" dataKey="y" dot={false} strokeWidth={2} stroke={stroke}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
