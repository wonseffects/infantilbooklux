"use client";

import React, { useState, useEffect } from "react";
import {
    BookOpen,
    ShoppingCart,
    Lock,
    Moon,
    Sun,
    Star,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Sparkles,
    Zap
} from "lucide-react";
import Link from "next/link";
import { createCheckoutSession } from "@/app/auth/stripe-action";
import { myBooks } from "@/data/books";
import Image from "next/image";

const landingBooks = myBooks.map(book => {
    let description = "";
    let priceId = "price_1TBcjTD3rPb8y5wPbWMPalXW"; // default ou placeholder

    switch (book.id) {
        case "1":
            description = "Uma jornada mágica onde Luna descobre uma floresta secreta e ajuda seus novos amigos animais.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "2":
            description = "Edward explora a natureza e aprende que grandes descobertas estão nos pequenos detalhes.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "3":
            description = "Uma viagem espacial onde Leo aprende sobre as constelações e descobre a coragem dentro de si.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "4":
            description = "A adorável Família Urso mostra ao pequeno Bibo que o maior tesouro é o calor de um lar.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "5":
            description = "Tito, o guaxinim explorador, descobre que ajudar os outros é a melhor parte da aventura.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "6":
            description = "O pequeno elefante Zeca descobre como um simples abraço pode espantar a tristeza.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "7":
            description = "A encantadora história da Casa Cinco, que mudava de cor com as emoções e alegrava toda a vizinhança.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "8":
            description = "Luma, a simpática raposa, faz amizade com vagalumes e aprende a não ter medo do escuro.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "9":
            description = "A minhoca Bento e seus incríveis amigos insetos se unem para ajudar uma estrelinha caída.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
        case "10":
            description = "A garotinha Pip ajuda o velhinho Tibo a encontrar as receitas mágicas de criar nuvens.";
            priceId = "price_1T9skfD3rPb8y5wPWu982kRZ";
            break;
    }

    return {
        ...book,
        price: 6.99,
        description,
        priceId
    };
});

