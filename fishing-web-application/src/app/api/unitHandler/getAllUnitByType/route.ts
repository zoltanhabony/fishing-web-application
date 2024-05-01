import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { UnitType } from "@prisma/client";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (session) {
    const type = request.nextUrl.searchParams.get("type");
    console.log(type)
    try {
      const units = await db.unit.findMany({
        where: {
          unitType: type as UnitType,
        },
        select: {
          id: true,
          unitName: true,
          unitAcronyms: true,
        },
      });

      return NextResponse.json(
        { units: units, message: "Az adatok lekérése sikeresen megtörtént!" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { units: [], message: "Az adatok lekérése sikeresen megtörtént!" },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    { message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!" },
    { status: 301 }
  );
}
