'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import SellModal from '@/components/SellModal';

// Icon Components using SVG for consistent styling
// ... (Icons are fine, I'll keep them in the file content I write)



interface DashboardData {
    totalInvestment: number;
    totalSqft: number;
    propertyCount: number;
    assets: {
        id: string;
        name: string;
        type: string;
        location: string;
        image: string;
        sqftOwned: number;
        totalValue: number;
    }[];
    transactions: {
        id: string;
        date: string;
        property: string;
        type: string;
        status: string;
        amount: number;
        icon: string;
        hash?: string;
    }[];
}

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);

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
                setStats(data.result?.data || data);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        const token = localStorage.getItem('token');
        if (token) fetchDashboardData(token);
    };

    if (!user) return null;

    const transactions = stats?.transactions || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B]">Portfolio Overview</h1>
                        <p className="text-[#64748B] mt-1">Real-time valuation of your real estate tokens.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        {!user?.walletAddress && (
                            <div className="flex items-center space-x-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100">
                                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] font-black uppercase tracking-tight">Custodial Mode</span>
                            </div>
                        )}
                        <button
                            onClick={() => router.push('/properties')}
                            className="bg-[#3B82F6] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#2563EB] transition-all shadow-lg shadow-blue-200"
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" /></svg>
                                </div>
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Portfolio Value</div>
                                <div className="text-3xl font-black text-slate-800 tracking-tighter">₹{stats?.totalInvestment?.toLocaleString() || '0'}</div>
                                <div className="mt-4 flex items-center text-emerald-500 font-bold text-[11px] bg-emerald-50 w-fit px-2 py-0.5 rounded-md">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                                    12.4% ARR
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">SQFT Tokens</div>
                                <div className="text-3xl font-black text-slate-800 tracking-tighter">{stats?.totalSqft?.toLocaleString() || '0'}</div>
                                <div className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    In {stats?.assets?.length || 0} Projects
                                </div>
                            </div>

                            <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Yield Distribution</div>
                                <div className="text-3xl font-black text-slate-800 tracking-tighter">₹1,442</div>
                                <div className="mt-4 text-[11px] font-bold text-blue-600 uppercase tracking-widest flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                    Next: Nov 01
                                </div>
                            </div>

                            <div className="bg-[#1E293B] rounded-[24px] p-8 shadow-xl relative overflow-hidden">
                                <div className="absolute right-0 bottom-0 opacity-10">
                                    <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg>
                                </div>
                                <div className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">KYC Status</div>
                                <div className="text-xl font-black text-white tracking-tight uppercase">Verified</div>
                                <div className="mt-4 text-[11px] font-bold text-emerald-400 uppercase tracking-widest">
                                    Trading Active
                                </div>
                            </div>
                        </div>

                        {/* My Assets Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800">Direct Holdings</h2>
                                <Link href="/properties" className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">Marketplace →</Link>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {stats?.assets && stats.assets.length > 0 ? stats.assets.map((asset) => (
                                    <div key={asset.id} className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all group cursor-pointer" onClick={() => router.push(`/properties/${asset.id}`)}>
                                        <div className="relative h-48 rounded-[20px] overflow-hidden mb-4">
                                            <img src={asset.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={asset.name} />
                                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
                                                {asset.type}
                                            </div>
                                        </div>
                                        <div className="px-1 space-y-4">
                                            <div>
                                                <h4 className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{asset.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">{asset.location}</p>
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl">
                                                <div className="space-y-0.5">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ownership</div>
                                                    <div className="text-sm font-black text-slate-900">{asset.sqftOwned} SQFT</div>
                                                </div>
                                                <div className="text-right space-y-0.5">
                                                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Value</div>
                                                    <div className="text-sm font-black text-blue-600">₹{asset.totalValue?.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedAsset(asset);
                                                    setIsSellModalOpen(true);
                                                }}
                                                className="w-full py-3 rounded-xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                                            >
                                                Sell Units
                                            </button>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] p-12 text-center">
                                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-2xl">🏠</div>
                                        <h4 className="text-lg font-bold text-slate-800">Start your real estate portfolio</h4>
                                        <p className="text-sm text-slate-500 mt-2 mb-6">You haven't invested in any tokens yet.</p>
                                        <button onClick={() => router.push('/properties')} className="bg-[#1E293B] text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg">Browse Properties</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Middle Section: Chart & Assets */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Appreciation Chart */}
                            <div className="lg:col-span-2 bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm flex flex-col">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-2xl font-black text-[#1e293b]">Historic Returns</h3>
                                    <div className="flex bg-[#F8FAFC] p-1 rounded-2xl border border-slate-100">
                                        {['1M', '6M', '1Y', 'ALL'].map((time) => (
                                            <button key={time} className={`px-5 py-2 text-[11px] font-black uppercase tracking-wider transition-all ${time === '1Y' ? 'text-[#3B82F6] bg-white shadow-sm ring-1 ring-black/5 rounded-xl' : 'text-slate-400 hover:text-slate-600'}`}>{time}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 mb-10">
                                    <div className="bg-[#ecfdf5] text-[#10b981] px-3 py-1.5 rounded-xl text-sm font-black flex items-center shadow-sm border border-[#dcfce7]">
                                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                        +46.42%
                                    </div>
                                    <span className="text-slate-400 font-bold text-sm">in last 1Y</span>
                                </div>

                                <div className="flex-1 relative min-h-[320px] mt-4">
                                    <svg viewBox="0 0 800 320" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Reference vertical dashed lines */}
                                        {[
                                            { x: 40, y: 220, label: '₹5,622', date: 'AUG 2023' },
                                            { x: 140, y: 195, label: '₹6,199' },
                                            { x: 240, y: 185, label: '₹6,390', date: 'OCT 2023' },
                                            { x: 340, y: 155, label: '₹6,939' },
                                            { x: 440, y: 145, label: '₹7,202', date: 'DEC 2023' },
                                            { x: 540, y: 135, label: '₹7,335' },
                                            { x: 640, y: 125, label: '₹7,468', date: 'FEB 2024' },
                                            { x: 740, y: 115, label: '₹7,607' },
                                            { x: 840, y: 95, label: '₹8,016', date: 'APR 2024' },
                                            { x: 940, y: 85, label: '₹8,232', date: 'MAY 2024' }
                                        ].map((pt, i) => {
                                            const x = 50 + i * 75; // Adjust spacing to fit container
                                            const y = 220 - (i * 15); // Slope up
                                            return (
                                                <g key={i}>
                                                    <line x1={x} y1={y} x2={x} y2="280" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                                                    <text x={x} y={y - 15} className="text-[10px] font-black fill-slate-500 font-sans" textAnchor="middle">{pt.label}</text>
                                                    {pt.date && (
                                                        <text x={x} y="305" className="text-[9px] font-black fill-slate-400 uppercase tracking-widest" textAnchor="middle">{pt.date}</text>
                                                    )}
                                                    <circle cx={x} cy={y} r="5" fill="white" stroke="#6366f1" strokeWidth="2.5" />
                                                </g>
                                            );
                                        })}

                                        {/* Main Path */}
                                        <path
                                            d="M 50 220 C 125 190, 200 195, 275 185 C 350 175, 425 145, 500 145 C 575 145, 650 120, 725 85"
                                            fill="none"
                                            stroke="#6366f1"
                                            strokeWidth="5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M 50 220 C 125 190, 200 195, 275 185 C 350 175, 425 145, 500 145 C 575 145, 650 120, 725 85 L 725 280 L 50 280 Z"
                                            fill="url(#indigoGradient)"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {/* Asset Distribution */}
                            <div className="bg-white rounded-[24px] p-8 border border-slate-100 shadow-sm flex flex-col">
                                <h3 className="text-xl font-bold text-slate-800 mb-8">Asset Distribution</h3>
                                <div className="space-y-8 flex-1">
                                    {[
                                        { label: 'Commercial Office', percent: 65, color: 'bg-blue-600', dot: '#2563EB' },
                                        { label: 'Warehousing', percent: 25, color: 'bg-indigo-500', dot: '#6366F1' },
                                        { label: 'Luxury Holiday Homes', percent: 10, color: 'bg-emerald-400', dot: '#34D399' }
                                    ].map((item, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.dot }}></div>
                                                    <span className="text-sm font-bold text-slate-600">{item.label}</span>
                                                </div>
                                                <span className="text-sm font-black text-slate-800">{item.percent}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-[#F8FAFC] rounded-[24px] border border-slate-100 flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-1">Portfolio Tip</h4>
                                        <p className="text-[11px] leading-relaxed text-slate-500 font-medium">Increasing your warehousing allocation could improve stability against market volatility.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>

            <SellModal
                isOpen={isSellModalOpen}
                onClose={() => setIsSellModalOpen(false)}
                asset={selectedAsset}
                onSuccess={refreshData}
            />

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
