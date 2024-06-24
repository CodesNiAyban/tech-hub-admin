import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { SubscriptionType } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`⚠️ Webhook Error: ${error.message}`, { status: 400 });
    }

    try {
        let subscription;

        switch (event.type) {
            case "checkout.session.completed":
                const session = event.data.object as Stripe.Checkout.Session;
                if (session.mode === "payment") {
                    if (session.metadata && session.metadata.type === "course") {
                        await db.purchase.create({
                            data: {
                                courseId: session.metadata.courseId,
                                userId: session.metadata.userId,
                            },
                        });
                        await db.enrollees.create({
                            data: {
                                courseId: session.metadata.courseId,
                                userId: session.metadata.userId,
                            }
                        });
                    } else if (session.metadata && session.metadata.type === "lifetime") {
                        await db.stripeCustomer.update({
                            where: {
                                userId: session.metadata.userId,
                            },
                            data: {
                                status: "ACTIVE",
                                subscription: "LIFETIME"
                            }
                        });
                    }
                }
                break;
            case "customer.subscription.created":
                subscription = event.data.object as Stripe.Subscription;

                if (subscription.metadata.type === "basic") {
                    await db.stripeCustomer.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "ACTIVE",
                            subscription: "BASIC",
                        },
                    });
                } else if (subscription.metadata.type === "pro") {
                    await db.stripeCustomer.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "ACTIVE",
                            subscription: "PRO",
                        },
                    });
                }
                break;
            case "customer.subscription.updated":
                subscription = event.data.object;
                if (subscription.cancel_at_period_end) {
                    await db.stripeCustomer.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "CANCELLED",
                        },
                    })
                } else {
                    await db.stripeCustomer.update({
                        where: {
                            userId: subscription.metadata.userId,
                        },
                        data: {
                            status: "ACTIVE",
                        },
                    })
                }

                break;
            case "customer.subscription.deleted":
                subscription = event.data.object as Stripe.Subscription;

                await db.stripeCustomer.update({
                    where: {
                        userId: subscription.metadata.userId,
                    },
                    data: {
                        status: "INACTIVE",
                        subscription: null,
                        package: "",
                    },
                });
                break;
            case "customer.subscription.resumed":
                subscription = event.data.object as Stripe.Subscription;

                await db.stripeCustomer.update({
                    where: {
                        userId: subscription.metadata.userId,
                    },
                    data: {
                        status: "ACTIVE",
                        subscription: subscription.metadata.type.toString().toUpperCase() as SubscriptionType,
                    },
                });
                break;
            default:
                return new NextResponse(
                    `Webhook Error: Unhandled Event type ${event.type}`,
                    { status: 200 }
                );
        }
        return new NextResponse("Success", { status: 200 });
    } catch (error: any) {
        console.log(error);
        return new NextResponse("Failed", { status: 500 });
    }
}
