import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET() {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
        }
    })
    if (error || !data.url) {
        redirect('/login?error=Falha+ao+iniciar+login+com+Google')
    }
    redirect(data.url)
}
