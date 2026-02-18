'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Icon Components using SVG for consistent styling
const DashboardIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
    </svg>
);

const PortfolioIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
        <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
);

const MarketplaceIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const WalletIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
);

const DocumentsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const SettingsIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const LogoutIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

const MenuIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            router.push('/auth/login');
        }
    }, [router]);

    if (!user) return null;

    const transactions = [
        { date: '12 Oct 2023', property: 'Horizon Towers', type: 'Rental Payout', status: 'Completed', amount: 4200, icon: '🏢' },
        { date: '05 Oct 2023', property: 'Skyview Commercial', type: 'Token Purchase', status: 'Completed', amount: -50000, icon: '🏢' },
        { date: '28 Sep 2023', property: 'Logistics Park A', type: 'Rental Payout', status: 'Completed', amount: 1850, icon: '🏭' },
    ];

    return (
        <div className="flex h-screen bg-[#F8FAFC]">
            {/* Sidebar */}
            <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-300 relative`}>
                {/* Collapse Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-20 bg-white border border-[#E2E8F0] rounded-full p-1 text-[#64748B] hover:text-[#3B82F6] shadow-sm z-50 transition-colors"
                >
                    <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>

                <div className={`p-6 border-b border-[#F1F5F9] flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
                    <Link href="/" className="flex items-center space-x-3 group text-decoration-none">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200 group-hover:scale-105 transition-transform">
                            <span className="text-white text-xl font-bold">R</span>
                        </div>
                        {!isCollapsed && (
                            <span className="text-xl font-bold text-[#0F172A] whitespace-nowrap">RealBlock</span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link
                        href="/dashboard"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 bg-[#EFF6FF] text-[#3B82F6] rounded-xl font-semibold shadow-sm transition-all duration-200`}
                        title="Dashboard"
                    >
                        <DashboardIcon />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                    <Link
                        href="/dashboard/portfolio"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#3B82F6] rounded-xl transition-all duration-200`}
                        title="My Portfolio"
                    >
                        <PortfolioIcon />
                        {!isCollapsed && <span>My Portfolio</span>}
                    </Link>
                    <Link
                        href="/properties"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#3B82F6] rounded-xl transition-all duration-200`}
                        title="Marketplace"
                    >
                        <MarketplaceIcon />
                        {!isCollapsed && <span>Marketplace</span>}
                    </Link>
                    <Link
                        href="/dashboard/wallet"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#3B82F6] rounded-xl transition-all duration-200 relative`}
                        title="Wallet"
                    >
                        <WalletIcon />
                        {!isCollapsed && (
                            <>
                                <span>Wallet</span>
                                <span className="ml-auto bg-[#22C55E] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                                    ₹24k
                                </span>
                            </>
                        )}
                        {isCollapsed && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-[#22C55E] rounded-full border-2 border-white"></span>
                        )}
                    </Link>
                    <Link
                        href="/dashboard/documents"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#3B82F6] rounded-xl transition-all duration-200`}
                        title="Tax Documents"
                    >
                        <DocumentsIcon />
                        {!isCollapsed && <span>Tax Documents</span>}
                    </Link>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-[#F1F5F9] space-y-2">
                    <Link
                        href="/settings"
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#3B82F6] rounded-xl transition-all duration-200`}
                        title="Settings"
                    >
                        <SettingsIcon />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>
                    <button
                        onClick={() => {
                            localStorage.removeItem('user');
                            localStorage.removeItem('token');
                            router.push('/');
                        }}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 px-4'} py-3 text-[#EF4444] hover:bg-[#FEF2F2] rounded-xl transition-all duration-200`}
                        title="Logout"
                    >
                        <LogoutIcon />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-[#E2E8F0] px-8 flex items-center justify-between flex-shrink-0 relative z-10">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-2 text-[#64748B] hover:bg-[#F1F5F9] rounded-lg md:hidden"
                        >
                            <MenuIcon />
                        </button>
                        <h1 className="text-2xl font-bold text-[#1E293B]">Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden sm:flex items-center space-x-2 bg-[#F0FDF4] text-[#15803D] px-4 py-2 rounded-xl border border-[#DCFCE7]">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-xs font-bold tracking-tight">KYC VERIFIED</span>
                        </div>

                        <button className="relative p-2.5 text-[#64748B] hover:bg-[#F1F5F9] rounded-xl transition-colors group">
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#EF4444] rounded-full border-2 border-white"></span>
                        </button>

                        <div className="flex items-center space-x-3 pl-6 border-l border-[#E2E8F0]">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-bold text-[#1E293B]">{user.name || user.email.split('@')[0]}</div>
                                <div className="text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase">Investor ID: #8821X</div>
                            </div>
                            <div className="w-11 h-11 bg-gradient-to-br from-[#3B82F6] to-[#6366F1] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-100 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform">
                                {(user.name || user.email || 'U')[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Scrollable Dashboard Body */}
                <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Welcome Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">Portfolio Overview</h2>
                            <p className="text-[#64748B] mt-1">Manage your fractional assets and track returns in real-time.</p>
                        </div>
                        <button className="bg-[#3B82F6] text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:bg-[#2563EB] transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0">
                            + Invest More
                        </button>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-7 border border-[#E2E8F0] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-[#EFF6FF] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                    </svg>
                                </div>
                                <div className="flex items-center space-x-1 px-2.5 py-1 bg-[#F0FDF4] rounded-lg">
                                    <span className="text-[#15803D] text-xs font-bold font-mono">↗ 12.4%</span>
                                </div>
                            </div>
                            <div className="text-[#64748B] text-xs font-bold uppercase tracking-widest mb-2">Total Value</div>
                            <div className="text-3xl font-black text-[#0F172A]">₹24,50,000</div>
                            <div className="mt-4 text-[11px] font-bold text-[#94A3B8] uppercase">Annualized Return</div>
                        </div>

                        <div className="bg-white rounded-3xl p-7 border border-[#E2E8F0] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-[#F5F3FF] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-[#8B5CF6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M3 3v18h18" />
                                        <path d="M7 16l3-4 4 2 5-6" />
                                    </svg>
                                </div>
                                <div className="h-6 w-12 bg-[#F1F5F9] rounded-lg"></div>
                            </div>
                            <div className="text-[#64748B] text-xs font-bold uppercase tracking-widest mb-2">Area Owned</div>
                            <div className="text-3xl font-black text-[#0F172A]">450 <span className="text-lg text-[#94A3B8]">SQFT</span></div>
                            <div className="mt-4 text-[11px] font-bold text-[#94A3B8] uppercase">Across 5 Properties</div>
                        </div>

                        <div className="bg-white rounded-3xl p-7 border border-[#E2E8F0] hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group cursor-default">
                            <div className="flex items-start justify-between mb-6">
                                <div className="p-3 bg-[#F0FDF4] rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                    <svg className="w-7 h-7 text-[#22C55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 1v22" />
                                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                    </svg>
                                </div>
                                <button className="text-[10px] font-bold text-[#3B82F6] hover:underline uppercase">History</button>
                            </div>
                            <div className="text-[#64748B] text-xs font-bold uppercase tracking-widest mb-2">Rental Income</div>
                            <div className="text-3xl font-black text-[#0F172A]">₹84,200</div>
                            <div className="mt-4 text-[11px] font-bold text-[#94A3B8] uppercase">Next Payout: Nov 1</div>
                        </div>
                    </div>

                    {/* Middle Section: Chart & Assets */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Appreciation Chart */}
                        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                                <h3 className="text-xl font-bold text-[#1E293B]">Portfolio Appreciation</h3>
                                <div className="flex bg-[#F1F5F9] p-1 rounded-xl">
                                    {['1M', '6M', '1Y', 'ALL'].map((time) => (
                                        <button
                                            key={time}
                                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${time === '6M' ? 'bg-white text-[#3B82F6] shadow-sm' : 'text-[#64748B] hover:text-[#1E293B]'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative h-72">
                                <svg viewBox="0 0 700 250" className="w-full h-full" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M 0 180 Q 150 160 300 120 T 700 40 L 700 250 L 0 250 Z"
                                        fill="url(#chartGradient)"
                                    />
                                    <path
                                        d="M 0 180 Q 150 160 300 120 T 700 40"
                                        fill="none"
                                        stroke="#3B82F6"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                    />
                                    {[0, 150, 300, 450, 600, 700].map((x, i) => (
                                        <circle
                                            key={i}
                                            cx={x}
                                            cy={x === 700 ? 40 : (x === 0 ? 180 : (180 - (x / 4)))}
                                            r="6"
                                            fill="white"
                                            stroke="#3B82F6"
                                            strokeWidth="3"
                                        />
                                    ))}
                                </svg>
                                <div className="flex justify-between mt-4 text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
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
                        <div className="bg-white rounded-3xl p-8 border border-[#E2E8F0] shadow-sm flex flex-col">
                            <h3 className="text-xl font-bold text-[#1E293B] mb-8">Asset Distribution</h3>
                            <div className="space-y-7 flex-1">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full"></div>
                                            <span className="text-xs font-bold text-[#475569] uppercase tracking-wide">Comm. Office</span>
                                        </div>
                                        <span className="text-sm font-black text-[#1E293B]">65%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-2.5 h-2.5 bg-[#8B5CF6] rounded-full"></div>
                                            <span className="text-xs font-bold text-[#475569] uppercase tracking-wide">Warehousing</span>
                                        </div>
                                        <span className="text-sm font-black text-[#1E293B]">25%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: '25%' }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center space-x-2.5">
                                            <div className="w-2.5 h-2.5 bg-[#06B6D4] rounded-full"></div>
                                            <span className="text-xs font-bold text-[#475569] uppercase tracking-wide">Holiday Homes</span>
                                        </div>
                                        <span className="text-sm font-black text-[#1E293B]">10%</span>
                                    </div>
                                    <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                                        <div className="h-full bg-[#06B6D4] rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-5 bg-[#F8FAFC] rounded-2xl border border-[#F1F5F9] relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-10 blur-xl w-16 h-16 bg-[#3B82F6]"></div>
                                <div className="flex items-start space-x-3 relative z-10">
                                    <div className="p-2 bg-blue-100/50 rounded-lg">
                                        <svg className="w-4 h-4 text-[#3B82F6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="16" x2="12" y2="12" />
                                            <line x1="12" y1="8" x2="12.01" y2="8" />
                                        </svg>
                                    </div>
                                    <div className="text-[11px] leading-relaxed text-[#64748B] font-semibold">
                                        <span className="text-[#1E293B] block mb-1 uppercase tracking-wider">Portfolio Tip</span>
                                        Higher warehousing allocation can reduce overall market volatility.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden mb-12">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#1E293B]">Recent Activity</h3>
                            <Link href="#" className="text-xs font-bold text-[#3B82F6] hover:underline uppercase tracking-widest">View History ↗</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-[#F8FAFC] border-y border-[#F1F5F9]">
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Asset</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-4 text-left text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-right text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#F1F5F9]">
                                    {transactions.map((tx, idx) => (
                                        <tr key={idx} className="hover:bg-[#F8FAFC] transition-colors group cursor-default">
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-[#64748B]">{tx.date}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 rounded-xl bg-[#F1F5F9] flex items-center justify-center text-xl shadow-sm group-hover:bg-white transition-colors duration-300">
                                                        {tx.icon}
                                                    </div>
                                                    <div className="text-sm font-black text-[#334155]">{tx.property}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center space-x-2">
                                                    <div className={`w-2 h-2 rounded-full ${tx.type.includes('Payout') ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                                    <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wide">{tx.type}</div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-[#DCFCE7] text-[#166534]">
                                                    {tx.status}
                                                </span>
                                            </td>
                                            <td className={`px-8 py-5 text-right font-black text-sm ${tx.amount > 0 ? 'text-[#059669]' : 'text-[#1E293B]'}`}>
                                                {tx.amount > 0 ? '+' : ''} ₹{Math.abs(tx.amount).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
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
