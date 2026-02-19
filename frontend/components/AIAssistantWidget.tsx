'use client';

import { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    agentType?: 'market' | 'portfolio' | 'advisor';
};

type AgentType = 'market' | 'portfolio' | 'advisor';

const AGENTS = {
    market: {
        id: 'market',
        name: 'Market Scout',
        role: 'Property Search',
        color: 'bg-blue-600',
        textColor: 'text-blue-600',
        lightBg: 'bg-blue-50',
        gradient: 'from-blue-600 to-indigo-600',
        avatar: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        ),
        welcome: "Hi! I can help you find high-yield properties. Try asking 'Show me commercial properties in Mumbai'."
    },
    portfolio: {
        id: 'portfolio',
        name: 'Portfolio Mgr.',
        role: 'Asset Management',
        color: 'bg-purple-600',
        textColor: 'text-purple-600',
        lightBg: 'bg-purple-50',
        gradient: 'from-purple-600 to-pink-600',
        avatar: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
        welcome: "I'm tracking your investments. Ask me 'How is my portfolio performing?' or 'My dividends?'."
    },
    advisor: {
        id: 'advisor',
        name: 'Wealth Advisor',
        role: 'Consultant',
        color: 'bg-emerald-600',
        textColor: 'text-emerald-600',
        lightBg: 'bg-emerald-50',
        gradient: 'from-emerald-600 to-teal-600',
        avatar: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
        ),
        welcome: "Confused about Real Estate Tokens? Ask me about 'Yield', 'IRR', or 'Risk factors'."
    }
};

export default function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeAgent, setActiveAgent] = useState<AgentType>('market');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: AGENTS.market.welcome, sender: 'agent', timestamp: new Date(), agentType: 'market' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:4000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: userMsg.text,
                    userId: '809d9e24-6390-4998-9568-a671cf741b26' // Hardcoded Test User ID from seed
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to fetch');
            }

            if (!response.body) throw new Error("No response body");

            // Create a placeholder message for streaming
            const agentMsgId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, {
                id: agentMsgId,
                text: '',
                sender: 'agent',
                timestamp: new Date(),
                agentType: activeAgent
            }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let buffer = '';

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });
                buffer += chunkValue;

                const lines = buffer.split('\n');
                // Keep the last partial line in the buffer
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.trim() === '') continue;
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') {
                            // Don't break here, let the reader finish naturally to ensure all data is processed
                            continue;
                        }
                        try {
                            const parsed = JSON.parse(dataStr);
                            if (parsed.response) {
                                setMessages(prev => prev.map(msg =>
                                    msg.id === agentMsgId
                                        ? { ...msg, text: parsed.response }
                                        : msg
                                ));
                            }
                        } catch (e) {
                            console.error("Error parsing stream chunk", e);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to my brain right now. Please try again later.",
                sender: 'agent',
                timestamp: new Date(),
                agentType: activeAgent
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleAgentSwitch = (agentId: AgentType) => {
        if (agentId === activeAgent) return;
        setActiveAgent(agentId);
        setMessages(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                text: AGENTS[agentId].welcome,
                sender: 'agent',
                timestamp: new Date(),
                agentType: agentId
            }
        ]);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[380px] h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-slide-in origin-bottom-right">

                    {/* Header */}
                    <div className={`p-4 bg-gradient-to-r ${AGENTS[activeAgent].gradient} text-white`}>
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                    {AGENTS[activeAgent].avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{AGENTS[activeAgent].name}</h3>
                                    <p className="text-[10px] text-white/80 font-medium">{AGENTS[activeAgent].role}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Agent Switcher Tabs */}
                        <div className="flex space-x-1 bg-black/10 p-1 rounded-xl backdrop-blur-md">
                            {(Object.keys(AGENTS) as AgentType[]).map((agentKey) => (
                                <button
                                    key={agentKey}
                                    onClick={() => handleAgentSwitch(agentKey)}
                                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${activeAgent === agentKey
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {AGENTS[agentKey].name.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 scroll-smooth custom-scrollbar">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.sender === 'agent' && (
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 text-white text-[10px] mt-1 bg-gradient-to-br ${AGENTS[msg.agentType || 'market'].gradient}`}>
                                        AI
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${msg.sender === 'user'
                                        ? 'bg-slate-900 text-white rounded-br-none'
                                        : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                        }`}
                                >
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({ node, ...props }) => <a {...props} className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 font-semibold transition-colors" target={props.href?.startsWith('/') ? '_self' : '_blank'} />,
                                            img: ({ node, ...props }) => <img {...props} className="rounded-lg my-3 w-full h-auto object-cover shadow-md border border-slate-200 block" />,
                                            strong: ({ node, ...props }) => <strong {...props} className="font-bold text-slate-800" />,
                                            ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-5 my-2 space-y-1 text-slate-600" />,
                                            li: ({ node, ...props }) => <li {...props} className="text-xs leading-relaxed" />,
                                            p: ({ node, ...props }) => <p {...props} className="mb-3 last:mb-0 text-sm leading-relaxed" />,
                                            hr: ({ node, ...props }) => <hr {...props} className="my-4 border-t border-slate-200" />
                                        }}
                                    >
                                        {msg.text}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="ml-8 bg-white border border-slate-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex space-x-1">
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-slate-100">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSendMessage();
                            }}
                            className="relative flex items-center"
                        >
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={`Ask ${AGENTS[activeAgent].name}...`}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-4 pr-12 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim()}
                                className="absolute right-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                        </form>
                        <div className="text-[9px] text-center mt-2 text-slate-300 font-bold uppercase tracking-widest">
                            Powered by RealBlock Intelligence
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 z-50 group relative overflow-hidden ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-white'}`}
            >
                {!isOpen && <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 group-hover:opacity-100 opacity-0 transition-opacity"></div>}

                {isOpen ? (
                    <svg className="w-6 h-6 text-white transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <div className="relative">
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        <svg className="w-7 h-7 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    </div>
                )}
            </button>

            <style jsx>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}


