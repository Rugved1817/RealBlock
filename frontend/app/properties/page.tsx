'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
    id: string;
    name: string;
    location: string;
    type: string;
    totalValue: number;
    tokenPrice: number;
    totalTokens: number;
    soldTokens: number;
    expectedReturn: string;
    badge: string;
    description: string;
    image: string;
}

const ALL_PROPERTIES: Property[] = [
    {
        id: '1',
        name: 'Horizon Tech Park',
        location: 'Electronic City, Bangalore',
        type: 'COMMERCIAL',
        totalValue: 50000000,
        tokenPrice: 10000,
        totalTokens: 5000,
        soldTokens: 3900,
        expectedReturn: '12.5%',
        badge: 'FUNDED',
        description: 'Premium Grade-A commercial property with Fortune 500 tenants.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
    },
    {
        id: '2',
        name: 'North Logistics Hub',
        location: 'Gurgaon, Haryana',
        type: 'WAREHOUSE',
        totalValue: 30000000,
        tokenPrice: 15000,
        totalTokens: 2000,
        soldTokens: 1200,
        expectedReturn: '12.2%',
        badge: 'ACTIVE',
        description: 'Strategic logistics facility near NH-8 corridor.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80'
    },
    {
        id: '3',
        name: 'Azure Heights Phase 2',
        location: 'Mumbai, Maharashtra',
        type: 'RESIDENTIAL',
        totalValue: 35000000,
        tokenPrice: 7500,
        totalTokens: 4666,
        soldTokens: 1866,
        expectedReturn: '7.8%',
        badge: 'NEW',
        description: 'Luxury residential complex with modern amenities.',
        image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80'
    },
    {
        id: '4',
        name: 'Green Valley Office',
        location: 'Pune, Maharashtra',
        type: 'COMMERCIAL',
        totalValue: 28000000,
        tokenPrice: 12000,
        totalTokens: 2333,
        soldTokens: 1866,
        expectedReturn: '11.8%',
        badge: 'ACTIVE',
        description: 'Modern office space in IT corridor.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '5',
        name: 'Metro Plaza Retail',
        location: 'Delhi NCR',
        type: 'COMMERCIAL',
        totalValue: 42000000,
        tokenPrice: 9000,
        totalTokens: 4666,
        soldTokens: 3266,
        expectedReturn: '10.5%',
        badge: 'ACTIVE',
        description: 'High-footfall retail space near metro station.',
        image: 'https://images.unsplash.com/photo-1555633514-abcee6ad93e1?auto=format&fit=crop&q=80&w=800'
    },
    {
        id: '6',
        name: 'Riverside Apartments',
        location: 'Hyderabad, Telangana',
        type: 'RESIDENTIAL',
        totalValue: 25000000,
        tokenPrice: 8000,
        totalTokens: 3125,
        soldTokens: 625,
        expectedReturn: '8.2%',
        badge: 'NEW',
        description: 'Premium residential project with river views.',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
    }
];

