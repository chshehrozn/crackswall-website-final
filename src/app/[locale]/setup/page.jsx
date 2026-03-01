'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupFrontendPage() {
    const router = useRouter();
    const [form, setForm] = useState({ apiUrl: '' });
    const [status, setStatus] = useState(null); // null | 'connecting' | 'success' | 'error'
    const [error, setError] = useState('');

    async function handleConnect() {
        setStatus('connecting');
        setError('');

        try {
            const res = await fetch('/api/setup/link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (data.success) {
                setStatus('success');
                setTimeout(() => {
                    router.push('/');
                }, 1500);
            } else {
                setStatus('error');
                setError(data.error || 'Connection failed.');
            }
        } catch (e) {
            setStatus('error');
            setError('Network error. Is your backend online?');
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-xl shadow-blue-900/40">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Frontend Setup</h1>
                    <p className="text-white/40 text-sm mt-1">Connect your backend to go live</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-white/60 mb-1 ml-1">Backend API URL</label>
                        <input
                            type="url"
                            value={form.apiUrl}
                            onChange={e => setForm({ ...form, apiUrl: e.target.value })}
                            placeholder="https://be.claynestltd.shop/api"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border-white/5"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                        ❌ {error}
                    </div>
                )}
                {status === 'success' && (
                    <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center">
                        ✅ Backend Linked! Loading Site...
                    </div>
                )}

                <button
                    onClick={handleConnect}
                    disabled={status === 'connecting' || status === 'success'}
                    className="w-full mt-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/30 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                    {status === 'connecting' ? 'Connecting...' : 'Link Backend ➔'}
                </button>
            </div>
        </div>
    );
}
