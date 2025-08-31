import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#F7931A','#627EEA','#14F195','#A6A6A6','#FF5B5B','#7C4DFF']; // match Figma if specified

export default function DonutChart({ data }: { data: { name: string; value: number }[] }) {
  const nonzero = data.filter(d => d.value > 0);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={nonzero} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90}>
          {nonzero.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
