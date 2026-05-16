import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MoreVertical, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/src/lib/utils';

// Mock Data
const mainChartData = [
  { name: 'JAN', value: 1900 },
  { name: 'FEB', value: 3000 },
  { name: 'MAR', value: 2400 },
  { name: 'APR', value: 3200 },
  { name: 'MAY', value: 2200 },
  { name: 'JUN', value: 2900 },
  { name: 'JUL', value: 3900 },
  { name: 'AUG', value: 2500 },
  { name: 'SEP', value: 3500 },
  { name: 'OCT', value: 4100 },
  { name: 'NOV', value: 3800 },
  { name: 'DEC', value: 3200 },
];

const miniBarData = [
  { value: 40 }, { value: 70 }, { value: 60 }, { value: 90 }, { value: 100 }, { value: 80 }, { value: 40 }
];

const miniLineData = [
  { value: 10 }, { value: 30 }, { value: 25 }, { value: 45 }, { value: 40 }, { value: 60 }, { value: 55 }
];

const pieData = [
  { name: 'Desktop', value: 92.8, color: '#3182CE' },
  { name: 'Mobile', value: 6.1, color: '#E53E3E' },
  { name: 'Tablet', value: 1.1, color: '#D69E2E' },
];

export default function AnalyticsDashboard() {
  return (
    <div className="p-10 space-y-10">
      {/* Top 2 stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Total Enrolled Users', value: '14,248', trend: '↑ 12.4% Strategy Yield', trendColor: 'text-green-500' },
          { label: 'Cumulative Payments', value: '₦42,850,200', trend: '₦1.2M Pending Resolution', trendColor: 'text-accent-gold' }
        ].map((stat, i) => (
          <div key={i} className="bg-card-bg border border-border-subtle p-8 hover:border-accent-gold/40 transition-colors">
            <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mb-4">{stat.label}</p>
            <p className="text-4xl text-white font-light tracking-tight font-mono">{stat.value}</p>
            <p className={cn("text-[10px] font-mono mt-4 uppercase tracking-wider", stat.trendColor)}>{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Registration Measurement */}
        <div className="bg-card-bg border border-border-subtle p-8 h-[400px] flex flex-col relative group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">User Registration Measurement</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-accent-gold rounded-full" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500">New Enrollments</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mainChartData}>
                <defs>
                  <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1B" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#3F3F46', fontSize: 10, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#3F3F46', fontSize: 10 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0D0E', border: '1px solid #27272A', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#C5A059' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#C5A059" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#goldGradient)" 
                  dot={{ r: 3, fill: '#0A0A0B', stroke: '#C5A059', strokeWidth: 1.5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payments Flow Chart */}
        <div className="bg-card-bg border border-border-subtle p-8 h-[400px] flex flex-col relative group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">Strategic Payment Flow (₦)</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-400 rounded-full" />
                <span className="text-[10px] uppercase tracking-widest text-gray-500">Revenue Volume</span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mainChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1A1A1B" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#3F3F46', fontSize: 10, fontWeight: 500 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#3F3F46', fontSize: 10 }}
                  tickFormatter={(val) => `₦${val / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0D0D0E', border: '1px solid #27272A', color: '#fff', fontSize: '12px' }}
                  formatter={(val: any) => [`₦${val.toLocaleString()}`, 'Yield']}
                />
                <Bar dataKey="value" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Simplified Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4 bg-card-bg border border-border-subtle p-8">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">Verification Audit Trail</h3>
             <span className="text-[10px] font-mono text-gray-500 uppercase">Strategic Access Logs</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { event: 'Bulk Payment Verified', actor: 'Aurelian System', amount: '₦124,000' },
              { event: 'User Tier Upgraded', actor: 'E. Sterling', amount: 'Level Alpha' },
              { event: 'Margin Liquidity Check', actor: 'Yield Desk', amount: '₦8.4M' }
            ].map((log, i) => (
              <div key={i} className="bg-card-active border border-border-subtle p-4">
                 <p className="text-white text-sm mb-1">{log.event}</p>
                 <div className="flex justify-between text-[10px] text-accent-gold font-mono uppercase tracking-widest">
                    <span>{log.actor}</span>
                    <span className="opacity-60">{log.amount}</span>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
