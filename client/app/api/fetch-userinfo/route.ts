import { NextRequest, NextResponse } from "next/server";
import { Address } from "viem";

export async function POST(req: NextRequest) {
    try {
        // Extract the addresses array from the request body
        const { addresses } = (await req.json()) as { addresses: Address[] };

        if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
            return NextResponse.json({ error: "Addresses must be a non-empty array" }, { status: 400 });
        }

        const response = await fetch(`https://usernames.worldcoin.org/api/v1/query`, {
            method: "POST",
            headers: {
                'Authorization': `Apikey ${process.env.DEV_PORTAL_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ addresses }) 
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to fetch data" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ result: data }, { status: 200 });

    } catch (error) {
        console.error("Error occurred:", error);
        return NextResponse.json({ error: "An internal server error occurred" }, { status: 500 });
    }
}
