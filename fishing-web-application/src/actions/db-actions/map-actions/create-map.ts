"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/map-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateMapFormState {
  errors?: {
    fisheryAuthorityName?: string[];
    lat?: string[],
    long?: string[],
    zoom?: string[],
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function createMap(
  formSate:  CreateMapFormState ,
  formData: FormData
): Promise< CreateMapFormState> {
  const session = await auth();

  const data = {
    fisheryAuthorityName: formData.get("fisheryAuthorityName"),
    lat: Number(formData.get("lat")),
    long: Number(formData.get("long")),
    zoom: Number(formData.get("zoom"))
  };

  const result = schemas.createMapSchema.safeParse(data);

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
        fisheryAuthorityName: result.data.fisheryAuthorityName
    }
  })

  if(!currentAuthority){
    return {
        errors: {
          fisheryAuthorityName: ["No association found in the given name!"],
          _form: ["The creation failed!"],
          subtitle: "No association found",
          status: "error",
          description: "No association found in the given name!",
        },
      };
  }

  const map = await db.map.findUnique({
    where: {
        fisheryAuthorityId: currentAuthority.id
    }
  })

  if(map){
    return {
        errors: {
          fisheryAuthorityName: ["Map already belongs to the specified association!"],
          _form: ["The creation failed!"],
          subtitle: "Map already exist",
          status: "error",
          description: "Map already belongs to the specified association!",
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
          _form: ["The creation failed!"],
          subtitle: "The user is not a member",
          status: "error",
          description: "The user is not a member of any association!",
        },
      };
  }

  //Memberships between authority (Where)
  const memberships = await db.member.findMany({
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


  const isMember = memberships.find((f)=>{
    return f.fisheryAuthority.fisheryAuthorityName === result.data.fisheryAuthorityName
  })

  if(!isMember){
    return {
        errors: {
          fisheryAuthorityName: ["You are not the operator of this association!"],
          _form: ["The creation failed!"],
          subtitle: "No access to perform the operation",
          status: "error",
          description: "You can only create a map for your own associations!",
        },
      };
  }

  if(result.data.lat < -90 || result.data.lat > 90){
    return {
        errors: {
          lat: ["Wrong value!"],
          _form: ["The creation failed!"],
          subtitle: "Error in entering the lattitude",
          status: "error",
          description: "The latitudes should be between -90 and 90!",
        },
      };
  }

  if(result.data.long < -180 || result.data.long > 180){
    return {
        errors: {
          long: ["Wrong value!"],
          _form: ["The creation failed!"],
          subtitle: "Error in entering the longitude",
          status: "error",
          description: "The longitude should be between -90 and 90!",
        },
      };
  }

  if(result.data.zoom < 7 || result.data.zoom > 18){
    return {
        errors: {
          zoom: ["Wrong value!"],
          _form: ["The creation failed!"],
          subtitle: "Error in entering the zoom",
          status: "error",
          description: "The zoom value should be between 7 and 18!",
        },
      };
  }

  try {
    revalidatePath(`/map`);

    await db.map.create({
        data:{
            fisheryAuthorityId: currentAuthority.id,
            lat: result.data.lat,
            long: result.data.long,
            zoom: result.data.zoom,
            memberId: member.id
        }
    })

    return {
      errors: {
        _form: ["The map created successfully"],
        subtitle: "Successfull creation!",
        status: "success",
        description: "The map created successfully",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The creation failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
