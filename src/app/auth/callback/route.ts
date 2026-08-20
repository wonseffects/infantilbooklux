import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const cookieStore = await cookies()
        let supabaseResponse = NextResponse.next({ request })

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll()
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            )
                            supabaseResponse = NextResponse.next({ request })
                            cookiesToSet.forEach(({ name, value, options }) =>
                                supabaseResponse.cookies.set(name, value, options)
                            )
                        } catch {}
                    },
                },
            }
        )

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host')
            const isLocalEnv = process.env.NODE_ENV === 'development'
            let redirectUrl: string

            if (isLocalEnv) {
                redirectUrl = `http://localhost:3000${next}`
            } else if (forwardedHost) {
                redirectUrl = `https://${forwardedHost}${next}`
            } else {
                redirectUrl = `https://${request.headers.get('host')}${next}`
            }

            const redirectResponse = NextResponse.redirect(redirectUrl)

            // Propagar as cookies de autenticação para a resposta de redirect
            supabaseResponse.cookies.getAll().forEach(cookie => {
                redirectResponse.cookies.set(cookie.name, cookie.value)
            })

            return redirectResponse
        }
    }

    const forwardedHost = request.headers.get('x-forwarded-host')
    const baseUrl = forwardedHost ? `https://${forwardedHost}` : `${request.nextUrl.protocol}//${request.nextUrl.host}`
    return NextResponse.redirect(`${baseUrl}/login?error=Falha+ao+autenticar+com+Google`)
}
