'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AdminStats { totalUsers: number; totalProperties: number; totalTransactions: number; totalVolume: number; }
interface Property { id: string; name: string; location: string; type: string; status: string; totalSqft: number; sqftSold: number; pricePerSqft: number; assetValue: string; isFeatured: boolean; image: string; }
interface Transaction { id: string; amount: number; sqft: number; status: string; createdAt: string; user: { name: string | null; email: string }; property: { name: string; type: string; image: string }; }
interface User { id: string; name: string | null; email: string; role: string; isKycVerified: boolean; totalInvestment: number; createdAt: string; }

type Tab = 'overview' | 'properties' | 'transactions' | 'users';

export default function AdminDashboard() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('overview');
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddProperty, setShowAddProperty] = useState(false);
    const [addError, setAddError] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [form, setForm] = useState({
        name: '', location: '', type: 'COMMERCIAL', assetValue: '', irr: '', yield: '',
        minInvestment: '', image: '', totalSqft: '', pricePerSqft: '',
        description: 'Premium property with high appreciation potential.', tenantName: '', isFeatured: false,
        highlights: '',
    });

    const checkAdmin = () => {
        const u = localStorage.getItem('user');
        if (!u) { router.push('/auth/login'); return false; }
        const user = JSON.parse(u);
        if (user.role !== 'ADMIN') { router.push('/dashboard'); return false; }
        return true;
    };

    const fetchAll = async () => {
        if (!checkAdmin()) return;
        setLoading(true);
        try {
            const [sRes, pRes, tRes, uRes] = await Promise.all([
                apiFetch('/api/admin/stats'),
                apiFetch('/api/properties'),
                apiFetch('/api/admin/transactions'),
                apiFetch('/api/admin/users'),
            ]);
            
            const [s, p, t, u] = await Promise.all([
                sRes.json(),
                pRes.json(),
                tRes.json(),
                uRes.json()
            ]);

            setStats(s.result?.data || s);
            setProperties(p.result?.data || p || []);
            setTransactions(t.result?.data || t || []);
            setUsers(u.result?.data || u || []);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleAddProperty = async (e: React.FormEvent) => {
        e.preventDefault();
        setAddLoading(true); setAddError('');
        try {
            const res = await apiFetch('/api/admin/properties', {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    totalSqft: parseFloat(form.totalSqft),
                    pricePerSqft: parseFloat(form.pricePerSqft),
                    highlights: form.highlights.split(',').map(h => h.trim()).filter(Boolean),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            setShowAddProperty(false);
            fetchAll();
        } catch (err: any) { setAddError(err.message); }
        finally { setAddLoading(false); }
    };

    const handleDeleteProperty = async (id: string) => {
        if (!confirm('Delete this property?')) return;
        await apiFetch(`/api/admin/properties/${id}`, { method: 'DELETE' });
        fetchAll();
    };

    const handleSetRole = async (id: string, role: string) => {
        await apiFetch(`/api/admin/users/${id}/role`, { 
            method: 'PATCH', 
            body: JSON.stringify({ id, role }) 
        });
        fetchAll();
    };

    const StatCard = ({ label, value, icon, color }: any) => (
        <div className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm`}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>{icon}</div>
            </div>
            <div className="text-3xl font-black text-slate-800">{value}</div>
        </div>
    );

    const tabs: { id: Tab; label: string }[] = [
        { id: 'overview', label: 'Overview' },
        { id: 'properties', label: `Properties (${properties.length})` },
        { id: 'transactions', label: `Transactions (${transactions.length})` },
        { id: 'users', label: `Users (${users.length})` },
    ];

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Loading admin data...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Header */}
            <div className="bg-[#0F172A] text-white px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-1">RealBlock</div>
                        <h1 className="text-2xl font-black tracking-tight">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setShowAddProperty(true)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                            Add Property
                        </button>
                        <button onClick={() => router.push('/dashboard')}
                            className="text-white/60 hover:text-white font-medium text-sm transition-colors">
                            ← Back to App
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-2xl p-1 border border-slate-100 mb-8 w-fit shadow-sm">
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)}
                            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === t.id ? 'bg-[#0F172A] text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {tab === 'overview' && stats && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatCard label="Total Users" value={stats.totalUsers}
                                icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" /></svg>}
                                color="bg-blue-50" />
                            <StatCard label="Properties" value={stats.totalProperties}
                                icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                                color="bg-purple-50" />
                            <StatCard label="Transactions" value={stats.totalTransactions}
                                icon={<svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                                color="bg-emerald-50" />
                            <StatCard label="Total Volume" value={`₹${Math.round(stats.totalVolume).toLocaleString('en-IN')}`}
                                icon={<svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                color="bg-orange-50" />
                        </div>

                        {/* Recent Transactions Preview */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-black text-slate-800">Recent Transactions</h2>
                                <button onClick={() => setTab('transactions')} className="text-blue-600 text-sm font-bold hover:underline">View All →</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead><tr className="bg-slate-50 text-left">
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr></thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {transactions.slice(0, 5).map(t => (
                                            <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-slate-800">{t.user?.email}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600">{t.property?.name}</td>
                                                <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{Math.abs(t.amount).toLocaleString('en-IN')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : t.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{t.status}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Properties Tab */}
                {tab === 'properties' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h2 className="font-black text-slate-800">All Properties</h2>
                            <button onClick={() => setShowAddProperty(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                Add Property
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="bg-slate-50 text-left">
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price/SQFT</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {properties.map(p => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <img src={p.image} className="w-10 h-10 rounded-xl object-cover" alt={p.name} />
                                                    <div>
                                                        <div className="font-bold text-sm text-slate-800">{p.name}</div>
                                                        <div className="text-xs text-slate-400">{p.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-black text-slate-500 uppercase">{p.type}</td>
                                            <td className="px-6 py-4">
                                                <div className="w-32">
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1">
                                                        <span>{p.sqftSold} / {p.totalSqft} SQFT</span>
                                                        <span>{Math.round((p.sqftSold / p.totalSqft) * 100)}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-100 rounded-full"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.round((p.sqftSold / p.totalSqft) * 100)}%` }} /></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{p.pricePerSqft?.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${p.status === 'OPEN' ? 'bg-emerald-50 text-emerald-700' : p.status === 'FULLY_FUNDED' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{p.status}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button onClick={() => handleDeleteProperty(p.id)} className="text-red-500 hover:text-red-700 text-xs font-bold transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Transactions Tab */}
                {tab === 'transactions' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="font-black text-slate-800">All Transactions</h2>
                            <p className="text-slate-400 text-xs mt-1">{transactions.length} total transactions across all users</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="bg-slate-50 text-left">
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Property</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">SQFT</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {transactions.map(t => (
                                        <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-800">{t.user?.name || '—'}</div>
                                                <div className="text-xs text-slate-400">{t.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-800">{t.property?.name}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-black">{t.property?.type}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">{t.sqft}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{Math.abs(t.amount).toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${t.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600' : t.status === 'PENDING' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>{t.status}</span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {tab === 'users' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="font-black text-slate-800">All Users</h2>
                            <p className="text-slate-400 text-xs mt-1">{users.length} registered users</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead><tr className="bg-slate-50 text-left">
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">KYC</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invested</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                    <th className="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                </tr></thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-slate-800">{u.name || '—'}</div>
                                                <div className="text-xs text-slate-400">{u.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black ${u.isKycVerified ? 'text-emerald-600' : 'text-slate-400'}`}>{u.isKycVerified ? '✓ Verified' : 'Pending'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-800">₹{u.totalInvestment?.toLocaleString('en-IN')}</td>
                                            <td className="px-6 py-4 text-xs text-slate-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                            <td className="px-6 py-4">
                                                {u.role === 'USER' ? (
                                                    <button onClick={() => handleSetRole(u.id, 'ADMIN')} className="text-purple-600 hover:text-purple-800 text-xs font-bold transition-colors">Make Admin</button>
                                                ) : (
                                                    <button onClick={() => handleSetRole(u.id, 'USER')} className="text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors">Remove Admin</button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Property Modal */}
            {showAddProperty && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white px-8 pt-8 pb-4 border-b border-slate-100 flex items-center justify-between rounded-t-3xl">
                            <h2 className="text-xl font-black text-slate-800">Add New Property</h2>
                            <button onClick={() => setShowAddProperty(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddProperty} className="p-8 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Property Name', key: 'name', placeholder: 'Skyline Office Tower' },
                                    { label: 'Location', key: 'location', placeholder: 'Mumbai, Maharashtra' },
                                    { label: 'Asset Value', key: 'assetValue', placeholder: '₹12.5 Cr' },
                                    { label: 'Expected IRR', key: 'irr', placeholder: '14.5%' },
                                    { label: 'Annual Yield', key: 'yield', placeholder: '9%' },
                                    { label: 'Min Investment', key: 'minInvestment', placeholder: '₹10,000' },
                                    { label: 'Total SQFT', key: 'totalSqft', placeholder: '10000', type: 'number' },
                                    { label: 'Price per SQFT (₹)', key: 'pricePerSqft', placeholder: '5000', type: 'number' },
                                    { label: 'Tenant Name', key: 'tenantName', placeholder: 'TechGlobal Solutions' },
                                ].map(f => (
                                    <div key={f.key} className={f.key === 'tenantName' ? 'col-span-2' : ''}>
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">{f.label}</label>
                                        <input type={f.type || 'text'} placeholder={f.placeholder} required
                                            value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none text-sm font-medium transition-all" />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Property Type</label>
                                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium">
                                    {['COMMERCIAL', 'WAREHOUSING', 'RESIDENTIAL', 'WAREHOUSE'].map(t => <option key={t}>{t}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Image URL</label>
                                <input type="url" placeholder="https://images.unsplash.com/..." required
                                    value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium" />
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Highlights (comma-separated)</label>
                                <input type="text" placeholder="Grade A office, LEED certified, 95% occupancy"
                                    value={form.highlights} onChange={e => setForm(p => ({ ...p, highlights: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium" />
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-2">Description</label>
                                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 outline-none text-sm font-medium resize-none" />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(p => ({ ...p, isFeatured: e.target.checked }))} className="w-4 h-4 rounded" />
                                <span className="text-sm font-bold text-slate-700">Feature this property on homepage</span>
                            </label>

                            {addError && <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-xl">{addError}</div>}

                            <button type="submit" disabled={addLoading}
                                className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50">
                                {addLoading ? 'Adding Property...' : 'Add Property'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
