"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/catch-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { date } from "zod";

interface CreateFishingDateFormState {
  errors?: {
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function createFishingDate(
  formSate: CreateFishingDateFormState,
  formData: FormData
): Promise<CreateFishingDateFormState> {
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

  if (session.user.role !== "USER" && session.user.role !== "INSPECTOR") {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to create angling associations!",
      },
    };
  }

  const user = await db.user.findUnique({
    where: {
        email: session.user.email
    },
    select:{
        id: true,
        access: {
            select:{
                accessToLogbook: true
            }
        }
    }
  })

  if(!user?.access[0].accessToLogbook){
    return {
        errors: {
          _form: ["No entitlement to fishing!"],
          subtitle: "You do not have the appropriate rights!",
          status: "error",
          description: "You are not qualified to fish, contact the competent authority for more information!",
        },
      };
  }

  const haveFishingDate = await db.isFishing.findFirst({
    where:{
        userId: user.id
    }
  })


  try {

    if(haveFishingDate){
        await db.isFishing.update({
            where:{
                userId: user.id
            },
            data:{
                date: new Date()
            }
        })
        revalidatePath(`/catch/new`);
        return {
          errors: {
            _form: ["Start fishing successfully"],
            subtitle: "Good Luck!",
            status: "success",
            description: "You are start fishing successfully",
          },
        };
    }


    await db.isFishing.create({
        data:{
            userId: user.id,
            date: new Date()
        }
    })

    revalidatePath(`/catch/new`);

    return {
      errors: {
        _form: ["Start fishing successfully"],
        subtitle: "Good Luck!",
        status: "success",
        description: "You are start fishing successfully",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The fishing not started!",
        status: "error",
        description: error.message,
      },
    };
  }
}
