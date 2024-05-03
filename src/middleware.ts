import { NextRequest, NextResponse, userAgent } from "next/server";
import { isValidPassword } from "./lib/isValidPassword";

export async function middleware( req:NextRequest) {
   if((await isAuthenticated(req)) === false){
    return new NextResponse("Unauthorized", {status:401, headers: {"www-Authenticate" : "Basic"}})
   } 
}
async function isAuthenticated(req:NextRequest) {
    const autHeader = req.headers.get("authorization") || req.headers.get("Authorization")
    if(autHeader == null) return false
    const [username, password] = Buffer.from(autHeader.split(" ")[1], "base64").
    toString().split(":")
    return username === process.env.ADMIN_USERNAME && (await isValidPassword(password, process.env.HASHED_ADMIN_PASSWORD as string))

} 

export const config = {
    matcher: "/admin/:path*"
}