"use client";

import React, { useRef, useState, useEffect } from "react";
import HTMLFlavorPageFlip from "react-pageflip";
import {
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X,
    Settings,
    Bookmark,
    Lock,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { myBooks, Book } from "@/data/books";
import Image from "next/image";
import { recordPageRead } from "../../actions";



const Page = React.forwardRef<HTMLDivElement, { children: React.ReactNode, number: number }>((props, ref) => {
    return (
        <div className="bg-[#fefae0] shadow-2xl overflow-hidden relative" ref={ref}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-20 pointer-events-none"></div>
            <div className="h-full flex flex-col p-8 md:p-12 relative z-10">
                <div className="flex-1 text-slate-800 font-serif leading-relaxed">
                    {props.children}
                </div>
                <div className="mt-4 text-center text-slate-400 text-xs font-bold font-sans">
                    PÁGINA {props.number}
                </div>
            </div>
        </div>
    );
});

Page.displayName = "Page";

export default function ReaderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const bookFlip = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [book, setBook] = useState<Book | null>(null);

    useEffect(() => {
        const foundBook = myBooks.find(b => b.id === id);
        if (foundBook) {
            setBook(foundBook);
        }
    }, [id]);


    useEffect(() => {
        async function checkSubscription() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
                console.log('--- Verificação de Acesso ---');
                console.log('Usuário:', user.email);
                
                const { data, error } = await supabase
                    .from('subscriptions')
                    .select('status, book_id')
                    .eq('user_id', user.id);
                
                if (error) {
                    console.error("Erro ao buscar assinaturas:", error);
                    setIsSubscriber(false);
                    setIsLoading(false);
                    return;
                }

                console.log('Assinaturas encontradas:', data);

                const isSubscriber = data.some(sub => 
                    sub.status === 'active' && 
                    (sub.book_id === 'all' || sub.book_id === id)
                );
                
                console.log('Acesso Liberado:', isSubscriber ? 'SIM ✅' : 'NÃO ❌');
                setIsSubscriber(isSubscriber);
            } else {
                console.warn('Nenhum usuário logado detectado no Reader.');
            }
            setIsLoading(false);
        }
        checkSubscription();
    }, [id]);

    if (isLoading) {
        return <div className="fixed inset-0 bg-[#020617] flex items-center justify-center text-white">Carregando livro...</div>;
    }

    return (
        <div className="fixed inset-0 z-[60] bg-[#020617] flex flex-col overflow-hidden">
            {/* Reader Controls Top */}
            <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <X size={20} className="text-slate-400" />
                    </Link>
                    <div className="h-4 w-px bg-white/10"></div>
                    <h1 className="text-sm font-bold text-slate-200 uppercase tracking-widest">{book?.title || "Carregando..."}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400">
                        <Bookmark size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400">
                        <Settings size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </header>

            {/* Book Container */}
            <main className="flex-1 flex items-center justify-center p-4 md:p-10 bg-mesh relative">
                <div className="absolute inset-0 bg-blue-500/5 blur-[100px]"></div>

                <div className="relative z-10 w-full max-w-5xl h-full max-h-[800px] flex items-center justify-center">
                    {/* Restriction Overlay - Aparece quando tenta ir além da página 3 */}
                    {!isSubscriber && currentPage >= 3 && (
                        <div className="absolute inset-0 z-50 bg-[#020617]/90 backdrop-blur-md flex items-center justify-center p-6 text-center rounded-[32px]">
                            <div className="max-w-md space-y-6">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                                    <Lock className="text-blue-500 w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black text-white">Ops! Fim da Prévia</h2>
                                <p className="text-slate-400">Você leu as 3 páginas gratuitas. Para continuar esta aventura e desbloquear todos os nossos ebooks, assine o plano premium!</p>
                                <div className="grid gap-4">
                                    <Link 
                                        href="/" 
                                        className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-xl transition-all shadow-blue-500/25"
                                    >
                                        Comprar este Ebook
                                    </Link>
                                    <Link 
                                        href="/" 
                                        className="inline-block w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-2xl transition-all"
                                    >
                                        Garantir Pack (10 Livros)
                                    </Link>
                                </div>
                                <button 
                                    onClick={() => bookFlip.current.pageFlip().turnToPage(0)}
                                    className="text-slate-500 text-sm font-bold hover:text-white transition-colors"
                                >
                                    Voltar ao início
                                </button>
                            </div>
                        </div>
                    )}

                    {/* @ts-ignore */}
                    <HTMLFlavorPageFlip
                        width={500}
                        height={700}
                        size="stretch"
                        minWidth={315}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1533}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        onFlip={(e: any) => {
                            setCurrentPage(e.data);
                            recordPageRead(id);
                        }}
                        ref={bookFlip}
                        className="shadow-2xl"
                    >
                        {/* Capa do Livro */}
                        <div className="bg-[#fefae0] shadow-2xl overflow-hidden relative" p-cover="true">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] opacity-20 pointer-events-none"></div>
                            <div className="h-full flex flex-col items-center justify-center p-8 md:p-12 relative z-10">
                                {book?.coverImageUrl ? (
                                    <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl mb-8 border-4 border-white/20">
                                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className={`w-32 h-32 bg-gradient-to-tr ${book?.color} rounded-3xl shadow-xl mb-8`}></div>
                                )}
                                <h1 className="text-4xl font-serif font-black text-center text-slate-900 leading-tight mb-4">
                                    {book?.title}
                                </h1>
                                <div className="h-1 w-20 bg-blue-500 rounded-full"></div>
                                <p className="mt-8 text-slate-500 font-bold uppercase tracking-widest text-xs">
                                    {book?.category}
                                </p>
                            </div>
                        </div>

                        {/* Páginas Internas */}
                        {book?.pages.map((page, index) => (
                            <Page key={index} number={index + 1}>
                                {(!isSubscriber && (index + 1) >= 3) ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <Lock size={48} className="text-slate-300 mb-4" />
                                        <p className="text-slate-400 font-bold italic">Conteúdo Bloqueado</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {page.title && (
                                            <h3 className="text-2xl font-bold mb-6 text-blue-800">
                                                {page.title}
                                            </h3>
                                        )}
                                        
                                        {page.imageUrl && (
                                            <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
                                                <img 
                                                    src={page.imageUrl} 
                                                    alt={page.imageAlt || "Ilustração"} 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        {page.text?.map((paragraph, pIdx) => (
                                            <p key={pIdx} className="text-slate-700">
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </Page>
                        ))}
                    </HTMLFlavorPageFlip>

                </div>
            </main>

            {/* Navigation Bottom */}
            <footer className="h-20 bg-black/40 backdrop-blur-md border-t border-white/10 px-8 flex items-center justify-center gap-10">
                <button
                    onClick={() => bookFlip.current.pageFlip().flipPrev()}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Anterior</span>
                </button>

                <div className="flex flex-col items-center">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] mb-1">Progresso</div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-blue-500">Pág {currentPage + 1}</span>
                        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300"
                                style={{ width: `${((currentPage + 1) / (isSubscriber ? (book?.pages.length || 1) : 3)) * 100}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-500">{isSubscriber ? (book?.pages.length || 1) : 3}</span>

                    </div>
                </div>

                <button
                    onClick={() => bookFlip.current.pageFlip().flipNext()}
                    className={`flex items-center gap-2 text-slate-400 hover:text-white transition-colors group ${!isSubscriber && currentPage >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Próximo</span>
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                        <ChevronRight size={20} />
                    </div>
                </button>
            </footer>
        </div>
    );
}
