'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Property {
    id: string;
    name: string;
    location: string;
    type: string;
    totalValue: string;
    tokenPrice: number;
    totalTokens: number;
    soldTokens: number;
    expectedReturn: string;
    targetIRR: string;
    minInvestment: string;
    description: string;
    highlights: { icon: string; text: string }[];
    image: string;
    financials: {
        rentalYield: string;
        grossYield: string;
        fees: string;
        appreciation: string;
        tenantOccupancy: string;
    };
    tenant: {
        name: string;
        description: string;
        logo: string;
    };
    documents: { name: string; type: string; size: string }[];
}

const MOCK_PROPERTY: Property = {
    id: '1',
    name: 'Grand Mercure Office Spaces',
    location: 'Electronic City Phase 1, Bangalore, KA',
    type: 'Commercial',
    totalValue: '₹ 42.5 Cr',
    tokenPrice: 8400,
    totalTokens: 100,
    soldTokens: 64,
    expectedReturn: '8.4%',
    targetIRR: '14.2%',
    minInvestment: '₹ 5,000',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    description: 'Grade A Building situated in the heart of Electronic City Phase 1. Premium commercial office space with modern amenities and high-quality construction. Leased to a Fortune 500 technology firm with a long-term commitment.',
    highlights: [
        { icon: '✓', text: 'Grade A Building situated in the heart of Electronic City.' },
        { icon: '✓', text: '100% Leased to Fortune 500 tech company.' },
        { icon: '✓', text: '9-year lock-in period ensuring stable rental income.' },
        { icon: '✓', text: 'Professional property management by JLL.' }
    ],
    financials: {
        rentalYield: '8.4%',
        grossYield: '9.5%',
        fees: '-1.1%',
        appreciation: '+12.5% in last 2 years',
        tenantOccupancy: '100%'
    },
    tenant: {
        name: 'TechGlobal Solutions Pvt Ltd.',
        description: 'Leading IT consultancy firm with 50+ offices globally.',
        logo: 'T'
    },
    documents: [
        { name: 'Property Valuation Report', type: 'PDF', size: '2.4 MB' },
        { name: 'Legal Due Diligence', type: 'PDF', size: '4.1 MB' },
        { name: 'Tenancy Agreement', type: 'DOCX', size: '1.2 MB' },
        { name: 'SPV Structure', type: 'PDF', size: '0.8 MB' }
    ]
};

