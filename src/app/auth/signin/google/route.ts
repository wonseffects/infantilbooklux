import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin') || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`
        }
    })
    if (error || !data.url) {
        redirect('/login?error=Falha+ao+iniciar+login+com+Google')
    }
    redirect(data.url)
}
