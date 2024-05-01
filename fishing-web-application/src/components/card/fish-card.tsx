import { BaitIcon } from "@/icons/bait-icon";
import { LengthIcon } from "@/icons/length-icon";
import { WeightIcon } from "@/icons/weight-icon";
import { Card, CardBody } from "@nextui-org/react";

interface FishCardProps {
  fishName: string;
  fishImageUrl: string;
  date?: string;
  waterAreaName?: string;
  weightData?: string;
  lengthData?: string;
  bait?: string;
}
export const FishAvatar = ({
  fishName,
  fishImageUrl,
  date,
  waterAreaName,
  weightData,
  lengthData,
  bait,
}:FishCardProps) => {
  return (
    <Card className=" text-gray-500 flex items-center justify-center ">
      <CardBody>
        <div className="flex justify-center items-center">
          <img src={fishImageUrl} alt={fishName} />
        </div>
      </CardBody>
    </Card>
  );
};

