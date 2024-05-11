import waterAreas from "./waterAreas.json";
import postalCodes from "./postalCodes.json";
import fishes from "./fishes.json";
import unit from "./unit.json";
import markerType from "./markerType.json"
import { PrismaClient, UnitType, WaterAreaType } from "@prisma/client";

type area = {
  Víztérkód: string;
  "Vízterület neve": string;
  "Vízterület típusa": string;
};

type newArea = {
  waterAreaCode: string;
  waterAreaName: string;
  waterAreaType: WaterAreaType;
};

type postalCode = {
  Irányítószám: string;
  Település: string;
  Megye: string;
};

type newPostalCode = {
  postalCode: number;
  cityName: string;
  countyName: string;
};

type unitType = {
  unitType: string;
  unitName: string;
  unitAcronyms: string;
};

type newUnitType = {
  unitType: UnitType;
  unitName: string;
  unitAcronyms: string;
};

type markerType = {
  type: string,
  markerURL: string
}

type fish = {
  "Hal kódja": string;
  "Hal neve": string;
  "Kép elérés út": string;
  "Minimum Súly korlátozás": string;
  "Maximum Súly korlátozás": string;
  "Minimum Hossz korlátozás": string;
  "Maximum Hossz korlátozás": string;
  "Mennyiség korlázotás": string;
  "Tilalmi időszak kezdete": string;
  "Tilalmi időszak vége": string;
};

type newFish = {
  fishCode: number | undefined;
  fishName: string;
  fishImageURL: string;
};

type constraints = {
  "Súly korlátozás": string;
  "Hossz korlátozás": string;
  "Mennyiség korlázotás": string;
  "Tilalmi időszak kezdete": string;
  "Tilalmi időszak vége": string;
};

type newConstraints = {
  minWeightLimit: number | null;
  maxWeightLimit: number | null;
  minLengthLimit: number | null;
  maxLengthLimit: number | null;
  pieceLimit: number | null;
  banPeriodStart: Date | null;
  banPeriodEnd: Date | null;
};

const db = new PrismaClient();
let target: number;

export const seed = async () => {
  let newWaterArea: newArea[] = [];
  let newPostalCode: newPostalCode[] = [];
  let newFish: newFish[] = [];
  let newConstraints: newConstraints[] = [];
  let newUnit: newUnitType[] = [];
  let newMarkerType: markerType[] = []

  waterAreas.map((area: area) => {
    let waterAreaType;

    if (area["Vízterület típusa"] === "teljes vízterület") {
      waterAreaType = WaterAreaType.TOTAL_WATER_AREA;
    }
    if (area["Vízterület típusa"] === "folyóvíz") {
      waterAreaType = WaterAreaType.RIVER_WATER;
    } else {
      waterAreaType = WaterAreaType.STILL_WATER;
    }
    newWaterArea.push({
      waterAreaCode: area.Víztérkód,
      waterAreaName: area["Vízterület neve"],
      waterAreaType: waterAreaType,
    });
  });

  postalCodes.map((city: postalCode) => {
    target = Number(city.Irányítószám);
    newPostalCode.push({
      postalCode: Number(city.Irányítószám),
      cityName: city.Település,
      countyName: city.Megye,
    });
  });

  const currentYear = new Date().getFullYear();

  fishes.map((fish: fish) => {
    newFish.push({
      fishCode: Number(fish["Hal kódja"])
        ? Number(fish["Hal kódja"])
        : undefined,
      fishName: fish["Hal neve"],
      fishImageURL: fish["Kép elérés út"],
    });
    newConstraints.push({
      minWeightLimit:
        fish["Minimum Súly korlátozás"] !== "" ? Number(fish["Minimum Súly korlátozás"]) : null,
        maxWeightLimit:
          fish["Maximum Súly korlátozás"] !== "" ? Number(fish["Maximum Súly korlátozás"]) : null,
      minLengthLimit:
        fish["Minimum Hossz korlátozás"] !== ""
          ? Number(fish["Minimum Hossz korlátozás"])
          : null,
      maxLengthLimit:
          fish["Maximum Hossz korlátozás"] !== ""
            ? Number(fish["Maximum Hossz korlátozás"])
            : null,
      pieceLimit:
        fish["Mennyiség korlázotás"] !== ""
          ? Number(fish["Mennyiség korlázotás"])
          : null,
      banPeriodStart:
        fish["Tilalmi időszak kezdete"] !== ""
          ? new Date(currentYear + "-" + fish["Tilalmi időszak kezdete"])
          : null,
      banPeriodEnd:
        fish["Tilalmi időszak vége"] !== ""
          ? new Date(currentYear + "-" + fish["Tilalmi időszak vége"])
          : null,
    });
  });

  unit.map((unit: unitType) => {
    let type;
    switch (unit.unitType) {
      case "MASS":
        type = UnitType.MASS;
        break;
      case "LENGTH":
        type = UnitType.LENGTH;
        break;
      case "TEMPERATURE":
        type = UnitType.TEMPERATURE;
        break;
      case "PIECE":
        type = UnitType.PIECE;
        break;
      default:
        type = UnitType.MASS;
        break;
    }
    newUnit.push({
      unitType: type!,
      unitName: unit.unitName,
      unitAcronyms: unit.unitAcronyms,
    });
  });

  markerType.map(type => {
    newMarkerType.push({
      type: type.markerType,
      markerURL: type.markerURL,
    })
  })


  
  await db.waterArea.createMany({
    data: newWaterArea,
  });

  await db.city.createMany({
    data: newPostalCode,
  });

  await db.fish.createMany({
    data: newFish,
  });
  

  await db.constraint.createMany({
    data: newConstraints,
  });

  const allFish = await db.fish.findMany();

  const allConstraint = await db.constraint.findMany();

  const totalWaterArea = await db.waterArea.findFirst({
    where: {
      waterAreaCode: "00-0000-0-0",
    },
  });

  for (let i = 0; i < allFish.length; i++) {
    if (
      allFish[i] !== null &&
      allConstraint[i] !== null &&
      totalWaterArea !== null
    ) {
      await db.waterAreaRule.create({
        data: {
          fishId: allFish[i].id,
          constraintId: allConstraint[i].id,
          waterAreaId: totalWaterArea.id,
        },
      });
    }
  }

  await db.unit.createMany({
    data: newUnit,
  });

  await db.markerType.createMany({
    data: newMarkerType,
  })

};

seed()
  .catch((e) => {
    console.error(e);
    console.log(target);

    process.exit(1);
  })
  .finally(async () => {
    db.$disconnect();
  });
