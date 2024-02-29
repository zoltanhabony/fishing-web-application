import React, { useState } from "react";

interface Company {
  name: string;
  location: string;
  logo: React.ReactNode;
}

export const ApplicationInfo = () => {
  const [contact, setContact] = useState<Company>({
    name: "FISHIFY",
    location: "Palo Alto, CA",
    logo: null,
  });

  return (
        <div className="flex items-center gap-2">
          {contact.logo}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              FISHIFY
            </h3>
          </div>
        </div>
  );
};
