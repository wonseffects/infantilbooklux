"use client";

import React, { useState, useEffect } from "react";
import { User, Lock, Mail, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { getUserProfile, updateUserProfile, updateUserPassword } from "../actions";

export default function SettingsPage() {
    const [profile, setProfile] = useState<any>(null);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        async function loadProfile() {
            const userProfile = await getUserProfile();
            if (userProfile) {
                setProfile(userProfile);
                setFullName(userProfile.full_name || "");
                setEmail(userProfile.email || "");
            }
            setLoading(false);
        }
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        const result = await updateUserProfile({ full_name: fullName });
        
        let passwordError = false;
        if (password) {
            const pwdResult = await updateUserPassword(password);
            if (pwdResult.error) {
                passwordError = true;
            }
        }

        if (result.error || passwordError) {
            setMessage({ text: "Erro ao atualizar suas configurações.", type: "error" });
        } else {
            setMessage({ text: password ? "Perfil e senha atualizados com sucesso!" : "Perfil atualizado com sucesso!", type: "success" });
            setPassword("");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                    <User className="text-blue-500" /> Meu Perfil
                </h1>
                <p className="text-slate-400">Gerencie suas informações pessoais e preferências.</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 border ${
                    message.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-medium text-sm">{message.text}</span>
                </div>
            )}

            <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
                <div className="p-8">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Nome de Exibição</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium"
                                    placeholder="Como quer ser chamado?"
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500">Este é o nome que aparecerá no seu painel principal.</p>
                        </div>
                        
                        <div className="space-y-2 opacity-50 relative group cursor-not-allowed">
                            <label className="text-sm font-bold text-slate-300">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="email"
                                    value={email || "Carregando..."}
                                    disabled
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white font-medium cursor-not-allowed"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Para alterar seu e-mail, contate o suporte.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-300">Nova Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600 font-medium"
                                    placeholder="Deixe em branco para não alterar"
                                />
                            </div>
                            <p className="text-xs text-slate-500">Digite uma nova senha apenas se quiser alterá-la.</p>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                Salvar Alterações
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <div className="bg-red-500/5 border border-red-500/10 rounded-[32px] p-8 space-y-4">
                 <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
                     <AlertCircle size={20} /> Zona de Perigo
                 </h2>
                 <p className="text-sm text-slate-400">
                     Ações irreversíveis que afetarão sua conta permanentemente.
                 </p>
                 <button className="px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-colors border border-red-500/20 text-sm">
                     Excluir minha conta
                 </button>
            </div>
        </div>
    );
}
