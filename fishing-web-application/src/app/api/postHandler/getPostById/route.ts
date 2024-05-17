import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";

type post = {
  content: string;
} | null;

export async function GET(request: NextRequest) {
  const session = await auth();
  const emptyPost = {};

  if (session) {
    const id = request.nextUrl.searchParams.get("id");

    try {
      const post = await db.post.findUnique({
        where: {
          id: String(id),
        },
        select: {
          id: true,
          content: true,
          mainTitle: true,
          summary: true,
          fisheryAuthority: {
            select: {
              fisheryAuthorityName: true,
            },
          },
          member: {
            select: {
              user: {
                select: {
                  name: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!post) {
        return NextResponse.json(
          { post: emptyPost, message: "Az adatok lekérése sikertelen!" },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { post: post, message: "Az adatok lekérése sikeresen megtörtént!" },
        { status: 200 }
      );
    } catch (e) {}
  }

  return NextResponse.json(
    {
      post: emptyPost,
      message: "Az adatok lekérése sikertelen: Nincs érvényes munkamenet!",
    },
    { status: 301 }
  );
}
