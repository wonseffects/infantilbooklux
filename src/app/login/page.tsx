"use client";

import React, { useState } from "react";
import {
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    Github,
    Chrome
} from "lucide-react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const [loading, setLoading] = useState(false);
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const message = searchParams.get("message");

    return (
        <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            InfantilBooks<span className="text-blue-500">Lux</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo de volta</h1>
                    <p className="text-slate-400">Entre para continuar sua jornada mágica</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
                            <Lock className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm flex items-center gap-2">
                            <Sparkles className="w-4 h-4 flex-shrink-0" />
                            {message}
                        </div>
                    )}

                    <form action={login} className="space-y-6">
                        <input type="hidden" name="priceId" value={searchParams.get("priceId") || ""} />
                        <input type="hidden" name="bookId" value={searchParams.get("bookId") || ""} />
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">E-mail</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-slate-300">Senha</label>
                                <a href="#" className="text-xs text-blue-400 hover:text-blue-300">Esqueceu a senha?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            Entrar na Conta
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 flex items-center justify-between gap-4">
                        <div className="h-px bg-white/10 flex-1"></div>
                        <span className="text-xs text-slate-500 font-medium">OU CONTINUE COM</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm">
                            <Chrome className="w-5 h-5" /> Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium text-sm">
                            <Github className="w-5 h-5" /> GitHub
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-slate-400">
                    Não tem uma conta?{" "}
                    <Link 
                        href={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} 
                        className="text-blue-400 font-bold hover:text-blue-300"
                    >
                        Cadastre-se grátis
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
