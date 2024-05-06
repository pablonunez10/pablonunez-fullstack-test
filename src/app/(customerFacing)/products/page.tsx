import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Suspense } from "react";

const getProduct = cache(() => {
    return db.product.findMany({where : {isAvailableFourPurchase : true}, orderBy: {name: "asc"}})
}, ["/products", "getProduct"])

export default function ProductPage(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <Suspense fallback={
        <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
        </>
    }>
        <ProductSuspense/>
    </Suspense>
    
</div>
    )
}

async function ProductSuspense () {
    const products = await getProduct()
    return (
        products.map(product => (
            <ProductCard key={product.id}{...product} />
        ))
    )
}