'use server'

import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)


export async function getCheckoutUrl(priceId: string, bookId: string, userId: string, userEmail: string) {
    // Retrieve the price to check if it's recurring or one-time
    const price = await stripe.prices.retrieve(priceId);
    const mode = price.type === 'recurring' ? 'subscription' : 'payment';

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: mode,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
        client_reference_id: userId,
        customer_email: userEmail,
        metadata: {
            user_id: userId,
            book_id: bookId,
        },
    })

    return session.url;
}

export async function createCheckoutSession(formData: FormData) {
    const priceId = formData.get('priceId') as string
    const bookId = formData.get('bookId') as string || 'all'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect(`/register?priceId=${priceId}&bookId=${bookId}`)
    }

    const url = await getCheckoutUrl(priceId, bookId, user.id, user.email || '')

    if (url) {
        redirect(url)
    }
}
