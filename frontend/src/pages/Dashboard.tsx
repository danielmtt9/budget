import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardData } from '../services/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import BlurredAmount from '../components/BlurredAmount';
import { usePrivacy } from '../contexts/PrivacyContext';
import { getMerchantLogo } from '../services/merchantLogos';

interface AccountSummary {
  id: number;
  name: string;
  type: string;
  balance: number;
  bank_name: string;
}

interface TrendData {
  date: string;
  income: number;
  expenses: number;
  isForecast?: boolean;
}

interface CategorySpending {
  category: string;
  total: number;
  limit: number;
}

interface SyncStatus {
  configured: boolean;
  message: string;
  last_sync_at: string | null;
  quota_remaining: number;
  sync_progress: number;
}

interface SummaryData {
  total_balance: number;
  total_assets: number;
  total_liabilities: number;
  income: number;
  expenses: number;
  net_flow: number;
  effective_date: string;
}

interface User {
  id: number;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

import DashboardSkeleton from '../components/DashboardSkeleton';

const Dashboard = () => {
  const [data, setData] = useState<{
    summary: SummaryData;
    accounts: AccountSummary[];
    trends: TrendData[];
    recentTransactions: any[];
    user: User;
    categorySpending: CategorySpending[];
    syncStatus: SyncStatus;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [error, setError] = useState<string | null>(null);
  const { isPrivacyMode } = usePrivacy();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 80;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = async () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;
    const isAtTop = window.scrollY === 0;

    if (isUpSwipe && isAtTop && !isRefreshing) {
      setIsRefreshing(true);
      try {
        const dashboardData = await getDashboardData();
        setData(dashboardData);
        setSyncProgress(dashboardData.syncStatus.sync_progress);
      } catch (error) {
        console.error('Failed to refresh dashboard data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    const fetchDashboard = async () => {
      try {
        const dashboardData = await getDashboardData();

        // Generate forecast data (dotted line)
        const lastTrend = dashboardData.trends[dashboardData.trends.length - 1];
        if (lastTrend) {
          const forecast = [];
          let lastDate = new Date(lastTrend.date);
          for (let i = 1; i <= 7; i++) {
            const nextDate = new Date(lastDate);
            nextDate.setDate(lastDate.getDate() + i);

            // Forecast based on average of the month so far
            const avgExpenses = avgOf(dashboardData.trends.map((t: any) => t.expenses));
            const avgIncome = avgOf(dashboardData.trends.map((t: any) => t.income));

            forecast.push({
              date: nextDate.toISOString().split('T')[0],
              income: avgIncome * (1 + (Math.random() * 0.1 - 0.05)),
              expenses: avgExpenses * (1 + (Math.random() * 0.2 - 0.1)),
              isForecast: true
            });
          }
          dashboardData.trends = [...dashboardData.trends, ...forecast];
        }

        setData(dashboardData);
        setSyncProgress(dashboardData.syncStatus.sync_progress);

        if (dashboardData.syncStatus.sync_progress > 0) {
          interval = setInterval(async () => {
            const { getSyncStatus } = await import('../services/api');
            const status = await getSyncStatus();
            setSyncProgress(status.sync_progress);
            if (status.sync_progress === 0) {
              clearInterval(interval);
              const refreshedData = await getDashboardData();
              setData(refreshedData);
            }
          }, 3000);
        }
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        // If it's an auth error, it will be handled by the interceptor
        // Otherwise, show error state
        if (error.response?.status !== 401) {
          setError('Failed to load dashboard data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const avgOf = (arr: number[]) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;

  const subscriptions = (data?.recentTransactions || []).filter(tx =>
    ['Subscription', 'LLM Tools', 'Cloud Infrastructure'].includes(tx.category_name)
  ).slice(0, 6);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error_outline</span>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Error Loading Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors active:scale-95"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <span className="material-symbols-outlined text-6xl text-slate-400 mb-4 animate-pulse">sync</span>
        <p className="text-slate-500 dark:text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col w-full min-h-full bg-background-light dark:bg-[#0b1118] font-display"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      {isRefreshing && (
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-2 bg-primary/10 backdrop-blur-sm" style={{ paddingTop: `calc(env(safe-area-inset-top) + 0.5rem)` }}>
          <span className="material-symbols-outlined animate-spin text-primary">sync</span>
        </div>
      )}
      
      {/* Premium Gradient Background Element */}
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-[-10%] right-[-10%] size-[500px] rounded-full bg-primary/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] size-[500px] rounded-full bg-emerald-500/20 blur-[120px]"></div>
      </div>

      {syncProgress > 0 && (
        <div className="sticky top-0 z-50 w-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary animate-spin text-xl">sync</span>
              <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Live Data Sync</span>
            </div>
            <div className="flex-1 max-w-xl relative h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-blue-400 transition-all duration-1000 ease-in-out"
                style={{ width: `${syncProgress}%` }}
              ></div>
            </div>
            <span className="text-xs font-black text-primary w-10 text-right">{syncProgress}%</span>
          </div>
        </div>
      )}

      <div className="relative z-10 p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold tracking-widest text-[10px] uppercase opacity-80">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              Current Month Performance
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight dark:text-white text-slate-900">
              Hello, <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">{data.user.full_name?.split(' ')[0] || 'Financer'}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg max-w-md">
              Your wealth is growing. Here's what's happening today.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* System Status Widget */}
            <div className="flex items-center gap-6 px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md animate-in fade-in slide-in-from-top-4 duration-1000">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Financial Day</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary">calendar_today</span>
                  <span className="text-xs font-black dark:text-white text-slate-900">
                    {new Date(data.summary.effective_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Last Sync</span>
                <div className="flex items-center gap-2">
                  <span className={`size-1.5 rounded-full ${syncProgress > 0 ? 'bg-primary animate-pulse' : 'bg-emerald-500'}`}></span>
                  <span className="text-xs font-black dark:text-white text-slate-900">
                    {data.syncStatus.last_sync_at ? new Date(data.syncStatus.last_sync_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/settings"
              className="group flex h-14 items-center justify-center gap-3 rounded-2xl bg-white dark:bg-white/5 px-6 font-bold dark:text-white text-slate-900 border border-slate-200 dark:border-white/10 hover:border-primary transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">account_balance</span>
              <span>Manage Assets</span>
            </Link>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Left: Main Insights (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">

            {/* Net Worth Hero Card */}
            <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] bg-slate-900 dark:bg-white/5 p-6 md:p-8 lg:p-10 border border-white/10 shadow-2xl group">
              <div className="absolute top-0 right-0 p-6 md:p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[120px] md:text-[180px]">account_balance_wallet</span>
              </div>
              <div className="relative z-10">
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs mb-3 md:mb-4">Net Worth Breakdown</p>
                <div className="flex flex-col gap-1">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter">
                    <BlurredAmount amount={data.summary.total_balance} />
                  </h2>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cash & Investments</span>
                      <span className="text-sm font-black text-emerald-400">
                        <BlurredAmount amount={data.summary.total_assets} />
                      </span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-6">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Outstanding Debt</span>
                      <span className="text-sm font-black text-rose-400">
                        <BlurredAmount amount={data.summary.total_liabilities} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${data.summary.net_flow >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      <span className="material-symbols-outlined text-sm">{data.summary.net_flow >= 0 ? 'trending_up' : 'trending_down'}</span>
                      {Math.abs((data.summary.net_flow / (data.summary.income || 1)) * 100).toFixed(1)}% this month
                    </div>
                    <span className="text-slate-500 text-xs font-medium">calculated for this calendar month</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Stats */}
              <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 relative z-10 pt-6 md:pt-8 border-t border-white/10">
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Inflow</p>
                  <p className="text-2xl font-black text-emerald-400"><BlurredAmount amount={data.summary.income} /></p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Monthly Outflow</p>
                  <p className="text-2xl font-black text-rose-400"><BlurredAmount amount={data.summary.expenses} /></p>
                </div>
                <div className="hidden md:block">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Savings Rate</p>
                  <p className="text-2xl font-black text-blue-400">
                    {data.summary.income > 0 ? Math.max(0, (data.summary.net_flow / data.summary.income * 100)).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Habits Chart */}
            <div className="rounded-2xl md:rounded-[2rem] bg-white dark:bg-white/5 p-4 md:p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-6 md:mb-10">
                <div>
                  <h2 className="text-xl md:text-2xl font-black dark:text-white text-slate-900 tracking-tight">Spending DNA (This Month)</h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-1">Visualizing your liquidity flow since {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-2">
                  <span className="flex items-center gap-2 text-[10px] font-bold text-primary px-3 py-1 rounded-full border border-primary/20">
                    REAL DATA
                  </span>
                  <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 px-3 py-1 rounded-full border border-slate-400/20 border-dashed">
                    FORECAST
                  </span>
                </div>
              </div>
              <div className="h-[250px] md:h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trends}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: isMobile ? 9 : 10, fontWeight: 700 }}
                      tickFormatter={(str) => {
                        const d = new Date(str);
                        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                      }}
                      dy={isMobile ? 15 : 10}
                      interval={isMobile ? 2 : 0}
                      angle={isMobile ? -45 : 0}
                      textAnchor={isMobile ? 'end' : 'middle'}
                      height={isMobile ? 60 : 40}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#64748b', fontSize: isMobile ? 9 : 10, fontWeight: 700 }}
                      tickFormatter={(val) => isMobile ? `$${(val / 1000).toFixed(0)}k` : `$${val}`}
                      dx={isMobile ? -5 : -10}
                      width={isMobile ? 50 : 60}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                        padding: '12px'
                      }}
                      itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 800 }}
                      labelStyle={{ color: '#94a3b8', fontSize: '10px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      formatter={(value: any, name: any, props: any) => {
                        const isForecast = props?.payload?.isForecast;
                        const label = name === 'income' ? 'INFLOW' : 'OUTFLOW';
                        return [isPrivacyMode ? '••••' : `$${value.toFixed(2)}`, `${label} (${isForecast ? 'PROJ' : 'ACTUAL'})`];
                      }}
                    />
                    {/* Income Areas */}
                    <Area
                      type="monotone"
                      dataKey="income"
                      data={(data.trends as any[]).filter(t => !t.isForecast)}
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#incomeGradient)"
                      strokeWidth={4}
                      animationDuration={2000}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      data={(data.trends as any[]).slice((data.trends as any[]).findIndex(t => t.isForecast) - 1)}
                      stroke="#10b981"
                      strokeDasharray="8 8"
                      fill="none"
                      strokeWidth={2}
                      connectNulls
                    />

                    {/* Expense Areas */}
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      data={(data.trends as any[]).filter(t => !t.isForecast)}
                      stroke="#f43f5e"
                      fillOpacity={1}
                      fill="url(#expenseGradient)"
                      strokeWidth={4}
                      animationDuration={2000}
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      data={(data.trends as any[]).slice((data.trends as any[]).findIndex(t => t.isForecast) - 1)}
                      stroke="#f43f5e"
                      strokeDasharray="8 8"
                      fill="none"
                      strokeWidth={2}
                      connectNulls
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Categorization & Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Category Breakdown */}
              <div className="rounded-2xl md:rounded-[2rem] bg-white dark:bg-white/5 p-4 md:p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
                <h3 className="text-lg md:text-xl font-bold dark:text-white text-slate-900 mb-4 md:mb-6">Spending DNA</h3>
                <div className="h-[200px] md:h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.categorySpending as any}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
                        paddingAngle={10}
                        dataKey="total"
                      >
                        {data.categorySpending.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={[
                            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#6366f1'
                          ][index % 7]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(15, 23, 42, 0.9)',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-6">
                  {data.categorySpending.slice(0, 4).map((cat, idx) => (
                    <div key={cat.category} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="size-2 rounded-full" style={{ backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][idx % 4] }}></span>
                        <span className="font-bold text-slate-500 uppercase tracking-tight">{cat.category}</span>
                      </div>
                      <span className="font-black dark:text-white text-slate-900"><BlurredAmount amount={cat.total} /></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transactions Feed */}
              <div className="rounded-2xl md:rounded-[2rem] bg-white dark:bg-white/5 p-4 md:p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4 md:mb-8">
                  <h3 className="text-lg md:text-xl font-bold dark:text-white text-slate-900">Live Activity</h3>
                  <Link to="/transactions" className="text-xs font-black text-primary uppercase tracking-widest hover:underline hidden sm:inline">Full Audit</Link>
                </div>
                <div className="space-y-4 md:space-y-6 flex-1">
                  {data.recentTransactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`size-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${tx.amount > 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-400 dark:text-slate-500'}`}>
                          <span className="material-symbols-outlined">{tx.amount > 0 ? 'payments' : 'shopping_bag'}</span>
                        </div>
                        <div>
                          <p className="text-sm font-black dark:text-white text-slate-900 line-clamp-1">{tx.description}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                        </div>
                      </div>
                      <p className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-400' : 'dark:text-white text-slate-900'}`}>
                        {tx.amount > 0 ? '+' : '-'}<BlurredAmount amount={Math.abs(tx.amount)} />
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Assets & Subscriptions (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 md:gap-8">

          {/* Managed Assets */}
          <div className="rounded-2xl md:rounded-[2rem] bg-white dark:bg-white/5 p-4 md:p-6 lg:p-8 border border-slate-200 dark:border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-8">
              <h3 className="text-lg md:text-xl font-bold dark:text-white text-slate-900">Managed Assets</h3>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter hidden sm:inline">API ACTIVE</span>
            </div>
            <div className="space-y-4">
              {data.accounts.map((acc) => (
                <div key={acc.id} className="p-4 rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-10 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center shadow-sm group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">
                        {acc.type.toLowerCase().includes('savings') ? 'savings' :
                          acc.type.toLowerCase().includes('card') ? 'credit_card' :
                            acc.type.toLowerCase().includes('investment') ? 'show_chart' :
                              acc.type.toLowerCase().includes('line') ? 'account_balance' : 'account_balance_wallet'}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{acc.type}</span>
                  </div>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{acc.bank_name}</p>
                  <p className="text-sm font-black dark:text-white text-slate-900 group-hover:text-slate-400 transition-colors truncate">{acc.name}</p>
                  <p className="text-2xl font-black dark:text-white text-slate-900 mt-1 tracking-tight">
                    <BlurredAmount amount={acc.balance} />
                  </p>
                </div>
              ))}
              {data.accounts.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl">
                  <p className="text-slate-500 text-sm font-medium mb-4">No assets connected</p>
                  <Link to="/settings" className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full">Secure Connect</Link>
                </div>
              )}
            </div>
          </div>

          {/* Subscription Manager */}
          <div className="rounded-2xl md:rounded-[2rem] bg-slate-900 p-4 md:p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 md:p-8 opacity-5 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[80px] md:text-[100px] text-white">auto_awesome</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4 md:mb-8">
                <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tighter">Subscriptions</h3>
                <span className="px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-tighter hidden sm:inline">AI DETECTED</span>
              </div>
              <div className="space-y-4">
                {subscriptions.map(sub => (
                  <div key={sub.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                    <div className="flex items-center gap-4">
                      {getMerchantLogo(sub.description) ? (
                        <img src={getMerchantLogo(sub.description)!} className="size-10 rounded-xl bg-white p-1.5 shadow-xl" alt="" />
                      ) : (
                        <div className="size-10 rounded-xl bg-white/10 text-white flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">
                            {sub.category_name === 'LLM Tools' ? 'psychology' :
                              sub.category_name === 'Cloud Infrastructure' ? 'cloud' : 'event_repeat'}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-black text-white line-clamp-1">{sub.description}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">{sub.category_name}</p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-white">
                      <BlurredAmount amount={Math.abs(sub.amount)} />
                    </span>
                  </div>
                ))}
                {subscriptions.length === 0 && (
                  <p className="text-center text-slate-500 text-xs py-10 font-medium">No active subscriptions detected...</p>
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Next Sweep</p>
                <p className="text-[10px] font-black text-white">JAN 01, 2026</p>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;
