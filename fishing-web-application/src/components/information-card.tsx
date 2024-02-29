import InformationCardProps from "@/helpers/interfaces/IInformationCard";
import { ErrorIcon } from "@/icons/error-icon";
import { InfromationIcon } from "@/icons/information-icon";
import { SuccessIcon } from "@/icons/success-icon";
import { WarningIcon } from "@/icons/warning-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";

const itemClasses = {
  base: "w-full",
  title: "text-sm font-medium",
  trigger:
    "px-2 py-2 data-[hover=true]:bg-default-100 rounded-lg flex items-center",
  indicator: "text-sm",
  content: "text-sm px-2",
};

export const InformationCard = ({
  title,
  subtitle,
  description,
  status,
}: InformationCardProps) => {
  let icon = null

  switch (status) {
    case "error":
      icon = <ErrorIcon className="text-[25px] text-danger"/>
      break;
    case "information":
      icon = <InfromationIcon className="text-[25px] text-primary"/>
      break;
    case "success":
      icon = <SuccessIcon className="text-[25px] text-success"/>
      break;
    case "warning":
      icon = <WarningIcon className="text-[25px] text-warning"/>
      break;
    default:
      break;
  }

  return (
    <>
    <Accordion
      fullWidth
      className="p-2 mt-2 flex flex-col gap-1"
      variant="shadow"
      itemClasses={itemClasses}
    >
      <AccordionItem
        key="1"
        aria-label={title}
        startContent={icon}
        subtitle={<p className="flex text-xs">{subtitle}</p>}
        title={title}
      >
        <p className="text-xs">{description}</p>
      </AccordionItem>
    </Accordion>
    </>
  );
};
