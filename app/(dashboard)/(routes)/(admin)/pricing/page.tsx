import { formatPrice } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { DataTable } from "../_components/data-table";
import db from "@/lib/db";
import { SubscriptionPrices } from "@prisma/client";
import { pricingColumns } from "../_components/pricing-columns";

const PricingEditPage = async () => {
    let pricesData: SubscriptionPrices[];

    const existingPrices = await db.subscriptionPrices.findMany();
    if (existingPrices.length === 0) {
        const [basicPrice, proPrice, lifetimePrice] = await Promise.all([
            stripe.prices.retrieve(process.env.STRIPE_BASIC_SUBSCRIPTION_ID!),
            stripe.prices.retrieve(process.env.STRIPE_PRO_SUBSCRIPTION_ID!),
            stripe.prices.retrieve(process.env.STRIPE_LIFETIME_SUBSCRIPTION_ID!)
        ]);

        if (!basicPrice || !proPrice || !lifetimePrice) {
            return new Response("Failed to retrieve prices. Check if ENV's are correct. Make sure to put new ENVs after reset db command", { status: 500 });
        }

        await db.subscriptionPrices.createMany({
            data: [
                {
                    name: 'Basic',
                    description: "Access basic tech courses, AI-generated quizzes, and video courses with chapters.",
                    subscription: 'BASIC',
                    price: basicPrice.unit_amount!,
                    recurring: basicPrice.recurring?.interval === 'month' ? 'month' : 'one_time',
                    currency: basicPrice.currency,
                    stripePriceId: basicPrice.id,
                    stripeProductId: basicPrice.product! as string,
                },
                {
                    name: 'Pro',
                    description: "Includes all features of the Basic plan plus more advanced courses and teacher mode.",
                    subscription: 'PRO',
                    price: proPrice.unit_amount!,
                    recurring: proPrice.recurring?.interval === 'month' ? 'month' : 'one_time',
                    currency: proPrice.currency,
                    stripePriceId: proPrice.id,
                    stripeProductId: proPrice.product! as string,
                },
                {
                    name: 'Lifetime',
                    description: "Lifetime access to all current and future courses, with priority support and enterprise-grade security.",
                    subscription: 'LIFETIME',
                    price: lifetimePrice.unit_amount!,
                    recurring: 'one_time',
                    currency: lifetimePrice.currency,
                    stripePriceId: lifetimePrice.id,
                    stripeProductId: lifetimePrice.product! as string,
                }
            ]
        });

        pricesData = await db.subscriptionPrices.findMany();
    } else {
        pricesData = existingPrices;
    }

    return (
        <div className="p-6 mt-10">
            <DataTable columns={pricingColumns} data={pricesData} />
        </div>
    );
}

export default PricingEditPage;