export default function Home() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % landingBooks.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // Sync theme with document class
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <main className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">

                {/* Navigation */}
                <nav className="fixed w-full z-50 backdrop-blur-md bg-white/70 dark:bg-[#020617]/70 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-black tracking-tight dark:text-white">
                                InfantilBooks<span className="text-blue-500">Lux</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={toggleTheme}
                                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:scale-110 transition-all duration-300"
                            >
                                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
                            </button>
                            <Link href="/login" className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-blue-500/25">
                                <ShoppingCart className="w-4 h-4" />
                                Acessar Agora
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 dark:opacity-20 pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-bold border border-blue-500/20">
                                <Zap className="w-4 h-4" /> Coleção Exclusiva 2026
                            </div>
                            <h2 className="text-5xl lg:text-7xl font-black leading-tight dark:text-white">
                                Histórias que <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-black">Transformam</span> Sonhos em Realidade
                            </h2>
                            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                                Dê ao seu filho o presente da imaginação. 10 ebooks premium com ilustrações deslumbrantes e histórias cativantes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <form action={createCheckoutSession}>
                                    <input type="hidden" name="priceId" value="price_1TBcftD3rPb8y5wPCUEX2rh8" />
                                    <button type="submit" className="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-blue-500/25 active:scale-95 text-lg">
                                        Garantir Pack Completo
                                    </button>
                                </form>
                                <button className="flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-2xl bg-slate-100 dark:bg-slate-800 dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-slate-700">
                                    Ver Coleção <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] text-slate-500">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <span>+5.000 pais já assinaram</span>
                            </div>
                        </div>

                        {/* Premium Slider */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[40px] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl rounded-[32px] overflow-hidden p-8 aspect-[4/5] flex flex-col justify-between">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                                    </div>
                                    <span className="text-xs font-bold text-white/60">EBOOK PREMIUM</span>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                                    <div className="relative w-64 h-80 bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-700 dark:to-slate-900 rounded-2xl shadow-2xl transform transition-all duration-700 hover:rotate-2 animate-float flex items-center justify-center overflow-hidden">
                                        {landingBooks[currentSlide].coverImageUrl ? (
                                            <img
                                                src={landingBooks[currentSlide].coverImageUrl}
                                                alt={landingBooks[currentSlide].title}
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-mesh opacity-50"></div>
                                                <span className="text-white font-black text-center px-6 drop-shadow-lg scale-125 relative z-10">
                                                    {landingBooks[currentSlide].title}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <h4 className="text-2xl font-bold text-white mb-2">{landingBooks[currentSlide].title}</h4>
                                        <p className="text-white/70 text-sm max-w-[300px]">{landingBooks[currentSlide].description}</p>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center gap-1.5 flex-wrap px-4">
                                    {landingBooks.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentSlide(i)}
                                            className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? 'w-6 bg-blue-500' : 'w-3 bg-white/20 hover:bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center space-y-4 mb-20">
                        <h3 className="text-4xl md:text-5xl font-black dark:text-white">Escolha sua <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 font-black">Aventura</span></h3>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Preços acessíveis para momentos inestimáveis de aprendizado.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {landingBooks.map((book) => (
                            <div key={book.id} className="group flex flex-col relative bg-white dark:bg-slate-900/50 rounded-[32px] p-6 border border-slate-200 dark:border-slate-800 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
                                <div className="aspect-[4/5] w-full relative bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6 flex items-center justify-center group-hover:bg-blue-500/5 transition-colors overflow-hidden">
                                    {book.coverImageUrl ? (
                                        <img src={book.coverImageUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-700 group-hover:text-blue-500 transition-colors" />
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <h4 className="text-xl font-bold dark:text-white mb-2 line-clamp-2">{book.title}</h4>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed flex-1 line-clamp-3">
                                        {book.description}
                                    </p>
                                    <div className="flex justify-between items-center mb-6 mt-auto">
                                        <div className="text-2xl font-black text-blue-600 dark:text-blue-400">R$ {book.price}</div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                                            <Sparkles className="w-3 h-3" /> NOVO
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            href={`/register?redirect=/dashboard/read/${book.id}`}
                                            className="flex items-center justify-center gap-1 py-3 px-2 rounded-xl border-2 border-slate-200 dark:border-slate-800 font-bold text-sm dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                        >
                                            <Lock className="w-4 h-4" /> Preview
                                        </Link>
                                        <form action={createCheckoutSession} className="w-full">
                                            <input type="hidden" name="priceId" value={book.priceId} />
                                            <input type="hidden" name="bookId" value={book.id} />
                                            <button type="submit" className="w-full h-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-2 rounded-xl transition-all shadow-lg shadow-blue-500/20">
                                                Comprar
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mega Pack Section */}
                    <div className="mt-16 group relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-800 to-purple-900 rounded-[40px] p-12 text-white shadow-2xl">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <div className="inline-block px-4 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-bold tracking-wider">OFERTA IRRESISTÍVEL</div>
                                <h3 className="text-4xl lg:text-5xl font-black">A Coleção Completa <br /> <span className="text-blue-300">10 Ebooks</span> Premium</h3>
                                <ul className="space-y-3">
                                    {["Acesso Vitalício", "Leitor Imersivo (Flip)", "Download para Leitura Offline", "Modo audiobook incluso"].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 font-medium opacity-90">
                                            <CheckCircle2 className="w-5 h-5 text-blue-300" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center">
                                <p className="text-lg opacity-80 line-through">De R$ 69,90</p>
                                <div className="flex items-center justify-center gap-3 my-4">
                                    <span className="text-2xl font-medium">Por apenas</span>
                                    <div className="text-6xl font-black text-blue-300 drop-shadow-xl">R$ 59,90</div>
                                </div>
                                <form action={createCheckoutSession}>
                                    <input type="hidden" name="priceId" value="price_1TBcftD3rPb8y5wPCUEX2rh8" />
                                    <input type="hidden" name="bookId" value="all" />
                                    <button type="submit" className="w-full bg-white text-blue-900 font-black text-xl py-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 mb-4">
                                        QUERO MEU PACK AGORA!
                                    </button>
                                </form>
                                <p className="text-xs opacity-70 flex items-center justify-center gap-1">
                                    <Lock className="w-3 h-3" /> Pagamento 100% seguro via Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-slate-100 dark:bg-slate-900/50 py-16 px-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="text-white w-4 h-4" />
                            </div>
                            <span className="text-xl font-black dark:text-white">InfantilBooksLux</span>
                        </div>
                        <div className="flex gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <a href="#" className="hover:text-blue-500 transition-colors">Apoio</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">Termos</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">Privacidade</a>
                            <a href="#" className="hover:text-blue-500 transition-colors">Contato</a>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 InfantilBooksLux. Feito com paixão.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
