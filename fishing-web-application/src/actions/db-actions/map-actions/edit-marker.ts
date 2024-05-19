"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/map-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface EditMarkerFormState {
  errors?: {
    mapId?: string[];
    markerId?: string[];
    lat?: string[];
    long?: string[];
    title?: string[];
    info?: string[];
    markerType?: string[];
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function editMarker(
  formSate: EditMarkerFormState,
  formData: FormData
): Promise<EditMarkerFormState> {
  const session = await auth();

  const data = {
    mapId: formData.get("mapId"),
    markerId: formData.get("markerId"),
    lat: Number(formData.get("lat")),
    long: Number(formData.get("long")),
    title: formData.get("title"),
    info: formData.get("info"),
    markerType: formData.get("markerType"),
  };

  const result = schemas.editMarkerSchema.safeParse(data);

  if (!result.success) {
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

  const currentMap = await db.map.findFirst({
    where: {
      id: result.data.mapId,
    },
    select: {
      id: true,
      fisheryAuthorityId: true,
    },
  });

  if (!currentMap) {
    return {
      errors: {
        _form: ["The creation failed!"],
        subtitle: "No map found",
        status: "error",
        description: "No map found with this identifier!",
      },
    };
  }

  

  const markerIsExists = await db.marker.findUnique({
    where: {
      id: result.data.markerId,
      map: {
        id: result.data.mapId
      }
    },
    select: {
        map:{
            select:{
                fisheryAuthority:true
            }
        }
    },
  });

  if(!markerIsExists){
    return {
        errors: {
          _form: ["The creation failed!"],
          subtitle: "The marker does not exist",
          status: "error",
          description:
            "The marker you are currently editing does not belong to any map!",
        },
      };
  }

  const isMember = await db.marker.findUnique({
    where:{
        id: result.data.markerId,
        member:{
            user:{
                email: session.user.email
            }
        }
    },
    select:{
        member:{
            select:{
                id:true
            }
            
        }
    }
})

const isOperator = await db.marker.findUnique({
    where: {
      id: result.data.markerId,
      map: {
        id: result.data.mapId,
        member:{
            user:{
                email: session.user.email
            }
        }
      }
    },
  });

  if(!isMember && !isOperator){
    return {
        errors: {
          _form: ["Authorization failed!"],
          subtitle: "You do not have permission to edit the marker",
          status: "error",
          description: "You do not have permission to edit the marker!",
        },
      };
  }

  if (result.data.lat < -90 || result.data.lat > 90) {
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

  if (result.data.long < -180 || result.data.long > 180) {
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

  try {
    revalidatePath(`/map`);

    await db.marker.update({
        where:{
            id: result.data.markerId,
            map:{
                id: result.data.mapId
            }
        },

      data: {
        lat: result.data.lat,
        long: result.data.long,
        title: result.data.title,
        info: result.data.info,
        markerTypeId: result.data.markerType,
      },
    });

    return {
      errors: {
        _form: ["The marker edited successfully"],
        subtitle: "Successful modification!",
        status: "success",
        description: "The marker successfully edited!",
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
