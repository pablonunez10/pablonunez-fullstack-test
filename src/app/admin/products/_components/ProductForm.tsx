"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { formatCurrency } from "@/lib/formatlers"
import { Label } from "@radix-ui/react-label"
import { useState } from "react"

export  default function ProductForm () {
    const [priceInCents, setPriceInCents] = useState<number>()
    return(
        <>
            <form className="space-y-8">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" name="name" required/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priceInCents">Price In Cents</Label>
                    <Input type="number" id="priceInCents" name="priceInCents" required value={priceInCents} onChange={e => setPriceInCents(Number(e.target.value) || undefined)}/>
                    <div className="text-muted-foreground">{formatCurrency((priceInCents || 0) / 100)}</div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea  id="description" name="description" required/>
                </div>
            </form>
        </>
    )
}