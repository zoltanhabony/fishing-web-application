"use server";

import * as schemas from "@/helpers/schemas/validation-schema";
import db from "@/lib/db";
import { User, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import {redirect} from "next/navigation";
import CredentialRegistrationFormState from "@/helpers/interfaces/IRegistrationFormState";


function generalError(error: any):  CredentialRegistrationFormState {
  if (error instanceof Error) {
    return {
      errors: {
        _form: [error.message],
      },
    };
  } 
    return {
      errors: {
        _form: ["Something went wrong"]
      }
    }
}

export async function  credentialRegistration(
  formSate:  CredentialRegistrationFormState,
  formData: FormData
): Promise<CredentialRegistrationFormState> {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    accountType: formData.get("accountType")
  };

  const result = schemas.credentialRegistrationSchema.safeParse(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  let existingUserEmail: User | null;
  let existingUserName: User | null;

  try {
    existingUserName = await db.user.findUnique({
      where: {
        name: data.username!.toString(),
      },
    });

    existingUserEmail = await db.user.findUnique({
      where: {
        email: data.email!.toString(),
      },
    });
  } catch (error) {
    return generalError(error);
  }

  if (existingUserName && existingUserEmail) {
    return {
      errors: {
        username: ["Username already in use"],
        email: ["Email already in use"],
      },
    };
  } else if(existingUserName) {
    return{
      errors: {
        username: ["Username already in use"]
      }
    }
  }else if(existingUserEmail){
    return {
      errors: {
        email: ["Email already in use"],
      },
    };
  }

  let userRole: UserRole = UserRole.USER

  if(data.accountType?.toString() !== "user" && data.accountType?.toString() !== "operator"){
    return {
      errors: {
        accountType: ["Wrong account type"],
      },
    };
  }

  if(data.accountType?.toString() === "user"){
    userRole = UserRole.USER
  }

  if(data.accountType?.toString() === "operator"){
    userRole = UserRole.OPERATOR
  }
  
  const hashedPassword = await bcrypt.hash(data.password!.toString(), 10);

  try {
    const user = await db.user.create({
      data: {
        name: data.username as string,
        email: data.email as string,
        password: hashedPassword,
        role: userRole
      },
    });

    if(user.role === "USER") {
      await db.access.create({
        data:{
          userId: user.id,
          accessToLogbook: false,
          accessToAuthority: false,
          accessToFishing: false
        }
      })
    }

    
    if(user.role === "OPERATOR") {
      await db.access.create({
        data:{
          userId: user.id,
          accessToLogbook: false,
          accessToAuthority: true,
          accessToFishing: false
        }
      })
    }
  } catch (error) {
    return generalError(error);
  }
  redirect("/auth/login");
}
