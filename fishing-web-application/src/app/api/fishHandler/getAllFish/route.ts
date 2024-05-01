import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";

type city = {
  id: string;
  cityName: string;
};

export async function GET(request: NextRequest) {
  const session = await auth();
  if (session) {

    const fishes = await db.fish.findMany({
        select:{
            id:true,
            fishName:true,
        }
    })

    return NextResponse.json(
      { fishes: fishes, message: "Az adatok lekérése sikeresen megtörtént!" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!" },
    { status: 301 }
  );
}
