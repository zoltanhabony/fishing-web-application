import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

type authority = {
    id: string,
    fisheryAuthorityName:  string,
}

export async function GET(request: NextRequest) {
  const session = await auth();
  const emptyAuthorities: authority[] = []
  if (session) {
    try {

        const authorities = await db.member.findMany({
            where: {
              user: {
                email: session?.user.email,
              },
            },
            select: {
              fisheryAuthority: {
                select: {
                  fisheryAuthorityName: true,
                  id: true,
                },
              },
            },
          });

      return NextResponse.json(
        {
            authorities: authorities, message: "The data has been successfully retrieved!" 
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          authorities: emptyAuthorities,
          message: "Az adatok lekérése sikeresen megtörtént!",
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    {
    authorities: emptyAuthorities,
      message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!",
    },
    { status: 301 }
  );
}
