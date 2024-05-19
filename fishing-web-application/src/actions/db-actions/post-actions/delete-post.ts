"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/post-schemas";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreatePostFormState {
  errors?: {
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "There is no valid session",
        status: "error",
        description: "There is no valid session! Sign in again! ",
      },
    };
  }

  const post = await db.post.findUnique({
    where: {
      id: id,
    },
  });

  if (!post) {
    return {
      errors: {
        _form: ["Post not found!"],
        subtitle: "Not found",
        status: "error",
        description: "The post you want to delete cannot be found!",
      },
    };
  }

  const member = await db.member.findFirst({
    where: {
      user: {
        email: session.user.email,
        role: session.user.role
      },
      fisheryAuthorityId: post.fisheryAuthorityId,
    },
  });

  if (!member) {
    return {
      errors: {
        _form: ["The deletion failed!"],
        subtitle: "You are not a member",
        status: "error",
        description: "You are not a member of any association!",
      },
    };
  }

  if (session.user.role !== "OPERATOR" && post.memberId !== member.id) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to delete post!",
      },
    };
  }

  try {
    await db.post.delete({
      where:{
        id:post.id
      }
      });
    revalidatePath(`/post`);
    return {
      errors: {
        _form: ["The post deleted successfully"],
        subtitle: "Successfull deletion!",
        status: "success",
        description: "The post deleted successfully",
      },
    };
    
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The deletion failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
