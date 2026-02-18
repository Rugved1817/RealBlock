'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProfileDropdown from '@/components/ProfileDropdown';

export default function PropertiesPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [properties, setProperties] = useState<any[]>([]);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const fetchProperties = async () => {
            try {
                const response = await fetch('http://localhost:4000/api/properties');
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

    const filteredProperties = properties.filter(p => filter === 'ALL' || p.type === filter);

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
                        <nav className="hidden md:flex space-x-8">
                            <Link href="/properties" className="text-sm text-[#3B82F6] font-bold tracking-tight">Marketplace</Link>
                            <Link href="/dashboard" className="text-sm text-[#64748B] hover:text-[#0F172A] font-semibold transition-colors">Dashboard</Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            {user ? (
                                <ProfileDropdown user={user} />
                            ) : (
                                <>
                                    <button onClick={() => router.push('/auth/login')} className="text-sm font-bold text-[#64748B] hover:text-[#0F172A]">Login</button>
                                    <button onClick={() => router.push('/auth/signup')} className="bg-[#3B82F6] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#2563EB] transition-all">Get Started</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-[#1E293B] text-white py-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h1 className="text-5xl font-black mb-4 tracking-tight">Property <span className="text-[#3B82F6]">Marketplace</span></h1>
                    <p className="text-[#94A3B8] text-xl font-medium max-w-2xl">
                        Discover premium, pre-vetted real estate opportunities across India.
                    </p>
                </div>
            </section>

            {/* Filter Bar */}
            <div className="bg-white border-b border-[#E2E8F0] sticky top-20 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center space-x-4">
                        {['ALL', 'COMMERCIAL', 'RESIDENTIAL', 'WAREHOUSING'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${filter === type ? 'bg-[#3B82F6] text-white' : 'text-[#64748B] hover:bg-slate-50'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Properties Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredProperties.map((property) => (
                        <div
                            key={property.id}
                            className="bg-white border border-[#E2E8F0] rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-slate-100 transition-all duration-500 group cursor-pointer flex flex-col p-4"
                            onClick={() => router.push(`/properties/${property.id}`)}
                        >
                            {/* Property Image & Badges */}
                            <div className="h-64 overflow-hidden relative rounded-[24px] mb-6">
                                <img
                                    src={property.image}
                                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${property.status === 'FULLY_FUNDED' ? 'grayscale' : ''}`}
                                    alt={property.name}
                                />
                                <div className="absolute top-4 left-4">
                                    <div className="bg-white/95 backdrop-blur-sm text-[#475569] px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm">
                                        {property.type.replace('_', ' ')}
                                    </div>
                                </div>
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
                                <div className="flex items-center text-[#64748B] text-sm mb-6">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    {property.location}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div>
                                        <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1 text-nowrap">Asset Value</div>
                                        <div className="text-lg font-black text-[#1E293B]">{property.assetValue}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">IRR</div>
                                        <div className="text-lg font-black text-[#10B981]">{property.irr}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Yield</div>
                                        <div className="text-lg font-black text-[#3B82F6]">{property.yield}</div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mb-6">
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
        </div>
    );
}
