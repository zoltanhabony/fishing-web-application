import { Card, CardBody } from "@nextui-org/react";
import { ReactNode } from "react";

interface ServiceCardProps {
  serviceName: string;
  serviceDesc: string;
  icon: ReactNode;
}

export const ServiceCard = ({
  serviceName,
  serviceDesc,
  icon,
}: ServiceCardProps) => {
  return (
    <Card
      className="bg-transparent shadow-none hover:shadow-xl"
      data-wow-duration="1s"
    >
      <CardBody>
        <div className="p-5 flex flex-col h-full items-stretch transform transition duration-300 ease-in-out hover:-translate-y-2 ">
          <div className="inline-block text-gray-900 mb-4">{icon}</div>
          <h3 className="text-lg leading-normal mb-2 font-semibold ">
            {serviceName}
          </h3>
          <p className="text-gray-500">{serviceDesc}</p>
        </div>
      </CardBody>
    </Card>
  );
};