export default function PropertyDetailPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [sqftCount, setSqftCount] = useState(10);
    const [activeTab, setActiveTab] = useState('Highlights');
    const [chartRange, setChartRange] = useState('1Y');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
    }, []);

    const property = MOCK_PROPERTY;
    const progress = 64;
    const unitCost = sqftCount * property.tokenPrice;
    const processingFee = Math.round(unitCost * 0.01);
    const gasFee = 450;
    const totalInvestment = unitCost + gasFee;

    const tabs = ['Highlights', 'Financials', 'Legal Docs', 'Appreciation Forecast'];

    return (
        <div className={`min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 ${isCheckoutOpen ? 'overflow-hidden' : ''}`}>
            {/* Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsCheckoutOpen(false)}
                    ></div>

                    <div className="relative bg-white w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                    <span className="text-white font-bold text-sm">R</span>
                                </div>
                                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Checkout</h2>
                            </div>
                            <button
                                onClick={() => setIsCheckoutOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Property Mini Card */}
                            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex items-center space-x-4">
                                <div className="w-20 h-16 rounded-xl overflow-hidden shadow-sm shrink-0">
                                    <img src={property.image} className="w-full h-full object-cover" alt={property.name} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-800 leading-tight">{property.name}</h3>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit 402 • {property.type} • Bangalore</p>
                                    <div className="inline-flex items-center bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase ring-1 ring-blue-100">
                                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-1.5"></span>
                                        Live Deal
                                    </div>
                                </div>
                            </div>

                            {/* Transaction Details */}
                            <div className="space-y-4">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">TRANSACTION DETAILS</h3>
                                <div className="space-y-3 px-1">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-400">Units Purchased</span>
                                        <span className="font-black text-slate-800 tracking-tight">{sqftCount} SQFT</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-400">Price per SQFT</span>
                                        <span className="font-black text-slate-800 tracking-tight">₹{property.tokenPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="font-bold text-slate-400">Subtotal</span>
                                        <span className="font-black text-slate-800 tracking-tight">₹{unitCost.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-start text-sm pt-2 border-t border-dashed border-slate-100">
                                        <div className="flex items-center group relative font-bold text-slate-400">
                                            Network Gas Fees (Est.)
                                            <svg className="w-4 h-4 ml-1.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-slate-800 leading-none">~ ₹{gasFee}</div>
                                            <div className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">0.002 ETH</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex justify-between items-end px-1">
                                <div className="space-y-1">
                                    <div className="text-sm font-bold text-slate-800">Total Payable</div>
                                    <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                        <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.9L10 .155 17.834 4.9a1 1 0 01.5 1.154l-2.074 8.294a8 8 0 01-4.706 5.485l-1.42.473a1 1 0 01-.668 0l-1.42-.473a8 8 0 01-4.706-5.485L1.667 6.054a1 1 0 01.5-1.154zM10 3.012L4.544 6.307l1.765 7.062a6 6 0 003.53 4.114l.161.054.162-.054a6 6 0 003.53-4.114l1.765-7.062L10 3.012zM8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                                        Secure Checkout
                                    </div>
                                </div>
                                <div className="text-3xl font-black text-slate-900 tracking-tighter">
                                    ₹{totalInvestment.toLocaleString()}
                                </div>
                            </div>

                            {/* Note Box */}
                            <div className="bg-blue-50/40 border border-blue-100/50 rounded-2xl p-5 flex items-start space-x-4">
                                <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                                    By confirming, you agree to sign the transaction via your connected wallet. Ownership tokens will be transferred upon network confirmation.
                                </p>
                            </div>

                            <button className="w-full bg-[#1D72E8] text-white py-5 rounded-[20px] font-black text-sm tracking-wide shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]">
                                Confirm Purchase →
                            </button>

                            {/* Footer Badges */}
                            <div className="flex items-center justify-center space-x-10 pt-2 opacity-60">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SSLEncrypted</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Audited Contract</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Header / Top Nav */}
            <nav className="border-b border-slate-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-12">
                        <Link href="/" className="flex items-center space-x-2 group">
                            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                                <span className="text-white font-bold text-lg leading-none">R</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-800">RealBlock</span>
                        </Link>
                        <div className="hidden md:flex space-x-8 text-sm font-semibold text-slate-500">
                            <Link href="/properties" className="text-blue-600 border-b-2 border-blue-600 pb-1">Marketplace</Link>
                            <Link href="/portfolio" className="hover:text-slate-800">Portfolio</Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="bg-slate-50 px-4 py-2 rounded-lg flex items-center space-x-3 border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Balance</span>
                            <span className="text-sm font-bold">₹ 24,500</span>
                            <div className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs">+</div>
                        </div>
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                        </div>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold border-2 border-white shadow-sm overflow-hidden">
                            {user ? user.email[0].toUpperCase() : 'U'}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-2 text-xs font-semibold text-slate-400">
                <Link href="/properties" className="hover:text-slate-600">Marketplace</Link>
                <span>›</span>
                <Link href="#" className="hover:text-slate-600">Commercial</Link>
                <span>›</span>
                <span className="text-slate-600">{property.name}</span>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Hero Image */}
                        <div className="relative rounded-2xl overflow-hidden h-[450px] shadow-sm group">
                            <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt={property.name} />
                            <div className="absolute top-6 left-6 flex items-center space-x-3">
                                <span className="bg-emerald-500 text-white px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-md">LIVE</span>
                                <span className="bg-white/90 backdrop-blur-sm text-blue-600 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-slate-200 shadow-md flex items-center">
                                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                                    VERIFIED ASSET
                                </span>
                            </div>
                            <div className="absolute bottom-6 right-6 flex space-x-3">
                                <button className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                </button>
                                <button className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg flex items-center justify-center text-white hover:bg-white/40 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                                </button>
                            </div>
                        </div>

                        {/* Title & Stats Bar */}
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800 mb-2">{property.name}</h1>
                                <p className="text-slate-400 font-semibold flex items-center text-sm">
                                    <svg className="w-4 h-4 mr-1 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                    {property.location}
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Asset Value</div>
                                <div className="text-2xl font-bold text-slate-800">{property.totalValue}</div>
                            </div>
                        </div>

                        {/* 4-Stat Grid */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: 'Rental Yield', value: property.expectedReturn, color: 'text-blue-600' },
                                { label: 'Target IRR', value: property.targetIRR, color: 'text-slate-800' },
                                { label: 'Min Investment', value: property.minInvestment, color: 'text-slate-800' },
                                { label: 'Funded', value: `${progress}%`, color: 'text-slate-800', progress: true }
                            ].map((stat, i) => (
                                <div key={i} className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{stat.label}</div>
                                    <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                                    {stat.progress && (
                                        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Price Appreciation Section */}
                        <div className="border border-slate-100 rounded-2xl p-8 space-y-6">
                            <div className="flex justify-between items-center">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-bold">Price Appreciation</h2>
                                    <p className="text-xs font-bold text-emerald-500 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg>
                                        +12.5% in last 2 years
                                    </p>
                                </div>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    {['1M', '6M', '1Y', 'ALL'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setChartRange(range)}
                                            className={`px-4 py-1.5 rounded-md text-[10px] font-bold tracking-widest transition-all ${chartRange === range ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SVG Chart */}
                            <div className="h-64 w-full relative pt-4">
                                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-[10px] font-bold text-slate-300 pointer-events-none">
                                    <span>₹ 9,000</span>
                                    <span>₹ 8,500</span>
                                    <span>₹ 8,000</span>
                                    <span>₹ 7,500</span>
                                </div>
                                <svg className="w-full h-full pl-12" viewBox="0 0 800 200" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
                                            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,150 L200,120 L400,100 L600,60 L800,20 L800,200 L0,200 Z" fill="url(#chartFill)" />
                                    <path d="M0,150 L200,120 L400,100 L600,60 L800,20" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                                    <circle cx="800" cy="20" r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />

                                    {/* Grid Lines */}
                                    <line x1="0" y1="20" x2="800" y2="20" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="65" x2="800" y2="65" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="110" x2="800" y2="110" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4" />
                                    <line x1="0" y1="155" x2="800" y2="155" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4" />
                                </svg>
                                <div className="flex justify-between pl-12 mt-4 text-[10px] font-bold text-slate-300">
                                    <span>Jan 23</span>
                                    <span>Apr 23</span>
                                    <span>Jul 23</span>
                                    <span>Oct 23</span>
                                    <span>Jan 24</span>
                                </div>
                            </div>
                        </div>

                        {/* Property Tabs Area */}
                        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                            <div className="flex border-b border-slate-100 px-6">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-5 text-sm font-bold transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full"></div>}
                                    </button>
                                ))}
                            </div>
                            <div className="p-8">
                                {activeTab === 'Highlights' && (
                                    <div className="space-y-10">
                                        <div className="grid md:grid-cols-2 gap-12">
                                            <div className="space-y-6">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Property Highlights</h3>
                                                <ul className="space-y-5">
                                                    {property.highlights.map((h, i) => (
                                                        <li key={i} className="flex items-start group">
                                                            <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mr-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">✓</div>
                                                            <span className="text-sm font-semibold text-slate-600 leading-relaxed">{h.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location Map</h3>
                                                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-100 group">
                                                    <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-1000" alt="Map" />
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/20">
                                                        <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white mb-3 shadow-lg ring-4 ring-white">
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                                        </div>
                                                        <button className="bg-white text-slate-800 px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-slate-50 transition-colors border border-slate-100">View on Maps</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 border-t border-slate-100 pt-10">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tenant Profile</h3>
                                            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-6 flex items-center space-x-6 hover:bg-white hover:border-blue-100 transition-all cursor-default">
                                                <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-sm">T</div>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-800">{property.tenant.name}</h4>
                                                    <p className="text-xs font-medium text-slate-500">{property.tenant.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab !== 'Highlights' && (
                                    <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest opacity-60">Financial data loading...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Investment Console */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Investment Card */}
                            <div className="border border-blue-600 rounded-xl p-8 bg-white shadow-xl shadow-blue-50 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Unit Price</div>
                                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase ring-1 ring-emerald-100">Yielding</span>
                                    </div>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-3xl font-bold text-slate-800">₹ 8,400</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ sq.ft</span>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <div className="text-[11px] font-bold text-slate-500">I want to buy</div>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={sqftCount}
                                                onChange={(e) => setSqftCount(parseInt(e.target.value) || 0)}
                                                className="w-full bg-white border border-slate-200 rounded-lg px-6 py-4 font-bold text-lg outline-none focus:border-blue-600 transition-colors"
                                            />
                                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300 uppercase tracking-widest pointer-events-none">SQFT</span>
                                        </div>
                                        <div className="py-2">
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={sqftCount}
                                                onChange={(e) => setSqftCount(parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <div className="flex justify-between mt-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                                                <span>1 sqft</span>
                                                <span>100 sqft</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-start space-x-3">
                                        <div className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] shrink-0">🏷️</div>
                                        <div>
                                            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider leading-none mb-1">Bulk Discount Applied: 2%</div>
                                            <p className="text-[9px] font-medium text-blue-500">Buy 50+ sqft to unlock 5% off fee</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 border-t border-slate-100 pt-6">
                                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                                            <span>Unit Cost ({sqftCount} x ₹8,400)</span>
                                            <span>₹ {unitCost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-semibold text-slate-500">
                                            <span>Processing Fee (1%)</span>
                                            <span>₹ {processingFee.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-baseline pt-4">
                                        <span className="text-lg font-bold text-slate-800">Total Investment</span>
                                        <span className="text-2xl font-bold text-slate-800">₹ {totalInvestment.toLocaleString()}</span>
                                    </div>

                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full bg-blue-600 text-white py-5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0"
                                    >
                                        Buy Now →
                                    </button>

                                    <div className="text-center">
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em] flex items-center justify-center">
                                            <svg className="w-3 h-3 mr-2 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                            Secure transaction via Blockchain
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Yield Breakdown Card */}
                            <div className="border border-slate-100 rounded-xl p-8 bg-white shadow-sm space-y-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-800">Yield Breakdown</h3>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-400">Gross Yield</span>
                                            <span className="text-slate-800">9.5%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-400">Fees and Maintenance</span>
                                            <span className="text-red-500">-1.1%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div className="bg-red-400 h-full rounded-full" style={{ width: '15%' }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-50 flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Yield</span>
                                        <span className="text-2xl font-bold text-blue-600">8.4%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Help Card */}
                            <div className="bg-blue-50/30 border border-blue-100/50 rounded-xl p-5 flex items-center justify-between group cursor-pointer hover:bg-blue-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-white shadow-sm border border-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-xs font-bold text-slate-800">Have questions?</div>
                                        <p className="text-[10px] font-semibold text-blue-600">Talk to an investment expert</p>
                                    </div>
                                </div>
                                <div className="text-blue-400 group-hover:translate-x-1 transition-transform">→</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Clean Footer */}
            <footer className="border-t border-slate-100 py-12 bg-slate-50/30">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2023 RealBlock Technologies Pvt Ltd.
                    </div>
                    <div className="flex space-x-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <Link href="#" className="hover:text-slate-600">Privacy Policy</Link>
                        <Link href="#" className="hover:text-slate-600">Terms of Service</Link>
                        <Link href="#" className="hover:text-slate-600">Risk Disclosure</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

