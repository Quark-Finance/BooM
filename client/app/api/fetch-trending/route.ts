import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=10&tsym=USD`,
      {
        method: "GET",
        headers: {
          Authorization: `Apikey ${process.env.CRYPTOCOMPARE_API_KEY}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return NextResponse.json({ data: result.Data }, { status: 200 });
  } catch (e) {
    console.error(`Error while fetching coin data, ${e}`);
    return NextResponse.json({ ERROR: "Error fetching API" }, { status: 500 });
  }
}
