'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Icon Components using SVG for consistent styling
// ... (Icons are fine, I'll keep them in the file content I write)



interface DashboardData {
    totalInvestment: number;
    totalSqft: number;
    propertyCount: number;
    transactions: {
        id: string;
        date: string;
        property: string;
        type: string;
        status: string;
        amount: number;
        icon: string;
    }[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userData && token) {
            setUser(JSON.parse(userData));
            fetchDashboardData(token);
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    const fetchDashboardData = async (token: string) => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    const transactions = stats?.transactions || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B]">My Portfolio</h1>
                        <p className="text-[#64748B] mt-1">Manage your fractional assets and track returns in real-time.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center space-x-2 bg-[#F0FDF4] text-[#15803D] px-4 py-2 rounded-xl border border-[#DCFCE7]">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-xs font-bold tracking-tight">KYC VERIFIED</span>
                        </div>

                        <button
                            onClick={() => router.push('/properties')}
                            className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2563EB] transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            + Invest More
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        {/* Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <span className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                        <span>12.4%</span>
                                    </span>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Total Investment</div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">₹{stats?.totalInvestment?.toLocaleString() || '0'}</div>
                                    <div className="mt-2 text-xs font-semibold text-slate-400">Across Portfolio</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                    </div>
                                    <div className="h-6 w-12 bg-slate-50 rounded-full animate-pulse"></div>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Properties Owned</div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">{stats?.propertyCount || 0} <span className="text-lg font-bold text-slate-400">Assets</span></div>
                                    <div className="mt-2 text-xs font-semibold text-slate-400">Total {stats?.totalSqft || 0} sq.ft</div>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                    </div>
                                    <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-700 uppercase tracking-wide">View Report</button>
                                </div>
                                <div>
                                    <div className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-1">Next Payout</div>
                                    <div className="text-3xl font-black text-slate-800 tracking-tight">Nov 01</div>
                                    <div className="mt-2 text-xs font-semibold text-slate-400">Est. ₹12,450</div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Section: Chart & Assets */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Appreciation Chart */}
                            <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative overflow-visible">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 z-10 relative">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">Portfolio Appreciation</h3>
                                    </div>
                                    <div className="flex bg-slate-50 p-1 rounded-xl shadow-inner border border-slate-100">
                                        {['1M', '6M', '1Y', 'ALL'].map((time) => (
                                            <button
                                                key={time}
                                                className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${time === '6M' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative h-[300px] w-full">
                                    {/* High Fidelity SVG Chart */}
                                    <svg viewBox="0 0 800 300" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                                                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid Lines */}
                                        {[60, 120, 180, 240].map((y, i) => (
                                            <line key={i} x1="0" y1={y} x2="800" y2={y} stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                                        ))}

                                        {/* Chart Area & Line */}
                                        <path
                                            d="M0,280 C100,270 200,250 300,220 S500,150 650,120 S800,80 800,80 L800,300 L0,300 Z"
                                            fill="url(#chartGradient)"
                                        />
                                        <path
                                            d="M0,280 C100,270 200,250 300,220 S500,150 650,120 S800,80 800,80"
                                            fill="none"
                                            stroke="#3B82F6"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* Interactive Data Points */}
                                        {[
                                            { cx: 50, cy: 275, val: 'May', price: '10' },
                                            { cx: 300, cy: 220, val: 'Jul', price: '12.4' },
                                            { cx: 650, cy: 120, val: 'Sep', price: '14.8' },
                                            { cx: 800, cy: 80, val: 'Oct', price: '15.2' }
                                        ].map((pt, i) => (
                                            <g key={i} className="group cursor-pointer">
                                                <circle
                                                    cx={pt.cx}
                                                    cy={pt.cy}
                                                    r="6"
                                                    fill="white"
                                                    stroke="#3B82F6"
                                                    strokeWidth="3"
                                                    className="group-hover:r-8 transition-all duration-300"
                                                />
                                                <circle
                                                    cx={pt.cx}
                                                    cy={pt.cy}
                                                    r="12"
                                                    fill="#3B82F6"
                                                    className="opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                                />
                                                {/* Tooltip on hover */}
                                                <foreignObject x={pt.cx - 30} y={pt.cy - 50} width="60" height="40" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                    <div className="bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg text-center shadow-lg transform translate-y-1">
                                                        ₹{pt.price}L
                                                    </div>
                                                </foreignObject>
                                            </g>
                                        ))}
                                    </svg>

                                    {/* X-Axis Labels */}
                                    <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>May</span>
                                        <span>Jun</span>
                                        <span>Jul</span>
                                        <span>Aug</span>
                                        <span>Sep</span>
                                        <span>Oct</span>
                                    </div>
                                </div>
                            </div>

                            {/* Distribution Card */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col">
                                <h3 className="text-xl font-bold text-slate-800 mb-8">Asset Allocation</h3>
                                <div className="space-y-6 flex-1">
                                    {[
                                        { label: 'Commercial Office', percent: 65, color: 'bg-blue-600', bg: 'bg-blue-100' },
                                        { label: 'Warehousing', percent: 25, color: 'bg-purple-600', bg: 'bg-purple-100' },
                                        { label: 'Luxury Holiday Homes', percent: 10, color: 'bg-emerald-500', bg: 'bg-emerald-100' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{item.label}</span>
                                                <span className="text-sm font-black text-slate-800">{item.percent}%</span>
                                            </div>
                                            <div className="h-2.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-5 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 relative overflow-hidden">
                                    <div className="flex items-start space-x-3 relative z-10">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                            <span className="text-lg">💡</span>
                                        </div>
                                        <div className="text-[11px] leading-relaxed text-slate-500 font-medium">
                                            <span className="text-slate-800 font-bold block mb-1 uppercase tracking-wider">Portfolio Tip</span>
                                            Diversifying into warehousing can stabilize returns during market volatility.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12">
                            <div className="p-8 pb-6 flex items-center justify-between border-b border-slate-50">
                                <h3 className="text-xl font-bold text-slate-800">Recent Transactions</h3>
                                <Link href="#" className="flex items-center text-[10px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    Full History
                                    <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-slate-50/50">
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.length > 0 ? transactions.map((tx, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-bold text-slate-600">{tx.date}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                                                            {tx.icon}
                                                        </div>
                                                        <div className="text-sm font-bold text-slate-800">{tx.property}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${tx.type.includes('Payout') ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        <span className="text-xs font-bold text-emerald-600">{tx.status}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-8 py-5 text-right font-black text-sm ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-800'}`}>
                                                    {tx.amount > 0 ? '+' : ''} ₹{Math.abs(tx.amount).toLocaleString()}
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={5} className="px-8 py-16 text-center">
                                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                                        <svg className="w-12 h-12 mb-3 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                                        <p className="text-sm font-semibold">No transactions found</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </div>
    );

}
