"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/post-schemas";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreatePostFormState {
  errors?: {
    id?:string[]
    authority?: string[];
    mainTitle?: string[],
    summary?: string[],
    content?: string[],
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function editPost(
  formSate:  CreatePostFormState ,
  formData: FormData
): Promise<CreatePostFormState> {
  const session = await auth();

  const data = {    
    id: formData.get("id"),
    authority: formData.get("authority"),
    mainTitle: formData.get("mainTitle"),
    summary: formData.get("summary"),
    content: formData.get("content")
  };

  const result = schemas.editPostSchema.safeParse(data);

  if (!result.success) {
    console.log(result.error);
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }


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

  if (session.user.role !== "OPERATOR") {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to create map!",
      },
    };
  }

  const currentAuthority = await db.fisheryAuthority.findFirst({
    where:{
        fisheryAuthorityName: result.data.authority
    }
  })

  const post = await db.post.findUnique({
    where:{
        id: result.data.id
    }
  })

  if(!post){
    return {
        errors: {
            _form: ["The post does not exist"],
            subtitle: "The post you wish to edit does not exist!",
            status: "error",
            description: "The post you wish to edit does not exist!",
          },
    }
  }

  console.log(currentAuthority)

  if(!currentAuthority){
    return {
        errors: {
          authority: ["No association found in the given name!"],
          _form: ["The creation failed!"],
          subtitle: "No association found",
          status: "error",
          description: "No association found in the given name!",
        },
      };
  }

  const member = await db.member.findFirst({
    where: {
        user:{
            email: session.user.email
        },
        fisheryAuthorityId:currentAuthority.id
    }
  })

  if(!member){
    return {
        errors: {
          _form: ["The editing failed!"],
          subtitle: "The user is not a member",
          status: "error",
          description: "The user is not a member of any association!",
        },
      };
  }

  const accessToEdit = db.post.findUnique({
    where:{
        id: post.id,
        memberId: member.id
    }
  })

  if(!accessToEdit){
    return {
        errors: {
            _form: ["Authorization failed!"],
            subtitle: "No access to perform the operation",
            status: "error",
            description: "This post does not belong to you, you can only edit your own post",
          },
    }
  }

  const memberships = await db.member.findMany({
    where: {
      user: {
        email: session?.user.email,
        role: "OPERATOR"
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


  const isMember = memberships.find((f)=>{
    return f.fisheryAuthority.fisheryAuthorityName === result.data.authority
  })

  if(!isMember){
    return {
        errors: {
          authority: ["You are not the operator of this association!"],
          _form: ["The creation failed!"],
          subtitle: "No access to perform the operation",
          status: "error",
          description: "You can only create a post for your own associations!",
        },
      };
  }

  try {
    revalidatePath(`/post`);

    await db.post.update({
        where:{
            id: post.id
        },
        data:{
            mainTitle: result.data.mainTitle,
            summary: result.data.summary,
            content: result.data.content,
            fisheryAuthorityId: currentAuthority.id
        }
    })

    return {
      errors: {
        _form: ["The post edited successfully"],
        subtitle: "Successfull editing!",
        status: "success",
        description: "The post edited successfully",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The editing failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
