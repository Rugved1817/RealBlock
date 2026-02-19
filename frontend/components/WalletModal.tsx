'use client';

import { useState } from 'react';

interface WalletModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    currentBalance: number;
    currency: string;
}

export default function WalletModal({ isOpen, onClose, onUpdate, currentBalance, currency }: WalletModalProps) {
    const [activeTab, setActiveTab] = useState<'DEPOSIT' | 'WITHDRAWAL'>('DEPOSIT');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const amountNum = parseFloat(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            setMessage({ text: 'Please enter a valid amount', type: 'error' });
            setLoading(false);
            return;
        }

        if (activeTab === 'WITHDRAWAL' && amountNum > currentBalance) {
            setMessage({ text: 'Insufficient balance', type: 'error' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const endpoint = activeTab === 'DEPOSIT' ? 'add' : 'withdraw';
            const response = await fetch(`http://localhost:4000/api/auth/wallet/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: amountNum })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({
                    text: `${activeTab === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'} successful!`,
                    type: 'success'
                });
                setAmount('');
                onUpdate();
                setTimeout(() => {
                    onClose();
                    setMessage(null);
                }, 1500);
            } else {
                setMessage({ text: data.message || 'Transaction failed', type: 'error' });
            }
        } catch (error) {
            setMessage({ text: 'Network error. Please try again.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">My Wallet</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 bg-gray-50 m-6 rounded-xl">
                    <button
                        onClick={() => { setActiveTab('DEPOSIT'); setMessage(null); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'DEPOSIT'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Add Money
                    </button>
                    <button
                        onClick={() => { setActiveTab('WITHDRAWAL'); setMessage(null); }}
                        className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'WITHDRAWAL'
                                ? 'bg-white text-orange-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        Withdraw
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 pb-8">
                    {/* Current Balance Display */}
                    <div className="text-center mb-8">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Available Balance</div>
                        <div className="text-3xl font-black text-gray-900">
                            {new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency || 'INR', maximumFractionDigits: 0 }).format(currentBalance)}
                        </div>
                    </div>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' ? (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            )}
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Amount ({currency})
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0"
                                    min="1"
                                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-lg"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all ${activeTab === 'DEPOSIT' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700 shadow-orange-200'
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                            {loading ? 'Processing...' : activeTab === 'DEPOSIT' ? 'Add Funds' : 'Withdraw Funds'}
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                        {activeTab === 'DEPOSIT'
                            ? 'Funds will be added to your wallet instantly.'
                            : 'Withdrawals are processed to your linked bank account within 24 hours.'}
                    </p>
                </form>
            </div>
        </div>
    );
}
