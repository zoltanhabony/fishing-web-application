"use server";

import { auth } from "@/auth";
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

export async function deleteMarker (markerId:string, mapId:string) {
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

  const currentMap = await db.map.findFirst({
    where: {
      id: mapId,
    },
    select: {
      id: true,
      fisheryAuthorityId: true,
    },
  });

  if (!currentMap) {
    return {
      errors: {
        _form: ["The deletion failed!"],
        subtitle: "No map found",
        status: "error",
        description: "No map found with this identifier!",
      },
    };
  }

  

  const markerIsExists = await db.marker.findUnique({
    where: {
      id: markerId,
      map: {
        id: mapId
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
          _form: ["The deletion failed!"],
          subtitle: "The marker does not exist",
          status: "error",
          description:
            "The marker you are currently editing does not belong to any map!",
        },
      };
  }

  const isMember = await db.marker.findUnique({
    where:{
        id: markerId,
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
      id: markerId,
      map: {
        id: mapId,
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

  console.log(!isMember && !isOperator)

  try {
    
    await db.marker.delete({
        where:{
            id: markerId,
            map:{
                id: mapId
            }
        },
    });
    
    console.log("success")

    revalidatePath('/map/[id]', 'page')


    return {
      errors: {
        _form: ["The marker deleted successfully"],
        subtitle: "Successful deletion!",
        status: "success",
        description: "The marker successfully edited!",
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
