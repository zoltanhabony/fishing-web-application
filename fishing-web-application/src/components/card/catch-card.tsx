import { LengthIcon } from "@/icons/length-icon";
import { PieceIcon } from "@/icons/piece-icon";
import { WeightIcon } from "@/icons/weight-icon";


interface fishCardProps {
  fishName: string;
  fishImageUrl: string;
  date: string;
  waterAreaName: string;
  weightData: string;
  lengthData: string;
  pieceData: string;
}

export const FishCard = ({fishName, fishImageUrl, date, waterAreaName, weightData, lengthData, pieceData }: fishCardProps) => {
  return (
    <div className=" flex items-center w-full rounded-xl  shadow-lg p-2 mb-4 border-1">
      <div className="flex justify-center items-center w-[125px]">
        <img src={fishImageUrl} alt={fishName} className="text-xs text-default"/>
      </div>
      <div className="flex flex-col h-full w-full justify-between">
        <div className="flex p-2 justify-between items-center text-center ">
          <p className="text-md">{fishName}</p>
          <p className="text-xs">{date}</p>
        </div>
        <div>
          <p className="text-xs pl-2 pr-2">{waterAreaName}</p>
        </div>
        <div className="flex justify-between p-2 ">
          <div className="flex items-center p-1">
            <WeightIcon className="w-[16px] h-[16px] hover:w-[18px] hover:h-[18px] mr-1 " />
            <p className="text-xs pr-1">{weightData ? weightData : "-"}</p>
          </div>
          <div className="flex items-center p-1">
            <LengthIcon className="w-[16px] h-[16px] hover:w-[18px] hover:h-[18px]  mr-1 " />
            <p className="text-xs pr-1">{lengthData !== "0 null" ? lengthData : "-"}</p>
          </div>
          <div className="flex items-center p-1">
            <PieceIcon className="mt-1 w-[16px] h-[16px] hover:w-[18px] hover:h-[18px] mr-1 " />
            <p className="text-xs">{pieceData ? pieceData  : "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};