import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/utils/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
    console.log('--- Webhook Stripe: Recebido ---');
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        console.log(`Evento validado: ${event.type}`);
    } catch (err: any) {
        console.error(`Erro ao validar Webhook: ${err.message}`);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Usar createAdminClient para ignorar RLS e salvar o pagamento
    const supabase = await createAdminClient()

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const bookId = session.metadata?.book_id || 'all'
        
        console.log(`Processando compra - User: ${userId}, Book: ${bookId}`);

        if (userId) {
            console.log('Tentando salvar assinatura no Supabase (Admin)...');
            const { error } = await supabase
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    stripe_customer_id: session.customer as string,
                    stripe_subscription_id: session.subscription as string || 'one-time-purchase-' + Date.now(),
                    status: 'active',
                    book_id: bookId,
                    current_period_end: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000).toISOString(),
                })

            if (error) {
                console.error('ERRO AO SALVAR NO SUPABASE:', error);
                return NextResponse.json({ error: 'Error updating subscription' }, { status: 500 })
            }
            console.log('Sucesso! Acesso liberado no banco de dados.');
        } else {
            console.warn('Alerta: user_id não encontrado no metadata da Stripe.');
        }
    }

    return NextResponse.json({ received: true })
}
