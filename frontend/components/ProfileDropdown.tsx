'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileDropdown({ user: initialUser }: { user: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(initialUser);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.reload();
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:4000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    // Update local storage to keep it in sync
                    localStorage.setItem('user', JSON.stringify(data));
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const nameInitial = (user.name || user.email)?.charAt(0).toUpperCase() || 'U';
    const userName = user.name || user.email?.split('@')[0] || 'User';

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Minimal Avatar Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 text-white font-bold text-lg hover:ring-4 hover:ring-blue-100 transition-all cursor-pointer overflow-hidden border-2 border-white shadow-sm active:scale-95"
            >
                {nameInitial}
            </button>

            {/* Profile Card Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-4 w-[360px] bg-[#F7F9FC] rounded-[40px] shadow-[0_24px_48px_rgba(0,0,0,0.12)] p-6 z-[100] border border-white/80 backdrop-blur-2xl animate-in fade-in zoom-in duration-300 origin-top-right">
                    <div className="flex flex-col items-center">
                        {/* Header with Close */}
                        <div className="flex justify-between items-center w-full mb-4">
                            <div className="w-8"></div> {/* Spacer */}
                            <div className="text-sm font-medium text-[#444746] truncate max-w-[200px]">
                                {user.email}
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        {/* Large Avatar Section */}
                        <div className="relative mb-4 group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-5xl text-white font-medium shadow-lg transition-transform group-hover:scale-[1.02]">
                                {nameInitial}
                            </div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-100 group-hover:bg-gray-50 transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </div>
                        </div>

                        <h2 className="text-[28px] font-medium text-[#1F1F1F] mb-8">Hi, {userName}!</h2>

                        {/* Main Action */}
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full bg-white text-[#0B57D0] font-semibold py-4 px-6 rounded-full border border-gray-200 hover:bg-[#F8FAFF] hover:border-[#D3E3FD] transition-all mb-4 shadow-sm text-sm active:scale-[0.98]"
                        >
                            Manage your RealBlock Account
                        </button>

                        {/* Secondary Actions Row */}
                        <div className="flex w-full gap-2 mb-8">
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="flex-1 flex items-center justify-center gap-3 bg-white text-[#1F1F1F] font-semibold py-5 rounded-[24px_4px_4px_24px] border border-gray-200 hover:bg-gray-50 transition-all shadow-sm text-sm active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="3" width="7" height="7"></rect>
                                    <rect x="14" y="14" width="7" height="7"></rect>
                                    <rect x="3" y="14" width="7" height="7"></rect>
                                </svg>
                                Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 flex items-center justify-center gap-3 bg-white text-[#1F1F1F] font-semibold py-5 rounded-[4px_24px_24px_4px] border border-gray-200 hover:bg-gray-50 transition-all shadow-sm text-sm active:scale-[0.98]"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444746" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Sign out
                            </button>
                        </div>

                        {/* Footer Links */}
                        <div className="flex gap-4 text-[11px] text-[#444746] font-medium pt-4">
                            <a href="#" className="hover:bg-gray-200/50 px-2 py-1 rounded transition-colors">Privacy Policy</a>
                            <span className="py-1">•</span>
                            <a href="#" className="hover:bg-gray-200/50 px-2 py-1 rounded transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
