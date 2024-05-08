"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/map-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CreateMarkerFormState {
  errors?: {
    mapId?: string[];
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

export async function createMarker(
  formSate: CreateMarkerFormState,
  formData: FormData
): Promise<CreateMarkerFormState> {
  const session = await auth();

  const data = {
    mapId: formData.get("mapId"),
    lat: Number(formData.get("lat")),
    long: Number(formData.get("long")),
    title: formData.get("title"),
    info: formData.get("info"),
    markerType: formData.get("markerType"),
  };

  const result = schemas.createMarkerSchema.safeParse(data);

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

  const authority = await db.map.findUnique({
    where: {
      id: result.data.mapId,
    },
    select: {
      fisheryAuthorityId: true,
    },
  });

  const member = await db.member.findFirst({
    where: {
      user:{
        email:session.user.email
      }
    },
  });

  console.log(member)

  if (!member) {
    return {
      errors: {
        _form: ["The creation failed!"],
        subtitle: "You are not a member of an association",
        status: "error",
        description:
          "You cannot make a mark on the map because you are not a member of an association!",
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

    await db.marker.create({
      data: {
        mapId: currentMap.id,
        lat: result.data.lat,
        long: result.data.long,
        memberId: member.id,
        title: result.data.title,
        info: result.data.info,
        markerTypeId: result.data.markerType,
      },
    });

    return {
      errors: {
        _form: ["The marker created successfully"],
        subtitle: "Successful creation!",
        status: "success",
        description: "The marker successfully",
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
