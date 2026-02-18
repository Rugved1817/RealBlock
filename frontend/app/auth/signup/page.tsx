'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Redirect to login with success message
                router.push('/auth/login?registered=true');
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] -mr-64 -mt-64 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] -ml-64 -mb-64 -z-10"></div>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-10 group">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-100 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-2xl font-bold">R</span>
                </div>
                <span className="text-2xl font-black text-[#0F172A] tracking-tighter">RealBlock</span>
            </Link>

            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200 border border-[#E2E8F0] p-10 w-full max-w-lg relative z-10 transition-all">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-black text-[#1E293B] mb-3 tracking-tight">Create Account</h1>
                    <p className="text-[#64748B] font-medium uppercase text-[10px] tracking-[0.2em]">Begin your fractional journey</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] px-5 py-3.5 rounded-2xl text-xs font-bold flex items-center shadow-sm">
                            <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest pl-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white outline-none transition-all font-bold text-[#1E293B]"
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white outline-none transition-all font-bold text-[#1E293B]"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest pl-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white outline-none transition-all font-bold text-[#1E293B]"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="confirmPassword" className="block text-[10px] font-black text-[#94A3B8] uppercase tracking-widest pl-1">
                                Confirm
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white outline-none transition-all font-bold text-[#1E293B]"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] flex items-start space-x-3">
                        <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-[#E2E8F0] text-[#3B82F6] focus:ring-[#3B82F6]" />
                        <span className="text-[11px] font-bold text-[#64748B] leading-relaxed">
                            I agree to the <a href="#" className="text-[#3B82F6] hover:underline">Investment Terms</a> and <a href="#" className="text-[#3B82F6] hover:underline">Risk Disclosures</a> associated with fractional real estate.
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#3B82F6] text-white py-5 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-[#2563EB] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Initializing...' : 'Create Account →'}
                    </button>
                </form>

                <div className="mt-10 pt-10 border-t border-[#F1F5F9] text-center">
                    <p className="text-[#64748B] font-bold text-xs">
                        Already registered?{' '}
                        <Link href="/auth/login" className="text-[#3B82F6] hover:underline font-black">
                            Secure Login
                        </Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.3em] opacity-50">
                AES-256 Vault Encryption
            </p>
        </div>
    );
}
