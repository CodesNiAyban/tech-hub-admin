import db from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { pricingId: string } }
) {
  try {
    const { sessionClaims } = auth();

    if (sessionClaims?.metadata.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { price } = await req.json();

    const priceToDelete = await db.subscriptionPrices.findUnique({
      where: {
        id: params.pricingId,
      },
    });

    if (!priceToDelete) {
      return new NextResponse("Initial price not found", { status: 404 });
    }

    // Create the new price
    let newPrice;
    if (priceToDelete.recurring === "month") {
      newPrice = await stripe.prices.create({
        currency: priceToDelete.currency,
        unit_amount: price * 100, // Ensure the amount is in cents
        recurring: {
          interval: "month",
        },
        product: priceToDelete.stripeProductId,
      });
    } else {
      newPrice = await stripe.prices.create({
        currency: priceToDelete.currency,
        unit_amount: price * 100, // Ensure the amount is in cents
        product: priceToDelete.stripeProductId,
      });
    }

    if (!newPrice) {
      return new NextResponse("Failed to create new price", { status: 404 });
    }

    // Update the product to use the new price as the default
    const updateProduct = await stripe.products.update(priceToDelete.stripeProductId!, {
      default_price: newPrice.id,
    });

    if (!updateProduct) {
      return new NextResponse("Failed to update product with new price", { status: 404 });
    }

    // Now disable the old price
    const disablePrice = await stripe.prices.update(priceToDelete.stripePriceId!, {
      active: false,
    });

    if (!disablePrice) {
      return new NextResponse("Initial price not disabled", { status: 404 });
    }

    const updatedPrice = await db.subscriptionPrices.update({
      where: {
        id: params.pricingId,
      },
      data: {
        price: price,
        stripePriceId: newPrice.id,
      },
    });

    return NextResponse.json(updatedPrice);
  } catch (error) {
    console.log("[COURSES]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
