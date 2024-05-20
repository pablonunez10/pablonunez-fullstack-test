import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { formatCurrency } from "@/lib/formatlers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export default async function SuccessPage({searchParams} : {searchParams : {payment_intent: string}}) {
    const paymentIntent = await stripe.paymentIntents.retrieve(searchParams.payment_intent)
    let product = null;
    try {
        product = await db.product.findUnique({where : {id : paymentIntent.metadata.productId}})
    } catch (error) {
        console.log("Error finding product with prisma", error);
    }
    
    if(product == null) return notFound()
    const isSuccess = paymentIntent.status === "succeeded"
    return (
        <>
            <h1 className="text-4xl font-bold">{isSuccess ? "Success!" : "Error"}</h1>
            <div className="max-w-full mx-auto space-y-8">
                <div className="flex gap-4 items-center">
                    <div className="aspect-video flex-shrink-0 w-1/3 relative">
                        <Image src={product.imagePath} fill alt={product.name} className="object-cover mt-auto" />
                    </div>
                    <div>
                        <div className="text-lg">
                            {formatCurrency(product.priceInCents/100)}
                        </div>
                        <h1 className="text-xl font-bold">{product.name}</h1>
                        <div className="line-clamp-3 text-muted-foreground">{product.description}</div>
                    </div>
                    <Button className="mt-4" size="lg" asChild>
                        {isSuccess ? (
                            <a href={`/products/download/${ await createDownloadVerification(product.id)}`}>
                                Download
                            </a>
                        ) : (
                            <Link href={`/products/${product.id}/purchase`}>
                                Try Again
                            </Link>
                        )} 
                    </Button>
                </div>
            </div>
        </>
    )
}

async function createDownloadVerification(productId: string) {
    return (
        await db.downloadVerification.create({data : {productId, expiresAt: new Date(Date.now() + 1000 * 60 *24)}})
    )
}