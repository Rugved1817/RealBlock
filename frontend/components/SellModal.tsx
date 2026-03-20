'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';

interface SellModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    asset: {
        id: string;
        name: string;
        sqftOwned: number;
        totalValue: number;
    } | null;
}

export default function SellModal({ isOpen, onClose, onSuccess, asset }: SellModalProps) {
    const [sqftAmount, setSqftAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !asset) return null;

    const handleSell = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const amount = parseFloat(sqftAmount);
        if (isNaN(amount) || amount <= 0) {
            setError('Please enter a valid amount');
            setLoading(false);
            return;
        }

        if (amount > asset.sqftOwned) {
            setError(`You only own ${asset.sqftOwned} SQFT`);
            setLoading(false);
            return;
        }

        try {
            const userData = localStorage.getItem('user');
            const user = userData ? JSON.parse(userData) : null;

            if (!user) {
                setError('User not logged in');
                setLoading(false);
                return;
            }

            const response = await apiFetch(`/api/properties/${asset.id}/sell`, {
                method: 'POST',
                body: JSON.stringify({
                    id: asset.id,
                    userId: user.id,
                    sqftAmount: amount
                })
            });

            if (response.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to sell holdings');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const pricePerSqft = asset.totalValue / asset.sqftOwned;
    const estimatedValue = (parseFloat(sqftAmount) || 0) * pricePerSqft;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 border border-slate-100">
                {/* Header */}
                <div className="flex justify-between items-center p-8 bg-slate-50 border-b border-slate-100">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Sell Holdings</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{asset.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200/50 rounded-full transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSell} className="p-8 space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                            <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Max Available</div>
                            <div className="text-lg font-black text-blue-600">{asset.sqftOwned} SQFT</div>
                        </div>
                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                            <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Market Price</div>
                            <div className="text-lg font-black text-indigo-600">₹{Math.round(pricePerSqft).toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">Amount to Sell (SQFT)</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={sqftAmount}
                                onChange={(e) => setSqftAmount(e.target.value)}
                                placeholder="Enter SQFT"
                                className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-black text-xl text-slate-800"
                                required
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSqftAmount(asset.sqftOwned.toString())}
                                    className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>
                    </div>

                    {estimatedValue > 0 && (
                        <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
                            <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">You Recieve</div>
                            <div className="text-xl font-black text-emerald-700">₹{Math.round(estimatedValue).toLocaleString()}</div>
                        </div>
                    )}

                    {error && (
                        <div className="p-4 bg-red-50 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2 border border-red-100">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#1E293B] hover:bg-[#0F172A] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm Sale'}
                    </button>

                    <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                        Funds will be credited to your wallet immediately after confirmation.
                    </p>
                </form>
            </div>
        </div>
    );
}
