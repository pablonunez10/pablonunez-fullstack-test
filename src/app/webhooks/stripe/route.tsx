import db from "@/db/db"
import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import PurchaseReceiptEmail from "@/email/PurchaseReceipt"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
// const resend = new Resend(process.env.RESEND_API_KEY as string)
const resend = new Resend('re_BY2fuAET_NKC88gzLzFZWUr5s7e87WA9K')
export async function POST(req: NextRequest) {
  // console.log('holis')
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  )
    // console.log('hola',event)
  if (event.type === "charge.succeeded") {
    const charge = event.data.object
    const productId = charge.metadata.productId
    const email = charge.billing_details.email
    const pricePaidInCents = charge.amount
    console.log('metadata', charge.metadata)
    // console.log(charge, productId, email, pricePaidInCents)
    let product = null;
    try {
      product = await db.product.findUnique({ where: { id: productId } })
      if (product == null || email == null) {
        return new NextResponse("Bad Request", { status: 400 })
      }
    } catch (error) {
      return new NextResponse("Server error", { status: 500 })
    }

    const userFields = {
      email,
      orders: { create: { productId, pricePaidInCents } },
    }
    const {
        orders: [order]
    } = await db.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt:"desc" }, take: 1 } },
    })
    console.log({order});
    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })
        await resend.emails.send({
          from: `Support <${process.env.SENDER_EMAIL}>`,
          to: email,
          subject: "Order Confirmation",
          react: (
            <PurchaseReceiptEmail
              order={order}
              product={product}
              downloadVerificationId={downloadVerification.id}
            />
          ),
        })
    }
    return  new NextResponse()

}