"use client"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTransition } from "react";
import { toggleProductAvailability } from "../../_actions/products";
import { deleteProduct } from "../../_actions/products";
import { useRouter } from "next/navigation";
export function ActiveToggleDropdownIem ({id, isAvailableFourPurchase} : {id: string, isAvailableFourPurchase: boolean}) {
    const [isPending, startTransition] =useTransition()
    const router = useRouter()
    return (
        <>
            <DropdownMenuItem disabled={isPending}onClick={() => {startTransition(async () => {
                await toggleProductAvailability(id, !isAvailableFourPurchase)
                router.refresh()
            })}}>
            {isAvailableFourPurchase ? "Desactive" : "Active"}
            </DropdownMenuItem>
        </>
    )
}

export function DeleteDropdownItem ({id, disabled}: {id:string, disabled:boolean}) {
    const [isPending, startTransition] =useTransition()
    const router = useRouter()
    return (
        <>
            <DropdownMenuItem 
                variant="destructive"
                disabled={disabled || isPending}
                onClick={() => {startTransition(async () => {
                    await deleteProduct(id)
                    router.refresh()
            })}}>
                Delete
            </DropdownMenuItem>
        </>
    )
}