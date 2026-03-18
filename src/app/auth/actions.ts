'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { getCheckoutUrl } from './stripe-action'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: authData, error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        if (error.message.includes('Email not confirmed')) {
            redirect(`/login?message=${encodeURIComponent('Por favor, confirme seu e-mail para continuar. Enviamos um link para você!')}`)
        }
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    const priceId = formData.get('priceId') as string
    const bookId = formData.get('bookId') as string

    revalidatePath('/', 'layout')
    
    if (priceId) {
        redirect(`/dashboard?priceId=${priceId}&bookId=${bookId}`)
    }
    
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const signupData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        options: {
            data: {
                full_name: formData.get('name') as string,
            }
        }
    }

    const { data, error } = await supabase.auth.signUp(signupData)

    if (error) {
        redirect('/register?error=' + encodeURIComponent(error.message))
    }

    const priceId = formData.get('priceId') as string
    const bookId = formData.get('bookId') as string

    revalidatePath('/', 'layout')
    
    let redirectUrl = '/dashboard';

    if (priceId && data.user) {
        try {
            const url = await getCheckoutUrl(priceId, bookId, data.user.id, data.user.email || '');
            if (url) {
                redirect(url);
            }
        } catch (err) {
            if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
                throw err;
            }
            console.error("Error creating direct checkout:", err);
            redirectUrl = `/dashboard?priceId=${priceId}&bookId=${bookId}&new=true`;
        }
    } else {
        // Se for um cadastro normal sem compra imediata, 
        // e a confirmação de e-mail estiver ativa, mandamos para o login com aviso
        redirect(`/login?message=${encodeURIComponent('Conta criada! Por favor, verifique seu e-mail para confirmar seu acesso.')}`)
    }

    redirect(redirectUrl)
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}
