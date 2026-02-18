'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function HomePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [properties, setProperties] = useState<any[]>([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/properties/featured');
                if (response.ok) {
                    const data = await response.json();
                    setProperties(data);
                }
            } catch (error) {
                console.error('Error fetching properties:', error);
            }
        };
        fetchProperties();
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
                                <ProfileDropdown user={user} />
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
            <section className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-r from-[#F8FAFC] to-[#4A6F5F]">
                {/* Visual Watermark (Decorative) */}
                <div className="absolute top-40 right-4 opacity-10 select-none pointer-events-none hidden lg:block text-right">
                    <div className="text-[140px] font-black text-white leading-[0.9] tracking-tighter">MODERN</div>
                    <div className="text-[140px] font-black text-white leading-[0.9] tracking-tighter">REAL</div>
                    <div className="text-[140px] font-black text-white leading-[0.9] tracking-tighter">ESTATE</div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6 z-10">
                    <div className="max-w-3xl">
                        {/* Status Badge */}
                        <div className="inline-flex items-center space-x-3 bg-[#E8F1FF] border border-blue-100/50 px-5 py-2.5 rounded-full mb-12 transition-transform hover:scale-105 cursor-default shadow-sm">
                            <span className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full animate-pulse"></span>
                            <span className="text-[#3B82F6] text-[12px] font-bold tracking-tight">Now Live: Brigade Tech Gardens</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-7xl md:text-8xl font-black text-[#0F172A] leading-[1.05] tracking-tight mb-8">
                            Invest in <span className="text-[#3B82F6]">Real <br />Estate</span>, One <br />Square Foot at a Time.
                        </h1>

                        <p className="text-[#475569] text-xl font-medium mb-12 leading-relaxed max-w-2xl">
                            Access institutional-grade real estate opportunities starting at just <span className="text-[#0F172A] font-bold">₹5,000</span>. Earn rental yield and benefit from capital appreciation powered by secure blockchain technology.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
                            <button
                                onClick={() => router.push('/properties')}
                                className="w-full sm:w-auto bg-[#1D70D1] text-white px-10 py-5 rounded-xl font-bold text-sm tracking-tight hover:bg-[#165BA8] transition-all shadow-xl shadow-blue-200"
                            >
                                Explore Properties
                            </button>
                            <a
                                href="https://www.youtube.com/watch?v=6cCkimumA6Y"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-white border border-[#E2E8F0] text-[#0F172A] px-10 py-5 rounded-xl font-bold text-sm tracking-tight hover:bg-gray-50 transition-all shadow-sm"
                            >
                                <span className="text-blue-600 text-lg">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                    </svg>
                                </span>
                                <span>How it Works</span>
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="pt-12 border-t border-[#CBD5E1]/40">
                            <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-[0.1em] mb-8">
                                TRUSTED & AUDITED BY
                            </p>
                            <div className="flex flex-wrap items-center gap-10 md:gap-14 opacity-70">
                                <div className="flex items-center space-x-2 text-[#475569] font-bold text-lg tracking-tight">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 18c-3.14-.94-6-4.9-6-8V8.34l6-3.33 6 3.33V12c0 3.1-2.86 7.06-6 8zm1-11h-2v6h2V9z" />
                                    </svg>
                                    <span>CertiK</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[#475569] font-bold text-lg tracking-tight">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2c3.14.94 6 4.9 6 8s-2.86 7.06-6 8-6-4.9-6-8 2.86-7.06 6-8zm-1 3v6h2V6h-2z" />
                                    </svg>
                                    <span>SEBI Reg.</span>
                                </div>
                                <div className="flex items-center space-x-2 text-[#475569] font-bold text-lg tracking-tight">
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2L1 12l11 10 11-10L12 2zm0 18.5L3.5 12 12 5.5 20.5 12 12 20.5z" />
                                    </svg>
                                    <span>Polygon</span>
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

            {/* Democratizing Section (How It Works) */}
            <section id="how-it-works" className="py-32 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-[#1E293B] mb-6 tracking-tight">Democratizing Real Estate Investing</h2>
                        <p className="text-[#64748B] text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                            Our platform bridges the gap between traditional real estate ownership and modern digital assets in three simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white border border-[#E2E8F0] p-10 rounded-[32px] relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500">
                                    {/* Fingerprint Icon */}
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12c0-2.209 1.791-4 4-4s4 1.791 4 4v2a2 2 0 0 0 4 0v-2c0-4.418-3.582-8-8-8s-8 3.582-8 8v7h4v-7z"></path>
                                        <path d="M5 15a7 7 0 0 0 14 0"></path>
                                        <path d="M8 12a4 4 0 0 1 8 0v2"></path>
                                        <path d="M12 11v3"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-[#1E293B] mb-6">Complete KYC</h3>
                                <p className="text-[#64748B] font-medium leading-relaxed">
                                    Sign up in minutes using your Aadhaar and PAN. Our secure digital verification process ensures compliance and safety for all investors.
                                </p>
                            </div>
                            <div className="absolute top-[-10px] right-2 text-[180px] font-black text-[#E8F1FF] opacity-60 select-none pointer-events-none -z-0">1</div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white border border-[#E2E8F0] p-10 rounded-[32px] relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500">
                                    {/* Storefront/Shop Icon */}
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="10" width="20" height="12" rx="2"></rect>
                                        <path d="M2 7l1-4h18l1 4"></path>
                                        <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
                                        <path d="M6 10v0a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v0"></path>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-[#1E293B] mb-6">Select & Invest</h3>
                                <p className="text-[#64748B] font-medium leading-relaxed">
                                    Browse pre-vetted Grade-A commercial and residential properties. Purchase tokenized square feet starting from as low as ₹5,000.
                                </p>
                            </div>
                            <div className="absolute top-[-10px] right-2 text-[180px] font-black text-[#E8F1FF] opacity-60 select-none pointer-events-none -z-0">2</div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white border border-[#E2E8F0] p-10 rounded-[32px] relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500">
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110 duration-500">
                                    {/* Trending Up Icon */}
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                                        <polyline points="17 6 23 6 23 12"></polyline>
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-black text-[#1E293B] mb-6">Earn & Track</h3>
                                <p className="text-[#64748B] font-medium leading-relaxed">
                                    Receive monthly rental yields directly to your wallet. Track capital appreciation in real-time and exit anytime via our secondary marketplace.
                                </p>
                            </div>
                            <div className="absolute top-[-10px] right-2 text-[180px] font-black text-[#E8F1FF] opacity-60 select-none pointer-events-none -z-0">3</div>
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
                        {(properties.length > 0 ? properties : [
                            {
                                id: '1',
                                name: 'Horizon Tech Park',
                                location: 'Bengaluru, India',
                                type: 'COMMERCIAL',
                                assetValue: '₹85 Cr',
                                irr: '11.8%',
                                yield: '8.5%',
                                progress: 65,
                                minInvestment: '₹5,000',
                                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80',
                                status: 'OPEN'
                            },
                            {
                                id: '2',
                                name: 'North Logistics Hub',
                                location: 'Bhiwandi, Mumbai',
                                type: 'WAREHOUSING',
                                assetValue: '₹42 Cr',
                                irr: '13.2%',
                                yield: '9.1%',
                                progress: 22,
                                minInvestment: '₹10,000',
                                image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
                                status: 'OPEN'
                            },
                            {
                                id: '3',
                                name: 'Azure Heights Phase 2',
                                location: 'Hyderabad, India',
                                type: 'RESIDENTIAL',
                                assetValue: '₹120 Cr',
                                irr: '14.5%',
                                yield: '7.8%',
                                progress: 100,
                                minInvestment: '₹25,000',
                                image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80',
                                status: 'FULLY_FUNDED'
                            }
                        ]).map((property) => (
                            <div
                                key={property.id}
                                className="bg-white border border-[#E2E8F0] rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 group cursor-pointer flex flex-col p-4"
                                onClick={() => router.push(`/properties/${property.id}`)}
                            >
                                {/* Property Image & Badges */}
                                <div className="h-64 overflow-hidden relative rounded-[24px] mb-6">
                                    <img
                                        src={property.image}
                                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${property.status === 'FULLY_FUNDED' || property.status === 'FUNDED' ? 'grayscale' : ''}`}
                                        alt={property.name}
                                    />

                                    {/* Type Badge */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-white/95 backdrop-blur-sm text-[#475569] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                            {property.type.replace('_', ' ')}
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        {property.status === 'OPEN' ? (
                                            <div className="bg-[#22C55E] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                                                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                                                Open
                                            </div>
                                        ) : (
                                            <div className="bg-[#1E293B]/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">
                                                Fully Funded
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-2 pb-2">
                                    <h3 className="text-[22px] font-black text-[#1E293B] mb-2">{property.name}</h3>
                                    <div className="flex items-center text-[#64748B] text-sm mb-8">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                            <circle cx="12" cy="10" r="3"></circle>
                                        </svg>
                                        {property.location}
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4 mb-8">
                                        <div>
                                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5 text-nowrap">Asset Value</div>
                                            <div className="text-lg font-black text-[#1E293B]">{property.assetValue}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">IRR</div>
                                            <div className="text-lg font-black text-[#10B981]">{property.irr}</div>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1.5">Yield</div>
                                            <div className="text-lg font-black text-[#3B82F6]">{property.yield}</div>
                                        </div>
                                    </div>

                                    {/* Progress Section */}
                                    <div className="mb-8">
                                        <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden mb-3">
                                            <div
                                                className={`h-full transition-all duration-1000 ${property.status === 'OPEN' ? 'bg-[#3B82F6]' : 'bg-[#10B981]'}`}
                                                style={{ width: `${property.progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center text-[12px] font-bold">
                                            {property.status === 'OPEN' ? (
                                                <>
                                                    <span className="text-[#64748B]">{property.progress}% Funded</span>
                                                    <span className="text-[#64748B]">{property.minInvestment} Min</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[#10B981]">Sold Out</span>
                                                    <span className="text-[#94A3B8]">Waitlist Open</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all border-2 ${property.status === 'OPEN'
                                                ? 'border-[#3B82F6] text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white'
                                                : 'border-[#F1F5F9] bg-[#F8FAFC] text-[#94A3B8] cursor-not-allowed'
                                            }`}
                                    >
                                        View Details
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
