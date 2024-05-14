"use client";
import {
  Avatar,
} from "@nextui-org/react";
interface ParticipantCardProps {
  index: number;
  item: {
    id: string;
    member: {
      id: string;
      user: {
        image: string | null;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
      };
    };
  };
}

export const ParticipantCard = ({
  index,
  item,
}: ParticipantCardProps) => {

  return (
    <div className="flex gap-3 items-center justify-between border-solid border-1 p-3 rounded-xl">
      <div className="flex gap-3 items-center">
        <p>{index}</p>
        <Avatar isBordered radius="full" size="md" src={""} />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {item.member.user.firstName && item.member.user.lastName
              ? item.member.user.firstName + " " + item.member.user.lastName
              : item.member.user.name ? item.member.user.name : "no name"}
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            {item.member.user.firstName && item.member.user.lastName ? item.member.user.name : item.member.user.email? item.member.user.email : "no name"}
          </h5>
        </div>
      </div>
    </div>
  );
};
