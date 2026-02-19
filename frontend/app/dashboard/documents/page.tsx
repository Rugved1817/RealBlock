'use strict';

export default function DocumentsPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B]">Tax Documents</h1>
                        <p className="text-[#64748B] mt-1">Access your investment records and tax filings.</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl border border-[#E2E8F0] p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-[#94A3B8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[#1E293B] mb-2">No Documents Available</h2>
                    <p className="text-[#64748B]">You don't have any tax documents generated yet.</p>
                </div>
            </div>
        </div>
    );
}
