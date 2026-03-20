'use client';

import { useRef, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    timestamp: Date;
    agentType?: 'orchestrator';
};

const AGENTS = {
    orchestrator: {
        id: 'orchestrator',
        name: 'RealBlock AI',
        role: 'Assistant',
        color: 'bg-blue-600',
        textColor: 'text-blue-600',
        lightBg: 'bg-blue-50',
        gradient: 'from-blue-600 to-indigo-600',
        avatar: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        ),
        welcome: "Hi! I'm your RealBlock Intelligence. Ask me anything about properties, your portfolio, or real estate finance!"
    }
};

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: AGENTS.orchestrator.welcome, sender: 'agent', timestamp: new Date(), agentType: 'orchestrator' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
            const response = await apiFetch('/api/ai/chat', {
                method: 'POST',
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
                agentType: 'orchestrator'
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
                agentType: 'orchestrator'
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 pt-16">
            {/* Header */}
            <header className={`px-6 py-4 flex items-center justify-between text-white shadow-md bg-gradient-to-r ${AGENTS.orchestrator.gradient}`}>
                <div className="flex items-center space-x-3">
                    <button onClick={() => router.back()} className="p-2 mr-2 rounded-full hover:bg-white/20 transition">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-inner">
                        {AGENTS.orchestrator.avatar}
                    </div>
                    <div>
                        <h1 className="font-bold text-lg">{AGENTS.orchestrator.name}</h1>
                        <p className="text-sm text-white/80 font-medium">{AGENTS.orchestrator.role}</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6 container mx-auto max-w-4xl scroll-smooth custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.sender === 'agent' && (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 text-white text-xs mt-1 shadow-sm bg-gradient-to-br ${AGENTS.orchestrator.gradient}`}>
                                AI
                            </div>
                        )}
                        <div
                            className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-3xl text-base font-medium leading-relaxed shadow-sm ${msg.sender === 'user'
                                ? 'bg-slate-900 text-white rounded-br-none'
                                : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                                }`}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    a: ({ node, ...props }) => <a {...props} className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 font-semibold transition-colors" target={props.href?.startsWith('/') ? '_self' : '_blank'} />,
                                    img: ({ node, ...props }) => <img {...props} className="rounded-xl my-4 w-full max-w-lg h-auto object-cover shadow-md border border-slate-200 block" />,
                                    strong: ({ node, ...props }) => <strong {...props} className="font-bold text-slate-900" />,
                                    ul: ({ node, ...props }) => <ul {...props} className="list-disc pl-6 my-3 space-y-2 text-slate-700" />,
                                    li: ({ node, ...props }) => <li {...props} className="leading-relaxed" />,
                                    p: ({ node, ...props }) => <p {...props} className="mb-4 last:mb-0 leading-relaxed" />,
                                    hr: ({ node, ...props }) => <hr {...props} className="my-5 border-t border-slate-200" />
                                }}
                            >
                                {msg.text}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="ml-11 bg-white border border-slate-100 p-4 rounded-3xl rounded-bl-none shadow-sm flex space-x-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <div className="p-4 md:p-6 bg-white border-t border-slate-200">
                <div className="container mx-auto max-w-4xl">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="relative flex items-center shadow-sm rounded-2xl bg-white border border-slate-300 p-1"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={`Ask ${AGENTS.orchestrator.name} anything...`}
                            className="w-full bg-transparent py-4 pl-5 pr-16 text-base text-slate-900 font-medium focus:outline-none placeholder:text-slate-400"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="absolute right-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center group"
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </form>
                    <div className="flex justify-center mt-3 text-xs text-slate-400 font-semibold tracking-wide uppercase">
                        Powered by RealBlock Intelligence
                    </div>
                </div>
            </div>
        </div>
    );
}
