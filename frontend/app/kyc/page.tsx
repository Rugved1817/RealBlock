'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function KYCPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [panNumber, setPanNumber] = useState('');
    const [name, setName] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/auth/login');
            return;
        }

        setUser(JSON.parse(userData));
        setLoading(false);
    }, [router]);

    const handleVerifyPAN = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifying(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:4000/api/kyc/pan-verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ panNumber, name }),
            });

            const data = await response.json();
            const result = data.result?.data || data;

            if (response.ok && result.status === 'VERIFIED') {
                setMessage(`✅ PAN Verified Successfully! Reference ID: ${result.referenceId || 'N/A'}`);
                setMessageType('success');

                // Update user data
                const updatedUser = { ...user, isKycVerified: true };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            } else {
                setMessage(data.message || 'Verification failed');
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Network error. Please try again.');
            setMessageType('error');
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <span className="text-sm font-black text-[#64748B] uppercase tracking-widest">Initialising Terminal...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                                <span className="text-white text-xl font-bold">R</span>
                            </div>
                            <span className="text-xl font-black text-[#0F172A]">RealBlock</span>
                        </Link>
                        <div className="flex items-center space-x-4">
                            <span className="text-xs font-bold text-[#64748B] uppercase tracking-tighter hidden sm:block">Compliance Terminal</span>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-[#F1F5F9] text-[#0F172A] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#E2E8F0] transition-all"
                            >
                                ← Return
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-black text-[#0F172A] mb-4 tracking-tight uppercase">Investor Verification</h1>
                    <p className="text-[#64748B] font-medium">To maintain security and regulatory compliance, we require a one-time PAN verification.</p>
                </div>

                {/* Status Card */}
                <div className="bg-white rounded-[32px] border border-[#E2E8F0] p-10 shadow-2xl shadow-slate-200/50 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

                    <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#F1F5F9]">
                        <div>
                            <div className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em] mb-2">Current Status</div>
                            <h2 className="text-2xl font-black text-[#1E293B]">Identity Check</h2>
                        </div>
                        {user?.isKycVerified ? (
                            <span className="px-6 py-2.5 bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7] rounded-full text-xs font-black uppercase tracking-widest">
                                ✓ Verified
                            </span>
                        ) : (
                            <span className="px-6 py-2.5 bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7] rounded-full text-xs font-black uppercase tracking-widest animate-pulse">
                                ⏳ Pending
                            </span>
                        )}
                    </div>

                    {!user?.isKycVerified ? (
                        <form onSubmit={handleVerifyPAN} className="space-y-8">
                            {message && (
                                <div className={`p-5 rounded-2xl flex items-center text-xs font-bold shadow-sm ${messageType === 'success' ? 'bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534]' : 'bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B]'
                                    }`}>
                                    <span className="mr-3 text-lg">{messageType === 'success' ? '✅' : '⚠️'}</span>
                                    {message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label htmlFor="panNumber" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest pl-1">
                                    Permanent Account Number (PAN)
                                </label>
                                <input
                                    id="panNumber"
                                    type="text"
                                    value={panNumber}
                                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                                    maxLength={10}
                                    required
                                    placeholder="ABCDE1234F"
                                    className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white outline-none transition-all font-black text-[#1E293B] tracking-[0.2em]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest pl-1">
                                    Full Name (As per records)
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="JOHN DOE"
                                    className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white outline-none transition-all font-black text-[#1E293B]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={verifying}
                                className="w-full bg-[#3B82F6] text-white py-5 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-[#2563EB] transition-all shadow-xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50"
                            >
                                {verifying ? 'Verifying with NSDL...' : 'Initialise Verification →'}
                            </button>

                            <div className="p-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[24px]">
                                <div className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-3">Developer/Test Sandbox</div>
                                <code className="text-[11px] font-bold text-[#475569] block">
                                    PAN: <span className="text-[#3B82F6]">ABCPV1234D</span><br />
                                    NAME: <span className="text-[#3B82F6]">Test User</span>
                                </code>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <div className="w-20 h-20 bg-[#F0FDF4] text-[#22C55E] rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-green-100">✓</div>
                            <h3 className="text-2xl font-black text-[#1E293B] mb-4">Verification Complete</h3>
                            <p className="text-[#64748B] font-medium mb-10">Your investor profile is now active on the Polygon protocol. You can proceed with fractional acquisitions.</p>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="bg-[#0F172A] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl"
                            >
                                Navigate to Dashboard
                            </button>
                        </div>
                    )}
                </div>

                <div className="text-center">
                    <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.3em]">
                        🔒 Data Encrypted via SSL/TLS 1.3
                    </p>
                </div>
            </main>
        </div>
    );
}
