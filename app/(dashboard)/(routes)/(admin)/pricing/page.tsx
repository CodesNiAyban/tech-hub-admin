import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { SubscriptionPrices } from "@prisma/client";
import { DataTable } from "../_components/data-table";
import { pricingColumns } from "../_components/pricing-columns";

export const maxDuration = 60;

const PricingEditPage = async () => {
    let pricesData: SubscriptionPrices[];

    const existingPrices = await db.subscriptionPrices.findMany();
    if (existingPrices.length === 0) {
        const [basicProduct, proProduct, lifetimeProduct] = await Promise.all([
            stripe.products.retrieve(process.env.STRIPE_BASIC_PRODUCT_ID!),
            stripe.products.retrieve(process.env.STRIPE_PRO_PRODUCT_ID!),
            stripe.products.retrieve(process.env.STRIPE_LIFETIME_PRODUCT_ID!)
        ]);

        if (!basicProduct || !proProduct || !lifetimeProduct) {
            return new Response("Failed to retrieve products. Check if ENV's are correct. Make sure to put new ENVs after reset db command", { status: 500 });
        }

        const [basicPrice, proPrice, lifetimePrice] = await Promise.all([
            stripe.prices.retrieve(basicProduct.default_price as string),
            stripe.prices.retrieve(proProduct.default_price as string),
            stripe.prices.retrieve(lifetimeProduct.default_price as string)
        ]);

        if (!basicPrice || !proPrice || !lifetimePrice) {
            return new Response("Failed to retrieve prices.", { status: 500 });
        }

        await db.subscriptionPrices.createMany({
            data: [
                {
                    name: 'Basic',
                    description: "Access basic tech courses, AI-generated quizzes, and video courses with chapters.",
                    subscription: 'BASIC',
                    price: basicPrice.unit_amount! / 100,
                    recurring: basicPrice.recurring?.interval === 'month' ? 'month' : 'one_time',
                    currency: basicPrice.currency,
                    stripePriceId: basicPrice.id,
                    stripeProductId: basicPrice.product! as string,
                },
                {
                    name: 'Pro',
                    description: "Includes all features of the Basic plan plus more advanced courses and teacher mode.",
                    subscription: 'PRO',
                    price: proPrice.unit_amount! / 100,
                    recurring: proPrice.recurring?.interval === 'month' ? 'month' : 'one_time',
                    currency: proPrice.currency,
                    stripePriceId: proPrice.id,
                    stripeProductId: proPrice.product! as string,
                },
                {
                    name: 'Lifetime',
                    description: "Lifetime access to all current and future courses, with priority support and enterprise-grade security.",
                    subscription: 'LIFETIME',
                    price: lifetimePrice.unit_amount! / 100,
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
