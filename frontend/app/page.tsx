'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E8F0] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
                                <span className="text-white text-xl font-bold">R</span>
                            </div>
                            <span className="text-xl font-bold text-[#0F172A]">RealBlock</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-10">
                            <Link href="/properties" className="text-sm text-[#64748B] hover:text-[#0F172A] font-bold transition-colors">Marketplace</Link>
                            <Link href="#how-it-works" className="text-sm text-[#64748B] hover:text-[#0F172A] font-bold transition-colors">How It Works</Link>
                            <Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] font-bold transition-colors">Learn</Link>
                            <Link href="#" className="text-sm text-[#64748B] hover:text-[#0F172A] font-bold transition-colors">About Us</Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <div className="text-right hidden sm:block mr-2">
                                        <div className="text-sm font-bold text-[#1E293B]">{user.email}</div>
                                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Investor</div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-all shadow-md shadow-blue-50"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('user');
                                            localStorage.removeItem('token');
                                            window.location.reload();
                                        }}
                                        className="text-xs font-bold text-[#64748B] border border-[#E2E8F0] px-4 py-2.5 rounded-xl hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => router.push('/auth/login')}
                                        className="text-sm font-bold text-[#64748B] hover:text-[#0F172A] px-4"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => router.push('/auth/signup')}
                                        className="bg-[#3B82F6] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-all shadow-md shadow-blue-100"
                                    >
                                        Start Investing
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-32 overflow-hidden bg-[#1E293B]">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-full bg-indigo-600/10 blur-[120px] rounded-full"></div>

                <div className="relative max-w-7xl mx-auto px-6 z-10">
                    <div className="max-w-4xl">
                        {/* Status Badge */}
                        <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2 rounded-full mb-10 transition-transform hover:scale-105 cursor-default">
                            <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse shadow-[0_0_10px_#22C55E]"></span>
                            <span className="text-white/80 text-[11px] font-bold uppercase tracking-widest">Now Live: Brigade Tech Gardens</span>
                        </div>

                        {/* Visual Watermark (Decorative) */}
                        <div className="absolute -top-10 right-0 opacity-5 select-none pointer-events-none hidden lg:block">
                            <div className="text-[200px] font-black text-white leading-none">REAL</div>
                            <div className="text-[200px] font-black text-white leading-none">ESTATE</div>
                        </div>

                        {/* Title */}
                        <h1 className="text-7xl md:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8">
                            Own <span className="text-[#3B82F6]">Prime</span> Assets <br className="hidden md:block" />One Foot at a Time.
                        </h1>

                        <p className="text-[#94A3B8] text-xl font-medium mb-12 leading-relaxed max-w-2xl">
                            Institutional real estate is no longer just for the 1%. Invest in vetted high-yield properties starting from <span className="text-white font-bold">₹5,000</span> via secure blockchain technology.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-20">
                            <button
                                onClick={() => router.push('/properties')}
                                className="w-full sm:w-auto bg-[#3B82F6] text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#2563EB] transition-all shadow-xl shadow-blue-900/20 hover:-translate-y-1"
                            >
                                Explore Marketplace →
                            </button>
                            <button className="w-full sm:w-auto flex items-center justify-center space-x-4 bg-white/5 backdrop-blur-sm border border-white/10 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                                <span className="w-8 h-8 bg-[#3B82F6] rounded-full flex items-center justify-center text-xs">
                                    ▶
                                </span>
                                <span>Watch Process</span>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-12 border-t border-white/5">
                            <p className="text-[10px] font-black text-[#64748B] uppercase tracking-[0.2em] mb-6">
                                TRUSTED PLATFORM PARTNERS
                            </p>
                            <div className="flex flex-wrap items-center gap-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <div className="flex items-center space-x-2 text-white font-black text-xl tracking-tighter">
                                    <span>CERTIFIED</span>
                                </div>
                                <div className="flex items-center space-x-2 text-white font-black text-xl tracking-tighter">
                                    <span>POLYGON</span>
                                </div>
                                <div className="flex items-center space-x-2 text-white font-black text-xl tracking-tighter">
                                    <span>SEBI COMPLIANT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Bar */}
            <section className="bg-white border-y border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#F1F5F9]">
                        <div className="py-12 px-8 text-center md:text-left">
                            <div className="text-4xl font-black text-[#0F172A] mb-1">₹250Cr+</div>
                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Total Assets Transacted</div>
                        </div>
                        <div className="py-12 px-8 text-center md:text-left">
                            <div className="text-4xl font-black text-[#059669] mb-1">12.5%</div>
                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Average Annualized IRR</div>
                        </div>
                        <div className="py-12 px-8 text-center md:text-left">
                            <div className="text-4xl font-black text-[#0F172A] mb-1">15k+</div>
                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Verified Global Investors</div>
                        </div>
                        <div className="py-12 px-8 text-center md:text-left">
                            <div className="text-4xl font-black text-[#3B82F6] mb-1">0%</div>
                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">Platform Entry Fees</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-5xl font-black text-[#0F172A] mb-6 tracking-tight">Investing Designed for <span className="text-[#3B82F6]">Everyone</span></h2>
                        <p className="text-[#64748B] text-xl font-medium max-w-2xl mx-auto">
                            We've compressed a complex legal process into three intuitive digital steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-50/50 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                            <div className="w-20 h-20 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex items-center justify-center mb-8 group-hover:border-[#3B82F6] group-hover:shadow-blue-100 transition-all transform group-hover:-translate-y-2">
                                <span className="text-3xl">🧩</span>
                            </div>
                            <div className="text-7xl font-black text-[#F1F5F9] absolute top-20 right-0 -z-10 group-hover:text-blue-50 transition-colors">01</div>
                            <h3 className="text-2xl font-black text-[#0F172A] mb-4 uppercase tracking-tight">KYC Integration</h3>
                            <p className="text-[#64748B] font-medium leading-relaxed">
                                Link your PAN/Aadhar for instant, paperless identity verification compliant with Indian financial regulations.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-50/50 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                            <div className="w-20 h-20 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex items-center justify-center mb-8 group-hover:border-[#3B82F6] group-hover:shadow-blue-100 transition-all transform group-hover:-translate-y-2">
                                <span className="text-3xl">🏦</span>
                            </div>
                            <div className="text-7xl font-black text-[#F1F5F9] absolute top-20 right-0 -z-10 group-hover:text-blue-50 transition-colors">02</div>
                            <h3 className="text-2xl font-black text-[#0F172A] mb-4 uppercase tracking-tight">Select Asset</h3>
                            <p className="text-[#64748B] font-medium leading-relaxed">
                                Browse a list of institutionally vetted commercial, residential, and warehouse assets across major metros.
                            </p>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-50/50 rounded-[40px] opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10"></div>
                            <div className="w-20 h-20 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex items-center justify-center mb-8 group-hover:border-[#3B82F6] group-hover:shadow-blue-100 transition-all transform group-hover:-translate-y-2">
                                <span className="text-3xl">💰</span>
                            </div>
                            <div className="text-7xl font-black text-[#F1F5F9] absolute top-20 right-0 -z-10 group-hover:text-blue-50 transition-colors">03</div>
                            <h3 className="text-2xl font-black text-[#0F172A] mb-4 uppercase tracking-tight">Receive Yield</h3>
                            <p className="text-[#64748B] font-medium leading-relaxed">
                                Your tokens are verified on the Polygon blockchain. Rental yields are credited to your dashboard monthly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Opportunities Preview */}
            <section className="bg-white py-32 border-t border-[#E2E8F0]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div>
                            <h2 className="text-5xl font-black text-[#0F172A] mb-4 tracking-tight">Featured <span className="text-[#3B82F6]">Selection</span></h2>
                            <p className="text-[#64748B] text-xl font-medium">Curated high-performing assets currently accepting funding.</p>
                        </div>
                        <button
                            onClick={() => router.push('/properties')}
                            className="bg-[#F1F5F9] text-[#0F172A] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#E2E8F0] transition-all"
                        >
                            View Entire Marketplace ↗
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 mb-20">
                        {[
                            {
                                id: '1',
                                name: 'Horizon Tech Park',
                                location: 'Electronic City, Bangalore',
                                progress: 78,
                                type: 'COMMERCIAL',
                                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
                                yield: '10.5%'
                            },
                            {
                                id: '2',
                                name: 'North Logistics Hub',
                                location: 'Gurgaon, Haryana',
                                progress: 60,
                                type: 'WAREHOUSE',
                                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
                                yield: '12.2%'
                            },
                            {
                                id: '3',
                                name: 'Azure Heights Phase 2',
                                location: 'Mumbai, Maharashtra',
                                progress: 40,
                                type: 'RESIDENTIAL',
                                image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80',
                                yield: '8.8%'
                            }
                        ].map((property) => (
                            <div
                                key={property.id}
                                className="bg-white border border-[#E2E8F0] rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 group cursor-pointer flex flex-col"
                                onClick={() => router.push(`/properties/${property.id}`)}
                            >
                                <div className="h-60 overflow-hidden relative bg-slate-100">
                                    <img
                                        src={property.image}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={property.name}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-[#22C55E] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">ACTIVE</span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div className="text-white">
                                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">Target IRR</div>
                                            <div className="text-2xl font-black">{property.yield}</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-xl text-white font-black text-sm border border-white/30">
                                            {property.progress}% Funded
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-[#0F172A] mb-2 uppercase tracking-tight group-hover:text-[#3B82F6] transition-colors">{property.name}</h3>
                                    <p className="text-sm font-bold text-[#94A3B8] mb-6 flex items-center tracking-tight">
                                        <span className="mr-2">📍</span> {property.location.split(',')[1] || property.location.split(',')[0]}
                                    </p>
                                    <div className="w-full bg-[#F1F5F9] rounded-full h-2 mb-8 overflow-hidden">
                                        <div className="bg-[#3B82F6] h-full rounded-full transition-all duration-1000" style={{ width: `${property.progress}%` }}></div>
                                    </div>
                                    <button className="w-full border-2 border-[#E2E8F0] text-[#0F172A] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-white hover:border-[#0F172A] transition-all">
                                        Review Offering →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Global CTA Section */}
            <section className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] py-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[150px] rounded-full"></div>

                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tight">
                        Start Building Your <br className="hidden md:block" />Digital Landlord Portfolio.
                    </h2>
                    <p className="text-[#94A3B8] text-xl font-medium mb-12 max-w-2xl mx-auto">
                        Join 15,000+ smart investors today. No brokerage. No paperwork. Just returns.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <button
                            onClick={() => router.push(user ? '/dashboard' : '/auth/signup')}
                            className="bg-[#3B82F6] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#2563EB] transition-all shadow-xl shadow-blue-500/20"
                        >
                            {user ? 'Open Dashboard' : 'Initialize Account'}
                        </button>
                        <button className="text-white border-2 border-white/20 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
                            Partner Support
                        </button>
                    </div>

                    <div className="mt-16 flex justify-center items-center space-x-6 text-[#64748B]">
                        <div className="flex items-center space-x-2">
                            <span className="text-[#22C55E]">🛡️</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Bank-Grade Encryption</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-[#22C55E]">🏢</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">RERA Certified Assets</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-[#E2E8F0] py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-12 gap-16 mb-20">
                        <div className="md:col-span-5">
                            <Link href="/" className="flex items-center space-x-3 mb-8">
                                <div className="w-10 h-10 bg-[#0F172A] rounded-xl flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">🏛️</span>
                                </div>
                                <span className="text-2xl font-black text-[#0F172A]">RealBlock</span>
                            </Link>
                            <p className="text-[#64748B] text-lg font-medium leading-relaxed mb-8 max-w-sm">
                                Leading the fractional revolution. Making institutional real estate accessible to everyone through decentralized ledgers.
                            </p>
                            <div className="flex space-x-6">
                                {['Twitter', 'LinkedIn', 'Youtube'].map((social) => (
                                    <a key={social} href="#" className="text-[#94A3B8] hover:text-[#0F172A] font-black text-xs uppercase tracking-widest transition-colors">{social}</a>
                                ))}
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-8">Ecosystem</h4>
                            <ul className="space-y-4">
                                {['Marketplace', 'Dashboard', 'Wallets', 'KYC Zone'].map((item) => (
                                    <li key={item}><Link href="#" className="text-sm font-bold text-[#64748B] hover:text-[#3B82F6] transition-colors">{item}</Link></li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-2">
                            <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-8">Knowledge</h4>
                            <ul className="space-y-4">
                                {['Whitepaper', 'REITs vs Tokens', 'Risk Disclosures', 'Help Center'].map((item) => (
                                    <li key={item}><Link href="#" className="text-sm font-bold text-[#64748B] hover:text-[#3B82F6] transition-colors">{item}</Link></li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:col-span-3">
                            <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-[0.2em] mb-8">Regulatory</h4>
                            <p className="text-xs text-[#94A3B8] font-bold leading-relaxed mb-6">
                                RealBlock is a technology platform. Investment in real estate involves risks. Past performance is not indicative of future results.
                            </p>
                            <div className="text-[10px] font-black text-[#0F172A] p-2 bg-blue-50 inline-block rounded-lg uppercase tracking-widest">
                                ISO 27001 Certified
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 border-t border-[#F1F5F9] flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">© 2026 RealBlock Web3 Technologies. All rights reserved.</p>
                        <div className="flex space-x-8 text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">
                            <a href="#" className="hover:text-[#0F172A]">Privacy Architecture</a>
                            <a href="#" className="hover:text-[#0F172A]">Terminal Terms</a>
                            <a href="#" className="hover:text-[#0F172A]">Cookie Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
