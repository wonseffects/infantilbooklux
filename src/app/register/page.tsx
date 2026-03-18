"use client";

import React, { useState } from "react";
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RegisterContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    return (
        <main className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black tracking-tight text-white">
                            InfantilBooks<span className="text-blue-500">Lux</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Crie sua conta</h1>
                    <p className="text-slate-400">Comece sua aventura agora mesmo</p>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl">
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-2">
                            <Lock className="w-4 h-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form action={signup} className="space-y-5">
                        <input type="hidden" name="priceId" value={searchParams.get("priceId") || ""} />
                        <input type="hidden" name="bookId" value={searchParams.get("bookId") || ""} />
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Nome Completo</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="name"
                                    type="text"
                                    placeholder="Seu nome"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-medium text-slate-300 ml-1">Senha</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-1">
                            <div className="mt-1">
                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            </div>
                            <p className="text-xs text-slate-400">
                                Ao se cadastrar, você concorda com nossos <a href="#" className="text-blue-400">Termos de Uso</a> e <a href="#" className="text-blue-400">Privacidade</a>.
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            Criar Conta Premium
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-400">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300">
                        Fazer login
                    </Link>
                </p>
            </div>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020617] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
