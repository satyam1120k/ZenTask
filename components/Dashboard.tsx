import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Task, DashboardStats } from '../types';
import { getTaskInsights } from '../services/geminiService';
import { Sparkles, TrendingUp, CheckCircle, Circle, Loader2, AlertCircle } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
}

const COLORS = ['#3b82f6', '#e2e8f0', '#ef4444']; // Blue, Gray, Red
const DARK_COLORS = ['#3b82f6', '#1e293b', '#991b1b']; 

const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, completed: 0, pending: 0, overdue: 0, completionRate: 0 });
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const now = Date.now();
    const overdue = tasks.filter(t => !t.completed && t.dueDate && t.dueDate < now).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    setStats({ total, completed, pending, overdue, completionRate });
  }, [tasks]);

  const handleGenerateInsight = async () => {
    setLoadingInsight(true);
    const result = await getTaskInsights(tasks);
    setInsight(result);
    setLoadingInsight(false);
  };

  // Auto-generate insight logic (optional/debounced) can go here

  const data = [
    { name: 'Completed', value: stats.completed },
    { name: 'Pending', value: stats.pending - stats.overdue },
    ...(stats.overdue > 0 ? [{ name: 'Overdue', value: stats.overdue }] : []),
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Key Metrics Cards */}
      <div className="col-span-1 lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-all hover:shadow-md">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-3">
                <Circle className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.total}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-all hover:shadow-md">
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full mb-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Done</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.completed}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-all hover:shadow-md">
            <div className="p-3 bg-red-50 dark:bg-red-900/30 rounded-full mb-3">
                <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Overdue</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.overdue}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center transition-all hover:shadow-md">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-full mb-3">
                <TrendingUp className="w-6 h-6 text-indigo-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Rate</span>
            <span className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{stats.completionRate}%</span>
        </div>
        
        {/* AI Insight Section */}
        <div className="col-span-2 sm:col-span-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
             <div className="relative z-10">
                 <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <h3 className="font-semibold text-lg">AI Performance Coach</h3>
                    </div>
                    <button 
                        onClick={handleGenerateInsight}
                        disabled={loadingInsight}
                        className="text-xs bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loadingInsight ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refresh'}
                    </button>
                 </div>
                 <p className="text-indigo-50 text-sm leading-relaxed min-h-[3rem]">
                    {insight || (stats.total === 0 ? "Start by adding your first task to unlock insights!" : "Click refresh to get a personalized analysis of your workload.")}
                 </p>
             </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[250px]">
        <h3 className="text-slate-700 dark:text-slate-300 font-medium mb-4 self-start">Progress Visualizer</h3>
        {stats.total > 0 ? (
            <div className="w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="cell-completed" fill={COLORS[0]} />
                            <Cell key="cell-pending" fill={document.documentElement.classList.contains('dark') ? DARK_COLORS[1] : COLORS[1]} />
                            <Cell key="cell-overdue" fill={COLORS[2]} />
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#334155' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                <Circle className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm">No data to display</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;