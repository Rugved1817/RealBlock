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
    highlights: string[];
    image: string;
    locationMap?: string;
    financials?: {
        rentalYield: string;
        grossYield: string;
        fees: string;
        appreciation: string;
        tenantOccupancy: string;
    };
    tenant?: {
        name: string;
        description: string;
        logo: string;
    };
    documents?: { name: string; type: string; size: string }[];
    priceHistory?: { date: string; value: number }[];
}

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [sqftCount, setSqftCount] = useState(10);
    const [activeTab, setActiveTab] = useState('Highlights');
    const [chartRange, setChartRange] = useState('1Y');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));

        const fetchProperty = async () => {
            if (!params?.id) return;

            try {
                const response = await fetch(`http://localhost:4000/api/properties/${params.id}`);

                if (response.ok) {
                    const data = await response.json();

                    setProperty({
                        ...data,
                        totalValue: data.assetValue,
                        expectedReturn: data.yield,
                        targetIRR: data.irr,
                        tokenPrice: data.pricePerSqft || 5000,
                        totalTokens: data.totalSqft || 10000,
                        soldTokens: data.sqftSold || 0,
                        highlights: data.highlights || [],
                        financials: data.financials || {},
                        tenant: {
                            name: data.tenantName,
                            description: data.tenantDescription,
                            logo: data.tenantLogo
                        },
                        documents: data.documents || [],
                        priceHistory: data.priceHistory || []
                    });
                } else {
                    console.error('Property not found');
                }
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [params?.id]);

    const handlePurchase = async () => {
        if (!user) {
            alert('Please login to purchase');
            router.push('/auth/login');
            return;
        }
        if (!property) return;

        setPurchaseLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/api/properties/${property.id}/invest`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    sqftAmount: sqftCount
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Purchase Successful! Transaction ID: ' + (result?.transaction?.id || 'Pending'));
                setIsCheckoutOpen(false);
                // Refresh property data
                window.location.reload();
            } else {
                alert('Purchase Failed: ' + (result?.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Purchase failed due to network error');
        } finally {
            setPurchaseLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Property Not Found</h2>
                <button
                    onClick={() => router.push('/properties')}
                    className="text-blue-600 font-bold hover:underline"
                >
                    Back to Marketplace
                </button>
            </div>
        );
    }

    const progress = Math.round((property.soldTokens / property.totalTokens) * 100) || 0;
    const unitCost = sqftCount * property.tokenPrice;
    const processingFee = Math.round(unitCost * 0.01);
    const gasFee = 450;
    const totalInvestment = unitCost + gasFee;

    const tabs = ['Highlights', 'Financials', 'Legal Docs', 'Appreciation Forecast'];

    // Graph Data Logic
    // Enhanced Graph Logic
    const dummyData = [
        { date: 'Aug 2023', value: 5622 },
        { date: 'Sep 2023', value: 6199 },
        { date: 'Oct 2023', value: 6390 },
        { date: 'Nov 2023', value: 6939 },
        { date: 'Dec 2023', value: 7202 },
        { date: 'Jan 2024', value: 7335 },
        { date: 'Feb 2024', value: 7468 },
        { date: 'Mar 2024', value: 7607 },
        { date: 'Apr 2024', value: 8016 },
        { date: 'May 2024', value: 8232 },
    ];

    const graphData = property.priceHistory && property.priceHistory.length > 2
        ? property.priceHistory
        : dummyData;

    const startVal = graphData[0]?.value || 0;
    const endVal = graphData[graphData.length - 1]?.value || 0;
    const growth = startVal ? ((endVal - startVal) / startVal) * 100 : 0;
    const isPositive = growth >= 0;
    const growthStr = isPositive ? `+${growth.toFixed(2)}%` : `${growth.toFixed(2)}%`;

    // SVG Dimensions
    const width = 800;
    const height = 300;
    const paddingX = 50;
    const paddingY = 60;

    const maxVal = Math.max(...graphData.map(d => d.value)) * 1.1;
    const minVal = Math.min(...graphData.map(d => d.value)) * 0.9;
    const range = maxVal - minVal;

    const points = graphData.map((d, i) => {
        const x = paddingX + (i / (graphData.length - 1)) * (width - 2 * paddingX);
        const y = height - paddingY - ((d.value - minVal) / range) * (height - 2 * paddingY);
        return { ...d, x, y };
    });

    // Generate smooth bezier path
    let linePath = `M ${points[0].x} ${points[0].y}`;
    if (points.length > 2) {
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = i > 0 ? points[i - 1] : points[0];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = i !== points.length - 2 ? points[i + 2] : p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;

            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            linePath += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
        }
    } else {
        points.forEach((p, i) => {
            if (i > 0) linePath += ` L ${p.x} ${p.y}`;
        });
    }

    const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return (
        <div className={`min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 ${isCheckoutOpen ? 'overflow-hidden' : ''}`}>
            {/* Checkout Modal Overlay */}
            {isCheckoutOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => !purchaseLoading && setIsCheckoutOpen(false)}
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
                                disabled={purchaseLoading}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-50"
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
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Unit 402 • {property.type} • {property.location.split(',')[0]}</p>
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

                            <button
                                onClick={handlePurchase}
                                disabled={purchaseLoading}
                                className="w-full bg-[#1D72E8] text-white py-5 rounded-[20px] font-black text-sm tracking-wide shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {purchaseLoading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></span>
                                        Processing...
                                    </>
                                ) : (
                                    'Confirm Purchase →'
                                )}
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



            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center space-x-2 text-xs font-semibold text-slate-400">
                <Link href="/properties" className="hover:text-slate-600">Marketplace</Link>
                <span>›</span>
                <Link href="#" className="hover:text-slate-600">{property.type}</Link>
                <span>›</span>
                <span className="text-slate-600">{property.name}</span>
            </div>

            <main className="max-w-7xl mx-auto px-6 pb-24">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Hero Image */}
                        {/* Immersive Hero Section */}
                        <div className="relative rounded-3xl overflow-hidden h-[500px] shadow-2xl shadow-blue-900/10 group">
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent z-10 transition-opacity duration-500"></div>
                            <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out will-change-transform" alt={property.name} />

                            {/* Top Badges */}
                            <div className="absolute top-6 left-6 z-20 flex gap-3">
                                <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg backdrop-blur-md ${property.soldTokens >= property.totalTokens ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white'}`}>
                                    {property.soldTokens >= property.totalTokens ? 'Sold Out' : 'Live Deal'}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-white/20 shadow-lg flex items-center">
                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
                                    Verified Asset
                                </span>
                            </div>

                            {/* Bottom Content overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                                    <div className="space-y-2 max-w-2xl">
                                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">{property.name}</h1>
                                        <p className="flex items-center text-lg font-medium text-slate-200">
                                            <svg className="w-5 h-5 mr-1.5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                            {property.location}
                                        </p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[140px]">
                                        <div className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Asset Value</div>
                                        <div className="text-2xl font-bold text-white tracking-tight">{property.totalValue}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="prose prose-slate max-w-none">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center">
                                <span className="w-8 h-[2px] bg-blue-600 mr-3"></span> Description
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg font-medium">
                                {property.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    label: 'Rental Yield',
                                    value: property.expectedReturn,
                                    icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
                                    color: 'text-blue-600',
                                    bg: 'bg-blue-50'
                                },
                                {
                                    label: 'Target IRR',
                                    value: property.targetIRR,
                                    icon: <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                                    color: 'text-emerald-600',
                                    bg: 'bg-emerald-50'
                                },
                                {
                                    label: 'Min Investment',
                                    value: property.minInvestment,
                                    icon: <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                                    color: 'text-slate-900',
                                    bg: 'bg-indigo-50'
                                },
                                {
                                    label: 'Funded',
                                    value: `${Math.round((property.soldTokens / property.totalTokens) * 100)}%`,
                                    sub: `${(property.soldTokens || 0).toLocaleString()} / ${(property.totalTokens || 0).toLocaleString()}`,
                                    icon: <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                                    color: 'text-slate-900',
                                    bg: 'bg-orange-50',
                                    progress: true
                                }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity`}>
                                        <div className={`p-2 rounded-xl ${stat.bg}`}>{stat.icon}</div>
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{stat.label}</div>
                                    <div className={`text-2xl font-black ${stat.color} tracking-tight`}>{stat.value}</div>
                                    {stat.sub && <div className="text-xs font-semibold text-slate-400 mt-1">{stat.sub}</div>}
                                    {stat.progress && (
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                                            <div className="bg-orange-500 h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Price Appreciation Section */}
                        {/* Price Appreciation Section (Updated Design) */}
                        <div className="border border-slate-100 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow duration-500">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Historic Returns</h2>
                                    <div className="flex items-center mt-2 space-x-2">
                                        <div className={`flex items-center px-2 py-0.5 rounded text-sm font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d={isPositive ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} />
                                            </svg>
                                            {growthStr}
                                        </div>
                                        <span className="text-xs font-semibold text-slate-400">in last {chartRange === 'ALL' ? '3 years' : chartRange}</span>
                                    </div>
                                </div>

                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                    {['1M', '6M', '1Y', 'ALL'].map(range => (
                                        <button
                                            key={range}
                                            onClick={() => setChartRange(range)}
                                            className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-200 ${chartRange === range
                                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Enhanced Chart */}
                            <div className="relative w-full aspect-[2/1] md:aspect-[2.5/1]">
                                <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
                                    <defs>
                                        <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                                        </linearGradient>
                                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4F46E5" floodOpacity="0.15" />
                                        </filter>
                                    </defs>

                                    {/* Grid Lines & Labels */}
                                    {points.map((p, i) => (
                                        <g key={`grid-${i}`}>
                                            {/* Dashed Drop Line */}
                                            <line
                                                x1={p.x} y1={p.y}
                                                x2={p.x} y2={height}
                                                stroke="#E2E8F0"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                            />

                                            {/* X-axis Label */}
                                            {(i % 2 === 0 || i === points.length - 1) && (
                                                <text
                                                    x={p.x} y={height + 25}
                                                    textAnchor="middle"
                                                    className="text-[10px] font-bold fill-slate-400 uppercase tracking-wider"
                                                >
                                                    {p.date}
                                                </text>
                                            )}

                                            {/* Tooltip-like Price Label above point */}
                                            <text
                                                x={p.x} y={p.y - 12}
                                                textAnchor="middle"
                                                className={`text-[10px] font-bold ${i === points.length - 1 ? 'fill-blue-600 text-lg' : 'fill-slate-500'}`}
                                            >
                                                ₹{p.value.toLocaleString()}
                                            </text>
                                        </g>
                                    ))}

                                    {/* Area Fill */}
                                    <path d={areaPath} fill="url(#gradientArea)" />

                                    {/* The Smooth Line */}
                                    <path d={linePath} fill="none" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#shadow)" />

                                    {/* Data Points */}
                                    {points.map((p, i) => (
                                        <circle
                                            key={`dot-${i}`}
                                            cx={p.x} cy={p.y}
                                            r={i === points.length - 1 ? 6 : 4}
                                            fill="white"
                                            stroke={i === points.length - 1 ? "#2563EB" : "#4F46E5"}
                                            strokeWidth="2.5"
                                            className="hover:r-8 transition-all duration-300 cursor-pointer"
                                        />
                                    ))}
                                </svg>
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
                                                    {(property.highlights || []).map((text, i) => (
                                                        <li key={i} className="flex items-start group">
                                                            <div className="w-5 h-5 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold mr-4 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">✓</div>
                                                            <span className="text-sm font-semibold text-slate-600 leading-relaxed">{text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="space-y-6">
                                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location Map</h3>
                                                <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-100 group">
                                                    <img src={property.locationMap || "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80"} className="w-full h-full object-cover opacity-60 grayscale group-hover:scale-105 transition-transform duration-1000" alt="Map" />
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
                                                <div className="w-14 h-14 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-2xl shadow-sm">
                                                    {property.tenant?.logo || property.tenant?.name?.[0] || 'T'}
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-slate-800">{property.tenant?.name || 'Confident Tenant'}</h4>
                                                    <p className="text-xs font-medium text-slate-500">{property.tenant?.description || 'Leading corporate entity.'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'Financials' && (
                                    <div className="py-10 grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-semibold text-slate-600">Rental Yield</span>
                                                <span className="text-lg font-bold text-blue-600">{property.financials?.rentalYield}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-semibold text-slate-600">Gross Yield</span>
                                                <span className="text-lg font-bold text-slate-800">{property.financials?.grossYield}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-semibold text-slate-600">Fees</span>
                                                <span className="text-lg font-bold text-red-500">{property.financials?.fees}</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg">
                                                <span className="text-sm font-semibold text-slate-600">Occupancy</span>
                                                <span className="text-lg font-bold text-emerald-600">{property.financials?.tenantOccupancy}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'Legal Docs' && (
                                    <div className="py-6 space-y-4">
                                        {(property.documents || []).map((doc, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                                                        {doc.type}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{doc.name}</div>
                                                        <div className="text-xs text-slate-400">{doc.size}</div>
                                                    </div>
                                                </div>
                                                <div className="text-slate-300 group-hover:text-blue-600">↓</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'Appreciation Forecast' && (
                                    <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                                        <p className="text-sm font-medium">Forecast data is generated quarterly based on market analysis.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Investment Console */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-6 space-y-6">
                            {/* Investment Card */}
                            <div className="border border-blue-100 rounded-3xl p-8 bg-white shadow-[0_20px_40px_-15px_rgba(37,99,235,0.1)] relative overflow-hidden backdrop-blur-xl">
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>

                                <div className="space-y-6 relative">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Investment</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-baseline space-x-1">
                                            <span className="text-4xl font-black text-slate-900 tracking-tight">₹{(property.tokenPrice || 0).toLocaleString()}</span>
                                            <span className="text-xs font-bold text-slate-400">/ sq.ft</span>
                                        </div>
                                        <div className="mt-2 text-sm text-slate-500 font-medium">
                                            Min. Investment: <span className="text-slate-900 font-bold">{property.minInvestment}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-2">
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">I want to invest</label>
                                            <div className="flex items-center">
                                                <input
                                                    type="number"
                                                    value={sqftCount}
                                                    onChange={(e) => setSqftCount(parseInt(e.target.value) || 0)}
                                                    className="w-full bg-transparent font-black text-2xl text-slate-900 outline-none placeholder-slate-200"
                                                />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest pointer-events-none">SQFT</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="100"
                                                value={sqftCount}
                                                onChange={(e) => setSqftCount(parseInt(e.target.value))}
                                                className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 mt-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl flex items-start space-x-3">
                                        <div className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center text-[10px] shrink-0 font-bold mt-0.5">%</div>
                                        <div>
                                            <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider leading-none mb-1">Bulk Volume Discount</div>
                                            <p className="text-[10px] font-medium text-blue-600/80">Buying 50+ sqft qualifies for reduced fees.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                                            <span>Unit Cost</span>
                                            <span className="font-bold text-slate-900">₹ {unitCost.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs font-medium text-slate-500">
                                            <span>Est. Gas & Processing</span>
                                            <span className="font-bold text-slate-900">₹ {(processingFee + gasFee).toLocaleString()}</span>
                                        </div>
                                        <div className="h-px bg-slate-100 my-2"></div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-700">Total</span>
                                            <span className="text-2xl font-black text-blue-600">₹ {totalInvestment.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsCheckoutOpen(true)}
                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-sm tracking-wide shadow-xl shadow-slate-900/20 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2"
                                    >
                                        <span>Confirm Investment</span>
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </button>

                                    <p className="text-[10px] text-center font-medium text-slate-400 flex items-center justify-center">
                                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                        Secured via Polygon Network
                                    </p>
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
                                            <span className="text-slate-800">{property.financials?.grossYield || '0%'}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div className="bg-emerald-400 h-full rounded-full" style={{ width: '95%' }}></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                            <span className="text-slate-400">Fees and Maintenance</span>
                                            <span className="text-red-500">{property.financials?.fees || '0%'}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                            <div className="bg-red-400 h-full rounded-full" style={{ width: '15%' }}></div>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-50 flex justify-between items-baseline">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Net Yield</span>
                                        <span className="text-2xl font-bold text-blue-600">{property.financials?.rentalYield || '0%'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Clean Footer */}
            <footer className="border-t border-slate-100 py-12 bg-slate-50/30">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        © 2026 RealBlock Web3 Technologies. All rights reserved.
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
