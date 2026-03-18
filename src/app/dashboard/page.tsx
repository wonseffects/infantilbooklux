"use client";

import React from "react";
import {
    Play,
    Star,
    Clock,
    BookOpen,
    Zap,
    ChevronRight
} from "lucide-react";
import { createCheckoutSession } from "@/app/auth/stripe-action";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getUserProfile, getReadingStats, getFavorites, toggleFavorite, getUserBookProgress } from "./actions";


import { myBooks } from "@/data/books";


export default function DashboardPage() {
    const searchParams = useSearchParams();
    const priceId = searchParams.get('priceId');
    const bookId = searchParams.get('bookId');
    const checkoutFormRef = React.useRef<HTMLFormElement>(null);

    const [profile, setProfile] = React.useState<any>(null);
    const [stats, setStats] = React.useState({ todayPages: 0, lastBookId: null as string | null });
    const [favorites, setFavorites] = React.useState<string[]>([]);
    const [progress, setProgress] = React.useState<Record<string, number>>({});

    React.useEffect(() => {
        if (priceId && checkoutFormRef.current) {
            checkoutFormRef.current.requestSubmit();
        }

        async function loadData() {
            const [userProfile, userStats, userFavorites, userProgress] = await Promise.all([
                getUserProfile(),
                getReadingStats(),
                getFavorites(),
                getUserBookProgress()
            ]);
            setProfile(userProfile);
            setStats(userStats);
            setFavorites(userFavorites);
            setProgress(userProgress);
        }
        loadData();
    }, [priceId]);

    const handleToggleFavorite = async (e: React.MouseEvent, bookId: string) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(bookId);
        setFavorites(prev =>
            prev.includes(bookId) ? prev.filter(id => id !== bookId) : [...prev, bookId]
        );
    };

    const userName = profile?.full_name?.split(' ')[0] || "Explorador";
    const recommendedBook = myBooks.find(b => b.id === stats.lastBookId) || myBooks[0];


    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Hidden form for auto-checkout */}
            {priceId && (
                <form action={createCheckoutSession} ref={checkoutFormRef} className="hidden">
                    <input type="hidden" name="priceId" value={priceId} />
                    <input type="hidden" name="bookId" value={bookId || 'all'} />
                </form>
            )}
            {/* Welcome Banner */}
            <section className="relative min-h-[180px] md:h-64 rounded-[32px] md:rounded-[40px] overflow-hidden group shadow-2xl shadow-purple-500/10">
                <Link href={`/dashboard/read/${recommendedBook.id}`} className="absolute inset-0 z-20"></Link>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-90 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                <div className="relative h-full flex flex-col justify-center px-6 md:px-12 py-8 space-y-3 md:space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs font-bold tracking-widest uppercase w-fit">
                        <SparkleIcon /> Recomendação do dia
                    </div>
                    <h1 className="text-2xl md:text-5xl font-black leading-tight">Olá, {userName}!</h1>
                    <p className="text-white/80 max-w-lg text-sm md:text-lg">
                        Você já leu <span className="text-white font-bold">{stats.todayPages} páginas</span> hoje. Que tal continuar sua jornada {recommendedBook.title}?
                    </p>
                </div>

                <div className="absolute right-12 bottom-0 top-0 hidden lg:flex items-center">
                    <div className="w-56 h-72 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl rotate-6 shadow-2xl flex items-center justify-center p-4 group-hover:rotate-12 transition-transform duration-500">
                        <div className={`w-full h-full bg-gradient-to-tr ${recommendedBook.color} rounded-lg flex flex-col items-center justify-center text-center p-4 space-y-2 overflow-hidden relative`}>
                            {recommendedBook.coverImageUrl ? (
                                <img src={recommendedBook.coverImageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60" alt="" />
                            ) : (
                                <BookOpen size={48} className="text-white opacity-50" />
                            )}
                            <p className="font-bold text-sm relative z-10">{recommendedBook.title}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Continue Reading */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Clock className="text-blue-500" /> Continuar Lendo
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {myBooks.map((book) => {
                        const isFavorite = favorites.includes(book.id);
                        const pagesRead = progress[book.id] || 0;
                        const totalPages = book.pages.length;
                        const percentComplete = Math.min(Math.round((pagesRead / totalPages) * 100), 100);

                        return (
                            <div key={book.id} className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-1 p-[1px] hover:scale-[1.02] transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="bg-[#020617]/40 rounded-[31px] p-5 relative z-10 space-y-4">
                                    <div className={`aspect-[3/4] rounded-2xl bg-gradient-to-tr ${book.color} shadow-lg flex items-center justify-center overflow-hidden relative group-hover:shadow-blue-500/20 transition-all`}>
                                        {book.coverImageUrl ? (
                                            <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        ) : (
                                            <BookOpen size={64} className="text-white opacity-40 group-hover:scale-110 transition-transform duration-500" />
                                        )}

                                        <button
                                            onClick={(e) => handleToggleFavorite(e, book.id)}
                                            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                                        >
                                            <Star size={18} className={isFavorite ? "text-yellow-400 fill-yellow-400" : "text-white/60"} />
                                        </button>

                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Link href={`/dashboard/read/${book.id}`} className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                                <Play size={20} className="text-blue-600 fill-blue-600 ml-1" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <span className="text-[10px] uppercase tracking-widest font-black text-blue-400">{book.category}</span>
                                        <h3 className="font-bold text-sm truncate">{book.title}</h3>

                                        <div className="space-y-1.5 pt-2">
                                            <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                                <span>Progresso</span>
                                                <span className="text-blue-400">{percentComplete}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-1000"
                                                    style={{ width: `${percentComplete}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </section>

            {/* Achievement Section (Quick Card) */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[32px] p-8 flex items-center justify-between group">
                    <div className="space-y-4">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                            <Zap className="text-indigo-400" />
                        </div>
                        <h3 className="text-xl font-bold">Sequência Mágica!</h3>
                        <p className="text-slate-400 text-sm max-w-xs">Você leu histórias por {profile?.streak_days || 0} dias seguidos. Continue assim para ganhar o selo de Mestre das Estrelas!</p>
                    </div>
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 rotate-45 border-t-4 border-indigo-500 rounded-full" style={{ clipPath: `inset(0 0 ${100 - Math.min((profile?.streak_days || 0) * 10, 100)}% 0)` }}></div>
                        <span className="text-3xl font-black">{Math.min((profile?.streak_days || 0) * 10, 100)}%</span>
                    </div>

                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center border border-yellow-400/30 ring-8 ring-yellow-400/5">
                        <Star className="text-yellow-400 fill-yellow-400" size={32} />
                    </div>
                    <div>
                        <h3 className="font-black text-xl">{profile?.stars || 0}</h3>
                        <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Estrelas Ganhas</p>
                    </div>

                    <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
                        Resgatar Recompensas
                    </button>
                </div>
            </section>
        </div>
    );
}

function SparkleIcon() {
    return (
        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0l2.5 9.5 9.5 2.5-9.5 2.5-2.5 9.5-2.5-9.5-9.5-2.5 9.5-2.5z" />
        </svg>
    );
}
