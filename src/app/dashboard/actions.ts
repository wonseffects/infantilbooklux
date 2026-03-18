"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getUserProfile() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Explorador";
        const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
                id: user.id,
                full_name: fullName,
                stars: 0,
                streak_days: 0,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();
        
        if (insertError) {
            console.error('Error creating profile:', insertError);
            return { id: user.id, full_name: fullName, stars: 0, streak_days: 0, email: user.email };
        }
        return { ...newProfile, email: user.email };
    }

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }

    return { ...profile, email: user.email };
}

export async function getReadingStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { todayPages: 0, lastBookId: null };

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('reading_history')
        .select('pages_read, book_id')
        .eq('user_id', user.id)
        .eq('read_date', today);

    if (error) {
        console.error('Error fetching reading history:', error);
        return { todayPages: 0, lastBookId: null };
    }

    const totalPages = data.reduce((acc, curr) => acc + curr.pages_read, 0);
    const lastBookId = data.length > 0 ? data[data.length - 1].book_id : null;

    return { todayPages: totalPages, lastBookId };
}

export async function getUserBookProgress() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return {};

    // Get all reading history for this user
    const { data, error } = await supabase
        .from('reading_history')
        .select('book_id, pages_read')
        .eq('user_id', user.id);

    if (error || !data) {
        console.error('Error fetching book progress:', error);
        return {};
    }

    // Sum pages read per book
    const progress: Record<string, number> = {};
    for (const record of data) {
        if (!progress[record.book_id]) {
            progress[record.book_id] = 0;
        }
        progress[record.book_id] += record.pages_read;
    }

    return progress;
}

export async function updateUserProfile(data: { full_name?: string }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autenticado" };

    if (data.full_name) {
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: data.full_name, updated_at: new Date().toISOString() })
            .eq('id', user.id);

        if (error) return { error: error.message };
        
        // Update user metadata as well
        await supabase.auth.updateUser({
            data: { full_name: data.full_name }
        });
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard');
    return { success: true };
}

export async function toggleFavorite(bookId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Not authenticated' };

    const { data: existing } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .single();

    if (existing) {
        await supabase.from('favorites').delete().eq('id', existing.id);
    } else {
        await supabase.from('favorites').insert({ user_id: user.id, book_id: bookId });
    }

    revalidatePath('/dashboard');
    return { success: true };
}

export async function getFavorites() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('favorites')
        .select('book_id')
        .eq('user_id', user.id);

    if (error) return [];
    return data.map(f => f.book_id);
}

export async function recordPageRead(bookId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split('T')[0];

    // Check if entry exists for today and this book
    const { data: existing } = await supabase
        .from('reading_history')
        .select('id, pages_read')
        .eq('user_id', user.id)
        .eq('book_id', bookId)
        .eq('read_date', today)
        .single();

    if (existing) {
        await supabase
            .from('reading_history')
            .update({ pages_read: existing.pages_read + 1, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
    } else {
        await supabase
            .from('reading_history')
            .insert({ user_id: user.id, book_id: bookId, pages_read: 1, read_date: today });
    }

    // Update streak logic
    let { data: profile } = await supabase.from('profiles').select('last_read_date, streak_days, stars').eq('id', user.id).single();
    
    if (!profile) {
        // Create profile if it doesn't exist during reading
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Explorador";
        const { data: newProfile } = await supabase.from('profiles').insert({
            id: user.id,
            full_name: fullName,
            stars: 0,
            streak_days: 1,
            last_read_date: today,
            updated_at: new Date().toISOString()
        }).select().single();
        profile = newProfile;
    } else {
        const lastRead = profile.last_read_date;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = profile.streak_days;
        if (lastRead === yesterdayStr) {
            newStreak += 1;
        } else if (lastRead !== today) {
            newStreak = 1;
        }

        await supabase.from('profiles').update({ 
            last_read_date: today, 
            streak_days: newStreak,
            stars: (profile.stars || 0) + 10 // Reward 10 stars per page
        }).eq('id', user.id);
    }

    revalidatePath('/dashboard');
}

export async function updateUserPassword(password: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Não autenticado" };

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) return { error: error.message };

    return { success: true };
}