export default function MarketplacePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [filter, setFilter] = useState<string>('ALL');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const filteredProperties = filter === 'ALL'
        ? ALL_PROPERTIES
        : ALL_PROPERTIES.filter(p => p.type === filter);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-12">
                            <Link href="/" className="flex items-center space-x-3 group text-decoration-none">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100 group-hover:scale-105 transition-transform">
                                    <span className="text-white text-xl font-bold">R</span>
                                </div>
                                <span className="text-xl font-bold text-[#0F172A]">RealBlock</span>
                            </Link>
                            <nav className="hidden md:flex space-x-8">
                                <Link href="/properties" className="text-sm text-[#3B82F6] font-bold tracking-tight">Marketplace</Link>
                                <Link href="/dashboard" className="text-sm text-[#64748B] hover:text-[#0F172A] font-semibold transition-colors">Dashboard</Link>
                                <Link href="/kyc" className="text-sm text-[#64748B] hover:text-[#0F172A] font-semibold transition-colors">KYC</Link>
                            </nav>
                        </div>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <>
                                    <div className="text-right hidden sm:block mr-2">
                                        <div className="text-sm font-bold text-[#1E293B]">{user.email}</div>
                                        <div className="text-[10px] font-bold text-[#94A3B8] uppercase">Investor</div>
                                    </div>
                                    <button
                                        onClick={() => router.push('/dashboard')}
                                        className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-all shadow-md shadow-blue-100"
                                    >
                                        My Dashboard
                                    </button>
                                    <button
                                        onClick={() => {
                                            localStorage.removeItem('user');
                                            localStorage.removeItem('token');
                                            window.location.reload();
                                        }}
                                        className="text-sm text-[#64748B] hover:text-[#EF4444] font-bold border border-[#E2E8F0] px-4 py-2.5 rounded-xl transition-all hover:bg-[#FEF2F2] hover:border-[#FEE2E2]"
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
                                        className="bg-[#3B82F6] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-all"
                                    >
                                        Get Started
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-[#1E293B] text-white py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-full bg-indigo-600/10 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">Explore Live <span className="text-[#3B82F6]">Opportunities</span></h1>
                        <p className="text-[#94A3B8] text-xl font-medium max-w-2xl">
                            Premium selection of institutional-grade commercial, residential, and warehouse assets. Hand-picked for maximum returns.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white border-b border-[#E2E8F0] sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-2">
                            {['ALL', 'COMMERCIAL', 'RESIDENTIAL', 'WAREHOUSE'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${filter === type
                                        ? 'bg-[#3B82F6] text-white shadow-lg shadow-blue-100'
                                        : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="text-sm font-bold text-[#94A3B8] uppercase tracking-widest">
                            Showing {filteredProperties.length} Properties
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => {
                        const progress = Math.round((property.soldTokens / property.totalTokens) * 100);

                        return (
                            <div
                                key={property.id}
                                className="bg-white border border-[#E2E8F0] rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 group cursor-pointer flex flex-col h-full"
                                onClick={() => router.push(`/properties/${property.id}`)}
                            >
                                {/* Property Image */}
                                <div className="relative h-64 overflow-hidden bg-slate-100">
                                    <img
                                        src={property.image}
                                        alt={property.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1000&q=80';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${property.badge === 'FUNDED' ? 'bg-[#DCFCE7] text-[#166534]' :
                                            property.badge === 'NEW' ? 'bg-[#EFF6FF] text-[#3B82F6]' :
                                                'bg-[#FEF9C3] text-[#854D0E]'
                                            }`}>
                                            {property.badge}
                                        </span>
                                        <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0F172A] shadow-sm">
                                            {property.type}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                        <div>
                                            <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Location</div>
                                            <div className="text-white font-bold text-sm">📍 {property.location.split(',')[0]}</div>
                                        </div>
                                        <div className="bg-white/20 backdrop-blur-md rounded-xl p-2 px-3 border border-white/30 text-white font-black text-lg">
                                            {progress}%
                                        </div>
                                    </div>
                                </div>

                                {/* Property Info */}
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-black text-[#1E293B] mb-2 group-hover:text-[#3B82F6] transition-colors">{property.name}</h3>
                                    <p className="text-[#64748B] text-sm font-medium mb-6 line-clamp-2 leading-relaxed">
                                        {property.description}
                                    </p>

                                    <div className="grid grid-cols-3 gap-6 mb-8 pt-6 border-t border-[#F1F5F9]">
                                        <div>
                                            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Price</div>
                                            <div className="text-lg font-black text-[#1E293B]">
                                                ₹{(property.tokenPrice / 1000).toFixed(0)}K
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Target IRR</div>
                                            <div className="text-lg font-black text-[#059669]">{property.expectedReturn}</div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Min Invest</div>
                                            <div className="text-lg font-black text-[#1E293B]">₹1L</div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-auto">
                                        <div className="flex justify-between text-[11px] font-black text-[#64748B] uppercase tracking-widest mb-3">
                                            <span>{progress}% RAISED</span>
                                            <span className="text-[#3B82F6]">{property.soldTokens} / {property.totalTokens} UNITS</span>
                                        </div>
                                        <div className="w-full bg-[#F1F5F9] rounded-full h-3 p-1">
                                            <div
                                                className="bg-gradient-to-r from-[#3B82F6] to-[#6366F1] h-full rounded-full transition-all duration-1000 shadow-sm"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/properties/${property.id}`);
                                        }}
                                        className="w-full mt-8 bg-white border-2 border-[#E2E8F0] text-[#1E293B] py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6] transition-all duration-300 shadow-sm group-hover:shadow-blue-200"
                                    >
                                        Inspect Asset →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Newsletter CTA */}
            <div className="bg-white border-t border-[#E2E8F0] py-20 mt-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-black text-[#1E293B] mb-4">Don't Miss the Next Opportunity</h2>
                    <p className="text-[#64748B] font-medium mb-10 max-w-xl mx-auto">Get notified immediately when new high-yield real estate tokens are listed on the marketplace.</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl px-6 py-4 outline-none focus:border-[#3B82F6] transition-all font-semibold"
                        />
                        <button className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">Subscribe</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
