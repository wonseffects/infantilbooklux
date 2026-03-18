"use client";

import React, { useEffect, useState } from "react";
import { Star, BookOpen, Clock, Play } from "lucide-react";
import Link from "next/link";
import { getFavorites, getUserBookProgress, toggleFavorite } from "../actions";
import { myBooks } from "@/data/books";

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            const [userFavorites, userProgress] = await Promise.all([
                getFavorites(),
                getUserBookProgress()
            ]);
            setFavorites(userFavorites);
            setProgress(userProgress);
            setLoading(false);
        }
        loadData();
    }, []);

    const handleToggleFavorite = async (e: React.MouseEvent, bookId: string) => {
        e.preventDefault();
        e.stopPropagation();
        await toggleFavorite(bookId);
        setFavorites(prev => prev.filter(id => id !== bookId));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const favoriteBooks = myBooks.filter(book => favorites.includes(book.id));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                    <Star className="text-yellow-400 fill-yellow-400" /> Meus Favoritos
                </h1>
                <p className="text-slate-400">Suas histórias preferidas guardadas em um só lugar.</p>
            </div>

            {favoriteBooks.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <BookOpen size={32} className="text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold">Nenhum favorito ainda</h3>
                    <p className="text-slate-400 max-w-md">
                        Explore a biblioteca e clique na estrelinha nos livros que você mais gostar para adicioná-los aqui!
                    </p>
                    <Link href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all mt-4">
                        Explorar Biblioteca
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {favoriteBooks.map((book) => {
                        const pagesRead = progress[book.id] || 0;
                        const totalPages = book.pages.length;
                        const percentComplete = Math.min(Math.round((pagesRead / totalPages) * 100), 100);

                        return (
                            <div key={book.id} className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-[32px] p-1 hover:scale-[1.02] transition-all duration-500">
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
                                            <Star size={18} className="text-yellow-400 fill-yellow-400" />
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
            )}
        </div>
    );
}
