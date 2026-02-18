'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('email');

    useEffect(() => {
        if (searchParams.get('registered') === 'true') {
            setSuccess('Account created successfully! Please login.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && (data.result?.data || data.token)) {
                const responseData = data.result?.data || data;
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', JSON.stringify(responseData.user));
                router.push('/');
            } else {
                setError(data.message || data.error?.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans selection:bg-blue-100">
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column: Context & Marketing */}
                    <div className="space-y-10">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="bg-blue-600 p-2 rounded-lg shadow-sm group-hover:scale-105 transition-transform">
                                <span className="text-white font-bold text-xl px-2">R</span>
                            </div>
                            <span className="text-2xl font-bold text-[#1F2937] tracking-tight">RealBlock</span>
                        </Link>

                        <div className="space-y-6">
                            <h1 className="text-5xl lg:text-6xl font-black text-[#1F2937] leading-[1.1] tracking-tight">
                                Institutional-grade <br /> real estate. <br />
                                <span className="text-[#2563EB]">Fractionalized for you.</span>
                            </h1>
                            <p className="text-lg text-[#6B7280] font-medium max-w-lg leading-relaxed">
                                Access premium commercial SQFT units starting at ₹5,000.
                                Secure ownership on the blockchain with full regulatory compliance.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-4">
                            <div>
                                <div className="text-3xl font-black text-[#1F2937]">12.4%</div>
                                <div className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mt-1">Avg. IRR</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-[#1F2937]">₹450Cr+</div>
                                <div className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mt-1">Assets Managed</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-[#1F2937]">24/7</div>
                                <div className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mt-1">Liquidity</div>
                            </div>
                        </div>

                        {/* Image Preview with Badge */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-64 group border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt="Commercial Asset"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 flex items-center bg-black/40 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                                    SEBI Compliant Structure
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Login Card */}
                    <div className="flex flex-col items-center">
                        <div className="w-full max-w-md bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-[#F3F4F6] p-10 relative overflow-hidden">
                            {/* Blue glow effect at top */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>

                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-black text-[#1F2937] mb-2">Welcome Back</h2>
                                <p className="text-sm font-semibold text-[#9CA3AF]">Securely access your portfolio</p>
                            </div>

                            {/* Tabs */}
                            <div className="flex p-1 bg-[#F9FAFB] rounded-2xl mb-8 border border-[#F3F4F6]">
                                <button
                                    onClick={() => setActiveTab('email')}
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'email' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
                                >
                                    Email Login
                                </button>
                                <button
                                    onClick={() => setActiveTab('wallet')}
                                    className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'wallet' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-[#9CA3AF] hover:text-[#6B7280]'}`}
                                >
                                    Connect Wallet
                                </button>
                            </div>

                            {success && (
                                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 p-4 rounded-xl text-xs font-bold flex items-center">
                                    <span className="mr-2">✓</span> {success}
                                </div>
                            )}
                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-xs font-bold flex items-center">
                                    <span className="mr-2">⚠️</span> {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.15em] ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-[#D1D5DB] group-focus-within:text-[#2563EB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="name@company.com"
                                            className="w-full pl-12 pr-6 py-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#2563EB] focus:bg-white transition-all text-sm font-bold text-[#1F2937] placeholder:text-[#D1D5DB]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center ml-1">
                                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.15em]">Password</label>
                                        <button type="button" className="text-[10px] font-black text-[#2563EB] uppercase tracking-widest hover:underline">Forgot?</button>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <svg className="w-4 h-4 text-[#D1D5DB] group-focus-within:text-[#2563EB] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-6 py-4 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl outline-none focus:border-[#2563EB] focus:bg-white transition-all text-sm font-bold text-[#1F2937] placeholder:text-[#D1D5DB]"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#1D4ED8] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-200 hover:bg-[#1E40AF] hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 disabled:opacity-50"
                                >
                                    {loading ? 'Authenticating...' : 'Sign In Securely'}
                                </button>
                            </form>

                            <div className="relative my-10">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#F3F4F6]"></div></div>
                                <div className="relative flex justify-center text-[10px] font-black text-[#D1D5DB] uppercase bg-white px-4 tracking-widest">or continue with</div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center space-x-3 py-3 border border-[#E5E7EB] rounded-2xl hover:bg-[#F9FAFB] transition-all group">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Logo.svg" className="w-5 h-5" alt="MetaMask" />
                                    <span className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest">MetaMask</span>
                                </button>
                                <button className="flex items-center justify-center space-x-3 py-3 border border-[#E5E7EB] rounded-2xl hover:bg-[#F9FAFB] transition-all group">
                                    <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-4 h-4" alt="Google" />
                                    <span className="text-[10px] font-black text-[#4B5563] uppercase tracking-widest">Google</span>
                                </button>
                            </div>

                            <div className="mt-10 pt-8 border-t border-[#F3F4F6]">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-tight">Verification Status</div>
                                        <div className="text-[9px] font-bold text-[#D1D5DB]">Required for INR deposits</div>
                                    </div>
                                    <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center">
                                        <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full mr-2"></span>
                                        KYC Pending
                                    </span>
                                </div>
                                <p className="text-[9px] font-bold text-[#D1D5DB] leading-relaxed text-center px-4">
                                    By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
                                </p>
                                <div className="mt-6 flex justify-center">
                                    <span className="text-[9px] font-black text-[#E5E7EB] uppercase tracking-[0.3em] flex items-center">
                                        <svg className="w-3 h-3 mr-2 opacity-30" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                        Bank Grade Security (AES-256)
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Redirection Link below card */}
                        <p className="mt-8 text-sm font-bold text-[#9CA3AF]">
                            Don't have an account? <Link href="/auth/signup" className="text-[#2563EB] hover:underline font-black">Request Access</Link>
                        </p>
                    </div>

                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-[#F3F4F6] py-6 px-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-[#D1D5DB] uppercase tracking-[0.1em] space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <span>© 2026 PropTokenized Ltd.</span>
                        <span className="border-l border-[#F3F4F6] pl-4 flex items-center">
                            <svg className="w-3 h-3 mr-1.5 text-[#D1D5DB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2 2.25 2.25 0 012.25 2.25c0 .414.336.75.75.75h2.25m-1.244-6.954A11.042 11.042 0 0011 2.5c-5.523 0-10 4.477-10 10 0 2.137.663 4.123 1.806 5.765l.957-1.148a1 1 0 011.536 1.286l-1.148.957A8.997 8.997 0 0011 21.5c4.75 0 8.657-3.69 8.973-8.384" /></svg>
                            English (IN)
                        </span>
                    </div>
                    <div className="flex items-center space-x-10">
                        <span>CIN: U72900KA2021PTC123456</span>
                        <div className="flex items-center space-x-4 grayscale opacity-40">
                            <span className="text-[8px] border border-[#D1D5DB] px-1 rounded">Rupay</span>
                            <span className="text-[8px] border border-[#D1D5DB] px-1 rounded">UPI</span>
                            <span className="text-[8px] border border-[#D1D5DB] px-1 rounded text-blue-500 font-black">Polygon</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
