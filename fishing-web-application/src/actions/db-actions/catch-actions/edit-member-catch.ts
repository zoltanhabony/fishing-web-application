"use server";

import { auth } from "@/auth";
import * as schemas from "@/helpers/schemas/catch-schema";
import db from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface EditCatchFormState {
  errors?: {
    userId?:string[],
    catchId?:string[],
    pieceId?:string[],
    weightId?:string[],
    lengthId?:string[],
    waterAreaName?: string[]
    fishId?: string[]
    isInjured?: string[]
    isStored?: string[]
    weight?: string[]
    weightUnit?: string[]
    piece?: string[]
    pieceUnit?: string[]
    length?: string[]
    lengthUnit?: string[]
    _form?: string[];
    subtitle?: string;
    status?: string;
    description?: string;
  };
}

export async function editMemberCatch(
  formSate: EditCatchFormState,
  formData: FormData
): Promise<EditCatchFormState> {
  const session = await auth();

  const data = {
    userId: formData.get("userId"),
    catchId: formData.get("catchId"),
    pieceId: formData.get("pieceId"),
    weightId: formData.get("weightId"),
    lengthId: formData.get("lengthId"),
    waterAreaName: formData.get("waterAreaName"),
    fishId: formData.get("fishId"),
    isInjured: Boolean(formData.get("isInjured")),
    weight: Number(formData.get("weight")),
    weightUnit: formData.get("weightUnit"),
    piece: Number(formData.get("piece")),
    pieceUnit: formData.get("pieceUnit"),
    length: Number(formData.get("length")),
    lengthUnit: formData.get("lengthUnit"),
    isStored: Boolean(formData.get("isStored")),
  };

  //Result and Session
  const result = schemas.editCatchSchema.safeParse(data);

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

  if (session.user.role !== UserRole.OPERATOR && session.user.role !== UserRole.INSPECTOR) {
    return {
      errors: {
        _form: ["Authorization failed!"],
        subtitle: "No access to perform the operation",
        status: "error",
        description: "You do not have access to create angling associations!",
      },
    };
  }


  //Current user Logbook
  const logbook = await db.user.findUnique({
    where: {
      id: result.data.userId
    },select:{
      member:{
        select:{
          logbookId:true
        }
      }
    }
  })

  if(!logbook?.member[0].logbookId){
    return {
      errors: {
        _form: ["Unsuccessful data saving!"],
        subtitle: "The user do not have a catch logbook!",
        status: "error",
        description: "The user do not have a catch logbook!",
      },
    };
  }


  //Units and Measures
  if(result.data.weight === 0 && result.data.piece === 0) {
    return {
      errors: {
        weight: ["The fish size or number of fish must be given!"],
        _form: ["Unsuccessful data saving!"],
        subtitle: "The size or the number of pieces is not correct",
        status: "error",
        description: "The fish size or number of fish must be given!",
      },
    };
  }


  //Check Water area
  const waterArea = await db.waterArea.findFirst({
    where:{
      waterAreaName: result.data.waterAreaName
    }
  })

  if(!waterArea) {
    return {
      errors: {
        waterAreaName: ["The selected water area does not exist!"],
      },
    };
  }

  //Check fish type
  const fish = await db.fish.findFirst({
    where: {
      id: result.data.fishId
    }
  })

  if(!fish) {
    return {
      errors: {
        fishId: ["The selected fish does not exist!"],
      },
    };
  }


  //Chenck water area rule
  let rule = await db.waterAreaRule.findFirst({
    where:{
      waterAreaId: waterArea.id,
      fishId:fish.id
    }
  })


  if(!rule){
    const globalArea = await db.waterArea.findFirst({
      where:{
        waterAreaName: "Teljes vízterület"
      }
    })
    rule = await db.waterAreaRule.findFirst({
      where:{
        waterAreaId: globalArea?.id,
        fishId:fish.id
      }
    })
  }

  if(rule){
    const constraint = await db.constraint.findUnique({
      where:{
        id: rule.constraintId
      }
    })

    const piceOfFishType = await db.catch.aggregate({
      where:{
        fishId: fish.id,
        waterArea:{
          waterAreaName: waterArea.waterAreaName
        }
      },
      _count:{
        id: true
      }
    })
  
  
      const currentDate = new Date()
  
      if(constraint && constraint.banPeriodStart && constraint.banPeriodEnd){
        if(currentDate >= constraint.banPeriodStart && currentDate <= constraint.banPeriodEnd){
  
          if(!constraint.maxLengthLimit && !constraint.minLengthLimit && !constraint.maxWeightLimit && !constraint.minWeightLimit && !constraint.pieceLimit)
            {
              return {
                errors: {
                  fishId: ["The fish is currently under a closed season!"],
                  _form: ["Unsuccessful data saving!"],
                  subtitle: "The fish is currently under a closed season!",
                  status: "error",
                  description: "The fish is currently under a closed season in the specified water area or under a national water order, the fish cannot be taken home but can be recorded!",
                },
              };
            }
  
          if(constraint.minLengthLimit && Number(constraint.minLengthLimit) > result.data.length){
            return {
              errors: {
                fishId: ["The fish is currently under a closed season!"],
                _form: ["Unsuccessful data saving!"],
                subtitle: "The fish length is too small!",
                status: "error",
                description: "The fish is currently under a closed season in the specified water area or under a national water order, the fish cannot be taken home but can be recorded!",
              },
            };
          }
  
          if(constraint.maxLengthLimit && Number(constraint.maxLengthLimit) < result.data.length){
            return {
              errors: {
                fishId: ["The fish is currently under a closed season!"],
                _form: ["Unsuccessful data saving!"],
                subtitle: "The fish length is too long!",
                status: "error",
                description: "The fish is currently under a closed season in the specified water area or under a national water order, the fish cannot be taken home but can be recorded!",
              },
            };
          }
  
          if(constraint.minWeightLimit && Number(constraint.minWeightLimit) > result.data.weight){
            return {
              errors: {
                fishId: ["The fish is currently under a closed season!"],
                _form: ["Unsuccessful data saving!"],
                subtitle: "The fish weight is too light!",
                status: "error",
                description: "The fish is currently under a closed season in the specified water area or under a national water order, the fish cannot be taken home but can be recorded!",
              },
            };
          }
  
          if(constraint.maxWeightLimit && Number(constraint.maxWeightLimit) < result.data.weight){
            return {
              errors: {
                fishId: ["The fish is currently under a closed season!"],
                _form: ["Unsuccessful data saving!"],
                subtitle: "The fish weight is too heavy!",
                status: "error",
                description: "The fish is currently under a closed season in the specified water area or under a national water order, the fish cannot be taken home but can be recorded!",
              },
            };
          }
  
          if(constraint.pieceLimit && constraint.pieceLimit < result.data.piece + piceOfFishType._count.id){
            return {
              errors: {
                fishId: ["The fish is currently under a closed season!"],
                _form: ["Unsuccessful data saving!"],
                subtitle: "You have reached the maximum number of fish that can be caught!",
                status: "error",
                description: "The fish is currently under a closed season in the specified water area or under a national water order, the fish cannot be taken home but can be recorded!",
              },
            };
          }
        }
      }
    }

  //Check unit type

  const weightUnitId = await db.unit.findUnique({
    where: {
      id: result.data.weightUnit
    }
  })

  const defaultWeightUnit = await db.unit.findFirst({
    where:{
      unitAcronyms:"kg"
    }
  })

  const lengthUnitId = await db.unit.findUnique({
    where: {
      id: result.data.lengthUnit
    }
  })

  const defaultLengthUnit = await db.unit.findFirst({
    where:{
      unitAcronyms:"cm"
    }
  })

  const pieceUnitId = await db.unit.findUnique({
    where: {
      id: result.data.pieceUnit
    }
  })

  const defaultPieceUnit = await db.unit.findFirst({
    where:{
      unitAcronyms:"db"
    }
  })


  if(result.data.weightUnit && !weightUnitId){
    return {
      errors: {
        weightUnit: ["The specified unit of measurement does not exist!"],
        _form: ["Unsuccessful data saving!"],
        subtitle: "The specified unit of measurement does not exist!",
        status: "error",
        description: "The specified unit of measurement does not exist!",
      },
    }
  }

  if(result.data.lengthUnit && !lengthUnitId){
    return {
      errors: {
        lengthUnit: ["The specified unit of measurement does not exist!"],
        _form: ["Unsuccessful data saving!"],
        subtitle: "The specified unit of measurement does not exist!",
        status: "error",
        description: "The specified unit of measurement does not exist!",
      },
    }
  }

  if(result.data.pieceUnit && !pieceUnitId){
    return {
      errors: {
        pieceUnit: ["The specified unit of measurement does not exist!"],
        _form: ["Unsuccessful data saving!"],
        subtitle: "The specified unit of measurement does not exist!",
        status: "error",
        description: "The specified unit of measurement does not exist!",
      },
    }
  }

  try {
    revalidatePath(`/catch`);

    const catchedFish = await db.catch.update({
        where:{
            id: result.data.catchId
        },
      data:{
        waterAreaId: waterArea.id,
        fishId: fish.id,
        isInjured: result.data.isInjured,
        isStored: result.data.isStored,
        logbookId: logbook.member[0].logbookId
      }
    })

    await db.catchDetails.update({
        where:{
            id: result.data.weightId
        },
      data:{
        value: result.data.weight,
        unitId: weightUnitId ? weightUnitId.id: defaultWeightUnit!.id,
        detailId: catchedFish.detailId
      }
    })

    await db.catchDetails.update({
        where:{
            id: result.data.lengthId
        },
      data:{
        value: result.data.length,
        unitId: lengthUnitId ? lengthUnitId.id : defaultLengthUnit!.id,
        detailId: catchedFish.detailId
      }
    })

    await db.catchDetails.update({
        where:{
            id: result.data.pieceId,
        },
      data:{
        value: result.data.piece,
        unitId: pieceUnitId ? pieceUnitId.id : defaultPieceUnit!.id,
        detailId: catchedFish.detailId
      }
    })

    return {
      errors: {
        _form: ["Successful data saving"],
        subtitle: "Successfull saving!",
        status: "success",
        description: "The fish saved successfully! You can view the saved fish at catches.",
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
