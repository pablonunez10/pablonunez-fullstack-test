import { PageHeader } from "../_components/PageHeader"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatlers"
import { DropdownMenu, DropdownMenuSeparator, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react"
import Link from "next/link"
import { ActiveToggleDropdownIem, DeleteDropdownItem } from "./_components/ProductAction"
export default function AdminProductPage() {
    return (
        <>
            <div className="flex justify-between items-center gap-4">
                <PageHeader>Products</PageHeader>
                <Button asChild>
                    <Link href="/admin/products/new">Add Product</Link>
                </Button>
            </div>
            <ProductsTable/>
        </>
    )
}

async function ProductsTable() {
    const products = await db.product.findMany({
        select:{
            id: true, 
            name: true, 
            priceInCents:true, 
            isAvailableFourPurchase:true, 
            _count:{select: {orders: true}}
        },
        orderBy: {name: "asc"}
    })
    if(products.length === 0) {
        return (
            <p>No Product Found</p>
        )
    }
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-0">
                        <span className="sr-only">
                            Available Four Purchase
                        </span>
                    </TableHead>  
                    <TableHead>Name</TableHead>  
                    <TableHead>Price</TableHead>  
                    <TableHead>Orders</TableHead>  
                    <TableHead className="w-0">
                        <span className="sr-only">
                            Actions 
                        </span>
                    </TableHead> 
                </TableRow>    
            </TableHeader>     
            <TableBody>
                {products.map(product => (
                    <TableRow key={product.id}>
                        <TableCell>
                            {product.isAvailableFourPurchase ? ( 
                                <>
                                    <CheckCircle2 />
                                    <span className="sr-only">Available</span>
                                </> 
                            ) : (
                                <>
                                    <span className="sr-only">Unavailable</span>
                                    <XCircle className="stroke-destructive"/>
                                </>
                            )}
                        </TableCell>
                        <TableCell>
                            {product.name}
                        </TableCell>
                        <TableCell>
                            {formatCurrency(product.priceInCents / 100)}
                        </TableCell>
                        <TableCell>
                            {formatNumber(product._count.orders)}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreVertical/>
                                    <span className="sr-only">Actions</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <a download href={`/admin/products/${product.id}/download`}>
                                            Dowland
                                        </a>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/admin/products/${product.id}/edit`}>
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <ActiveToggleDropdownIem id={product.id} isAvailableFourPurchase={product.isAvailableFourPurchase}/>
                                    <DropdownMenuSeparator />
                                    <DeleteDropdownItem id={product.id} disabled={product._count.orders > 0} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>   
        </Table>
    )
}