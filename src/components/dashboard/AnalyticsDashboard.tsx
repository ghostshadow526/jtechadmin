import React, { useState, useEffect } from 'react';
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
import { MoreVertical, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { collection, getDocs, query } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';

interface Analytics {
  totalUsers: number;
  totalRevenue: number;
  totalOrders: number;
  totalComplaints: number;
  chartData: any[];
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalComplaints: 0,
    chartData: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        const totalUsers = usersSnap.size;
        let totalRevenue = 0;
        
        usersSnap.docs.forEach(doc => {
          const balance = doc.data().balance || 0;
          totalRevenue += balance;
        });

        // Fetch orders
        const ordersSnap = await getDocs(collection(db, 'orders'));
        const totalOrders = ordersSnap.size;

        // Fetch complaints
        const complaintsSnap = await getDocs(collection(db, 'complaints'));
        const totalComplaints = complaintsSnap.size;

        // Generate mock monthly data (in real app, this would be aggregated from timestamps)
        const mainChartData = [
          { name: 'JAN', value: totalUsers > 0 ? Math.floor(totalUsers * 0.3) : 1900 },
          { name: 'FEB', value: totalUsers > 0 ? Math.floor(totalUsers * 0.4) : 3000 },
          { name: 'MAR', value: totalUsers > 0 ? Math.floor(totalUsers * 0.5) : 2400 },
          { name: 'APR', value: totalUsers > 0 ? Math.floor(totalUsers * 0.6) : 3200 },
          { name: 'MAY', value: totalUsers > 0 ? Math.floor(totalUsers * 0.7) : 2200 },
          { name: 'JUN', value: totalUsers > 0 ? Math.floor(totalUsers * 0.75) : 2900 },
          { name: 'JUL', value: totalUsers > 0 ? Math.floor(totalUsers * 0.8) : 3900 },
          { name: 'AUG', value: totalUsers > 0 ? Math.floor(totalUsers * 0.85) : 2500 },
          { name: 'SEP', value: totalUsers > 0 ? Math.floor(totalUsers * 0.9) : 3500 },
          { name: 'OCT', value: totalUsers > 0 ? Math.floor(totalUsers * 0.95) : 4100 },
          { name: 'NOV', value: totalUsers > 0 ? Math.floor(totalUsers * 0.98) : 3800 },
          { name: 'DEC', value: totalUsers },
        ];

        setAnalytics({
          totalUsers,
          totalRevenue,
          totalOrders,
          totalComplaints,
          chartData: mainChartData
        });
        setLoading(false);
      } catch (error) {
        console.error('Analytics fetch error:', error);
        // Show graceful error instead of throwing
        setAnalytics({
          totalUsers: 0,
          totalRevenue: 0,
          totalOrders: 0,
          totalComplaints: 0,
          chartData: []
        });
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);
  return (
    <div className="p-10 space-y-10">
      {loading ? (
        <div className="flex items-center justify-center h-96 text-accent-gold">
          <Loader2 className="animate-spin mr-2" />
          Loading analytics...
        </div>
      ) : (
        <>
          {/* Top 2 stats summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Total Enrolled Users', value: analytics.totalUsers.toLocaleString(), trend: `↑ ${analytics.totalOrders} Orders`, trendColor: 'text-green-500' },
              { label: 'Cumulative Payments', value: `₦${Math.floor(analytics.totalRevenue).toLocaleString()}`, trend: `${analytics.totalComplaints} Complaints`, trendColor: 'text-accent-gold' }
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
            <div className="bg-card-bg border border-border-subtle p-8 flex flex-col relative group" style={{ minHeight: '400px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">User Registration Measurement</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-accent-gold rounded-full" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">New Enrollments</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full">
                {analytics.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics.chartData}>
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
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
                )}
              </div>
            </div>

            {/* Payments Flow Chart */}
            <div className="bg-card-bg border border-border-subtle p-8 flex flex-col relative group" style={{ minHeight: '400px' }}>
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">Strategic Payment Flow (₦)</h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full" />
                    <span className="text-[10px] uppercase tracking-widest text-gray-500">Revenue Volume</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 min-h-0 w-full">
                {analytics.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.chartData}>
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
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">No data available</div>
                )}
              </div>
            </div>
          </div>

          {/* Simplified Audit Trail */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-4 bg-card-bg border border-border-subtle p-8">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-[11px] uppercase tracking-[0.2em] text-white font-semibold">System Metrics</h3>
                 <span className="text-[10px] font-mono text-gray-500 uppercase">Real-time Stats</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { event: 'Total Users', actor: 'System', amount: analytics.totalUsers.toString() },
                  { event: 'Total Orders', actor: 'Processing', amount: analytics.totalOrders.toString() },
                  { event: 'Total Complaints', actor: 'Support', amount: analytics.totalComplaints.toString() }
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
        </>
      )}
    </div>
  );
}
