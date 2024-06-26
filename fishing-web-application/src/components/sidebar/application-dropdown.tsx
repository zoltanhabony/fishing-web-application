import React, { useState } from "react";
import { AppLogo } from "../brand/app-logo";

interface Company {
  name: string;
  location: string;
}

export const ApplicationInfo = () => {
  const [contact, setContact] = useState<Company>({
    name: "FISHIFY",
    location: "Palo Alto, CA",
  });

  return (
        <div className="flex items-center w-full ">
          <AppLogo/>
          <div className="flex flex-col justify-center gap-4 pl-3 ">
            <h3 className="text-md font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              FISHING
            </h3>
            <p className="text-xs">WEB APPLICATON</p>
          </div>
        </div>
  );
};
