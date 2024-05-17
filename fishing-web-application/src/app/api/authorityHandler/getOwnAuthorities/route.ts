import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

type authority = {
  id: string;
  fisheryAuthorityName: string;
};

export async function GET(request: NextRequest) {
  const session = await auth();
  const emptyAuthorities: authority[] = [];

  const access = await db.access.findFirst({
    where: {
        user:{
            email: session?.user.email
        }
    }
})

  if (session) {
    try {
      if (
        session.user.role === "OPERATOR" ||
        (session.user.role === "INSPECTOR" && access?.accessToAuthority)
      ) {
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
            authorities: authorities,
            message: "The data has been successfully retrieved!",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        {
          authorities: emptyAuthorities,
          message: "Data retrieval failed: access denide!",
        },
        { status: 301 }
      );
    } catch (error) {
      return NextResponse.json(
        {
          authorities: emptyAuthorities,
          message: "The data has been successfully retrieved!",
        },
        { status: 200 }
      );
    }
  }

  return NextResponse.json(
    {
      authorities: emptyAuthorities,
      message: "Data retrieval failed: no valid session!",
    },
    { status: 301 }
  );
}
