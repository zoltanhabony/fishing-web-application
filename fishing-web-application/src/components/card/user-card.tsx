import { Avatar, Card, CardBody } from "@nextui-org/react";

interface FishCardProps {
  image: string | null | undefined;
  username: string | null | undefined;
  email: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}
export const UserAvatar = ({
  image,
  username,
  email,
  firstName,
  lastName,
}: FishCardProps) => {
  return (
    <Card className=" text-gray-500 flex items-center justify-center">
      <CardBody>
        <div className="flex flex-col justify-center items-center">
          <Avatar
            isBordered
            color= "default"
            src={image ? image : ""}
            className="h-[100px] w-[100px] mt-2"
          />
          {firstName && lastName ? (
            <div className=" flex flex-col justify-center items-center p-2">
              <p className="text-md">{firstName + " " + lastName}</p>
              <p className="text-xs text-primary">{"@" + username}</p>
            </div>
          ) : (
            <div className=" flex flex-col justify-center items-center p-2">
            <p className="text-md">{username}</p>
            <p className="text-xs text-primary">{email}</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
