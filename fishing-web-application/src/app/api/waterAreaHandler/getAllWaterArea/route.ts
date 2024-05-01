import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";

type Area = {
  id: string;
  waterAreaName: string;
};

export async function GET(request: NextRequest) {
  const session = await auth();
  if (session) {
    const name = request.nextUrl.searchParams.get("name");
    let waterArea: Area[] = [];

    if (name === "" || name === null) {
      return NextResponse.json(
        {
          areas: waterArea,
          message: "Az adatok lekérése sikeresen megtörtént!",
        },
        { status: 200 }
      );
    }

    waterArea = await db.waterArea.findMany({
      where: {
        waterAreaName: {
          contains: name,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        waterAreaName: true,
      },
    });

    return NextResponse.json(
      { areas: waterArea, message: "Az adatok lekérése sikeresen megtörtént!" },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!" },
    { status: 301 }
  );
}
