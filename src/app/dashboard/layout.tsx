"use client";

import React from "react";
import {
    Book,
    LayoutDashboard,
    Settings,
    LogOut,
    User,
    Star,
    Search,
    Bell,
    Menu,
    X,
    CheckCircle2,
    Calendar,
    Zap,
    ChevronRight,
    Mail
} from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { useRouter } from "next/navigation";
import { getUserProfile } from "./actions";

import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(false);
    const [isLoadingUser, setIsLoadingUser] = React.useState(true);
    const [profile, setProfile] = React.useState<any>(null);
    const router = useRouter();


    React.useEffect(() => {
        async function checkSession() {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                router.push('/login');
            } else {
                const userProfile = await getUserProfile();
                setProfile(userProfile);
                setIsLoadingUser(false);
            }
        }
        checkSession();
    }, [router]);


    // Initial check for screen size and listener
    React.useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            // Default: closed on mobile, open on desktop
            if (mobile) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    if (isLoadingUser) {
        return (
            <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center text-white space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold animate-pulse text-blue-400 uppercase tracking-widest font-sans">Segurança InfantilLux: Validando acesso...</p>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[#020617] text-white flex overflow-hidden font-sans">
            {/* Backdrop for mobile */}
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    ${isMobile ? "fixed inset-y-0 left-0 z-50 w-72" : "relative h-full flex-shrink-0"}
                    bg-[#020617]/95 lg:bg-white/5 backdrop-blur-2xl border-r border-white/10
                    flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isMobile
                        ? (isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full")
                        : (isSidebarOpen ? "w-64" : "w-20")
                    }
                `}
            >
                {/* Logo Section */}
                <div className="h-20 flex items-center px-6 gap-3 shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
                        <Book className="text-white w-6 h-6" />
                    </div>
                    {(isSidebarOpen || isMobile) && (
                        <span className="text-xl font-black tracking-tight whitespace-nowrap animate-in fade-in duration-500">
                            Infantil<span className="text-blue-500">Lux</span>
                        </span>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem
                        href="/dashboard"
                        icon={<LayoutDashboard size={22} />}
                        label="Biblioteca"
                        active
                        isOpen={isSidebarOpen || isMobile}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                    />
                    <NavItem
                        href="/dashboard/favorites"
                        icon={<Star size={22} />}
                        label="Favoritos"
                        isOpen={isSidebarOpen || isMobile}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                    />
                    <NavItem
                        href="/dashboard/settings"
                        icon={<Settings size={22} />}
                        label="Configurações"
                        isOpen={isSidebarOpen || isMobile}
                        onClick={() => isMobile && setIsSidebarOpen(false)}
                    />
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/10 shrink-0">
                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group overflow-hidden"
                    >
                        <LogOut size={22} className="group-hover:translate-x-1 transition-transform" />
                        {(isSidebarOpen || isMobile) && (
                            <span className="font-bold text-sm whitespace-nowrap animate-in slide-in-from-left-2 duration-300">Sair da Conta</span>
                        )}
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full relative">
                {/* Header */}
                <header className="h-20 border-b border-white/10 px-4 md:px-8 flex items-center justify-between bg-[#020617]/50 backdrop-blur-xl shrink-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="p-2.5 hover:bg-white/10 rounded-xl transition-all active:scale-90 border border-white/5 bg-white/5 shadow-sm"
                            aria-label="Toggle Sidebar"
                        >
                            {isSidebarOpen && !isMobile ? <X size={20} className="text-blue-400" /> : <Menu size={20} />}
                        </button>
                    </div>

                    {/* Search - Visible on MD up */}
                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                type="text"
                                placeholder="Buscar histórias mágicas..."
                                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 transition-all placeholder:text-slate-600"
                            />
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-2 md:gap-4 shrink-0">
                        <button className="relative p-2.5 hover:bg-white/5 rounded-xl transition-all text-slate-300 hover:text-white">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#020617] animate-pulse"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-white/10 ml-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black tracking-wide text-white">{profile?.full_name?.split(' ')[0] || "Explorador"}</p>
                                <p className="text-[10px] text-blue-400/80 font-bold uppercase tracking-tight">Nível {Math.floor((profile?.stars || 0) / 100) + 1}</p>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/80 to-purple-600/80 p-0.5 shadow-lg shadow-purple-500/10 active:scale-95 transition-transform">
                                <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
                                    <User size={18} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <main className="flex-1 overflow-y-auto p-4 md:p-10 relative bg-[#020617]">
                    {/* Background mesh glow */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
                    <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>

                    <div className="max-w-7xl mx-auto min-h-full space-y-6">
                        {/* Email Confirmation Banner */}
                        <EmailBanner />
                        
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function EmailBanner() {
    const [user, setUser] = React.useState<any>(null);
    const [isVisible, setIsVisible] = React.useState(true);

    React.useEffect(() => {
        async function checkUser() {
            const { createClient } = await import('@/utils/supabase/client');
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }
        checkUser();
    }, []);

    // Se o usuário não existe, ou já confirmou o email, ou fechou o banner, não mostra nada
    if (!user || user.email_confirmed_at || !isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                    <Mail className="text-amber-500 w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">Confirme seu E-mail</p>
                    <p className="text-xs text-slate-400">Enviamos um link para <span className="text-amber-400 font-bold">{user.email}</span>. Por favor, confirme para garantir a segurança da sua conta.</p>
                </div>
            </div>
            <button 
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-500"
            >
                <X size={18} />
            </button>
        </div>
    );
}

function NavItem({
    href,
    icon,
    label,
    active = false,
    isOpen,
    onClick
}: {
    href: string,
    icon: React.ReactNode,
    label: string,
    active?: boolean,
    isOpen: boolean,
    onClick?: () => void
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                flex items-center gap-3 p-3.5 rounded-2xl transition-all group relative overflow-hidden
                ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }
            `}
        >
            <div className={`shrink-0 ${active ? "" : "group-hover:scale-110 transition-transform duration-300"}`}>
                {icon}
            </div>
            {(isOpen) && (
                <span className="font-bold text-sm tracking-wide whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">
                    {label}
                </span>
            )}
            {active && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-l-full"></div>
            )}
        </Link>
    );
}
