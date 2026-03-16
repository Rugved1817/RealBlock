'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfileDropdown from '@/components/ProfileDropdown';
import WalletModal from '@/components/WalletModal';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<{ balance: number; currency: string }>({ balance: 0, currency: 'INR' });
    const [sqftWallet, setSqftWallet] = useState<{ totalSqft: number; address: string } | null>(null);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [showSqftTooltip, setShowSqftTooltip] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const fetchWallet = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:4000/api/auth/wallet', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const walletInfo = data.result?.data || data;
                if (walletInfo && typeof walletInfo.balance === 'number') {
                    setWallet(walletInfo);
                }
            }
        } catch (error) {
            console.error('Error fetching wallet:', error);
        }
    };

    const fetchSqftWallet = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:4000/api/auth/sqft-wallet', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                const info = data.result?.data || data;
                setSqftWallet({ totalSqft: info.totalSqft, address: info.address });
            }
        } catch (error) {
            console.error('Error fetching SQFT wallet:', error);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWallet();
            fetchSqftWallet();
        }
    }, [user]);

    const refreshWallet = fetchWallet;

    return (
        <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50 shadow-sm/5">
            <div className="max-w-[1440px] mx-auto px-4 md:px-8">
                <div className="flex justify-between items-center h-[72px]">
                    {/* Left: Logo & Nav */}
                    <div className="flex items-center gap-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 decoration-0 no-underline">
                            <div className="w-9 h-9 bg-[#0055FF] rounded-lg flex items-center justify-center text-white shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 21h18" />
                                    <path d="M5 21V7l8-4 8 4v14" />
                                    <path d="M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11" />
                                </svg>
                            </div>
                            <span className="text-[22px] font-bold text-[#0F172A] tracking-tight decoration-0"><span className="text-[#0055FF]">Real</span>Block</span>
                        </Link>

                        {/* Nav Links */}
                        <nav className="hidden xl:flex items-center gap-8">
                            <Link href="/properties" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                Marketplace
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                        My Portfolio
                                    </Link>
                                    <Link href="/dashboard/documents" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                        Tax Documents
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/dashboard" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                        Dashboard
                                    </Link>
                                    <Link href="#how-it-works" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                        How It Works
                                    </Link>
                                    <Link href="#" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                        Learn
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {user ? (
                            <>
                                {/* 💰 Bank Wallet (INR) */}
                                <button
                                    onClick={() => setIsWalletOpen(true)}
                                    className="hidden sm:flex items-center gap-3 bg-[#F8FAFC] px-4 py-3 rounded-full border border-[#E2E8F0] transition-all hover:bg-white hover:shadow-md cursor-pointer group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                                        </svg>
                                    </div>
                                    <div className="flex flex-col items-start leading-none">
                                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-0.5">Bank Wallet</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-sm font-black text-[#0F172A] tracking-tight">
                                                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: wallet.currency || 'INR', maximumFractionDigits: 0 }).format(wallet.balance)}
                                            </span>
                                        </div>
                                    </div>
                                </button>

                                {/* 🏠 SQFT Wallet (On-chain) */}
                                <div className="relative hidden sm:block">
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        onMouseEnter={() => setShowSqftTooltip(true)}
                                        onMouseLeave={() => setShowSqftTooltip(false)}
                                        className="flex items-center gap-3 bg-[#0F172A] px-4 py-3 rounded-full border border-transparent transition-all hover:bg-[#1E293B] hover:shadow-md cursor-pointer group"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white/20 transition-colors">
                                            {/* Building/SQFT icon */}
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="2" y="7" width="20" height="14" rx="2" />
                                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                            </svg>
                                        </div>
                                        <div className="flex flex-col items-start leading-none">
                                            <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.15em] mb-0.5">SQFT Wallet</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                                <span className="text-sm font-black text-white tracking-tight">
                                                    {sqftWallet ? `${sqftWallet.totalSqft.toLocaleString()} SQFT` : '0 SQFT'}
                                                </span>
                                            </div>
                                        </div>
                                    </button>

                                    {/* Tooltip on hover */}
                                    {showSqftTooltip && sqftWallet && (
                                        <div className="absolute right-0 top-full mt-3 w-72 bg-[#0F172A] rounded-2xl shadow-2xl border border-white/10 p-4 z-50">
                                            <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Your SQFT Portfolio</div>
                                            <div className="space-y-2 mb-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-white/60 font-medium">Total Holdings</span>
                                                    <span className="text-sm font-black text-white">{sqftWallet.totalSqft} SQFT</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-white/60 font-medium">On-chain Address</span>
                                                    <span className="text-xs font-mono text-emerald-400">
                                                        {sqftWallet.address.slice(0, 6)}...{sqftWallet.address.slice(-4)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="pt-2 border-t border-white/10">
                                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Blockchain-verified ownership</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <WalletModal
                                    isOpen={isWalletOpen}
                                    onClose={() => setIsWalletOpen(false)}
                                    onUpdate={refreshWallet}
                                    currentBalance={wallet.balance}
                                    currency={wallet.currency}
                                />

                                <ProfileDropdown user={user} />
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push('/auth/login')}
                                    className="text-[15px] font-bold text-[#334155] hover:text-[#0F172A] px-4 transition-colors cursor-pointer bg-transparent border-none"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => router.push('/auth/signup')}
                                    className="bg-[#0F172A] text-white px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-[#1E293B] transition-all shadow-sm border-none cursor-pointer"
                                >
                                    Start Investing
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
