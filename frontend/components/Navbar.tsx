'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfileDropdown from '@/components/ProfileDropdown';
import WalletModal from '@/components/WalletModal';

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [wallet, setWallet] = useState<{ balance: number; currency: string } | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const [isWalletOpen, setIsWalletOpen] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:4000/api/auth/wallet', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setWallet(data.result?.data || data);
                }
            } catch (error) {
                console.error('Error fetching wallet:', error);
            }
        };

        if (user) {
            fetchWallet();
        }
    }, [user]);

    const refreshWallet = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch('http://localhost:4000/api/auth/wallet', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setWallet(data.result?.data || data);
            }
        } catch (error) {
            console.error('Error refreshing wallet:', error);
        }
    };

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

                        {/* Nav Links (Original Items) */}
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
                                    <Link href="#" className="text-[#334155] hover:text-[#0F172A] font-medium text-[15px] transition-colors decoration-0">
                                        About Us
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>

                    {/* Right: Actions (Original Buttons with New Style) */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <>
                                {wallet && (
                                    <>
                                        <button
                                            onClick={() => setIsWalletOpen(true)}
                                            className="hidden sm:flex items-center gap-3 bg-[#F8FAFC] px-4 py-2 rounded-full border border-[#E2E8F0] mr-2 transition-all hover:bg-white hover:shadow-md cursor-pointer group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                                                    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                                                    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col items-start leading-none">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Wallet</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                    <span className="text-sm font-bold text-[#0F172A] tracking-tight">
                                                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: wallet.currency || 'INR', maximumFractionDigits: 0 }).format(wallet.balance)}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                        <WalletModal
                                            isOpen={isWalletOpen}
                                            onClose={() => setIsWalletOpen(false)}
                                            onUpdate={refreshWallet}
                                            currentBalance={wallet.balance}
                                            currency={wallet.currency}
                                        />
                                    </>
                                )}
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
