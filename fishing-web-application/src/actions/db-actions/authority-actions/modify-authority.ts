"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/authority-schema";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ModifyAuthorityFormState {
  errors?: {
    id?: string[];
    authorityName?: string[];
    waterAreaName?: string[];
    taxIdentifier?: string[];
    cityName?: string[];
    streetName?: string[];
    streetNumber?: string[];
    floor?: string[];
    door?: string[];
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function modifyAuthority(
  formSate: ModifyAuthorityFormState,
  formData: FormData
): Promise<ModifyAuthorityFormState> {
  const session = await auth();

  const data = {
    id: formData.get("id"),
    authorityName: formData.get("authorityName"),
    waterAreaName: formData.get("waterAreaName"),
    taxIdentifier: formData.get("taxIdentifier"),
    cityName: formData.get("cityName"),
    streetName: formData.get("streetName"),
    streetNumber: Number(formData.get("streetNumber")),
    floor: formData.get("floor") ? Number(formData.get("floor")) : null,
    door: formData.get("door") ? Number(formData.get("door")) : null,
  };

  const result = schemas.modifyAuthoritySchema.safeParse(data);

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

  if (session.user.role !== "OPERATOR" && session.user.role !== "INSPECTOR") {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to create angling associations!",
      },
    };
  }

  const authority = await db.fisheryAuthority.findUnique({
    where: {
      id: result.data.id,
    },
  });

  if (!authority) {
    return {
      errors: {
        _form: ["Failed to change association details!"],
        subtitle: "The association you want to modify does not exist",
        status: "error",
        description: "You want to modify a non-existing association!",
      },
    };
  }

  const existingAuthority = await db.fisheryAuthority.findFirst({
    where: {
      NOT: {
        id: result.data.id,
      },
      fisheryAuthorityName: result.data.authorityName,
    },
  });

  if (existingAuthority !== null) {
    return {
      errors: {
        authorityName: ["There is already an association by that name"],
        _form: ["The creation failed!"],
        subtitle: "Existing authority name",
        status: "error",
        description: "There is already an association by that name",
      },
    };
  }

  const waterArea = await db.waterArea.findFirst({
    where: {
      waterAreaName: data.waterAreaName?.toString(),
    },
  });

  if (waterArea === null) {
    return {
      errors: {
        waterAreaName: ["The water area does not exist"],
        _form: ["The creation failed!"],
        subtitle: "The water area does not exist!",
        status: "error",
        description: "The water area specified during creation does not exist",
      },
    };
  }

  const taxIdentifier = await db.fisheryAuthority.findFirst({
    where: {
      NOT: {
        id: result.data.id,
      },
      taxId: data.taxIdentifier?.toString(),
    },
  });

  if (taxIdentifier !== null) {
    return {
      errors: {
        taxIdentifier: [
          "There is already an association by that tax identifier",
        ],
        _form: ["The creation failed!"],
        subtitle: "Existing tax identifier!",
        status: "error",
        description: "There is already an association by that tax identifier",
      },
    };
  }

  const city = await db.city.findFirst({
    where: {
      cityName: data.cityName?.toString(),
    },
  });

  if (city === null) {
    return {
      errors: {
        cityName: ["The city does not exist"],
        _form: ["The creation failed!"],
        subtitle: "The city does not exist!",
        status: "error",
        description: "The city specified during creation does not exist",
      },
    };
  }

  const address = await db.address.findFirst({
    where: {
      NOT: {
        id: authority.addressId,
      },
      city: {
        cityName: data.cityName?.toString(),
      },
      streetName: data.streetName?.toString(),
      streetNumber: data.streetNumber,
      floor: data.floor,
      door: data.door,
    },
  });

  if (address !== null) {
    return {
      errors: {
        _form: ["The creation failed!"],
        subtitle: "Existing address!",
        status: "error",
        description: "There is already an association by that address",
      },
    };
  }

  try {
    await db.address.update({
      where: {
        id: authority.addressId,
      },
      data: {
        cityId: city.id,
        streetName: result.data.streetName,
        streetNumber: result.data.streetNumber,
        floor: result.data.floor,
        door: result.data.door,
      },
    });
    await db.fisheryAuthority.update({
      where: {
        id: result.data.id,
      },
      data: {
        fisheryAuthorityName: result.data.authorityName,
        taxId: result.data.taxIdentifier,
        waterAreaId: waterArea.id,
      },
    });

    revalidatePath(`/authority/${result.data.id}/edit`)
    revalidatePath(`/authority`)
    return {
      errors: {
        _form: ["The authority modified successfully"],
        subtitle: "Successfull modification!",
        status: "success",
        description: "The authority modified successfully",
      },
    };
  } catch (error: any) {
    return {
      errors: {
        _form: ["Something went wrong!"],
        subtitle: "The modification failed!",
        status: "error",
        description: error.message,
      },
    };
  }
}
