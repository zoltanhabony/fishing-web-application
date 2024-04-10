import db from "@/lib/db";
import notFound from "./not-found";
import { Card, CardBody, CardHeader, Snippet } from "@nextui-org/react";
import { FormSections } from "@/components/form/form-section";

interface AuthorityShowPageProps {
  params: {
    id: string;
  };
}

export default async function AuthorityShowPage(props: AuthorityShowPageProps) {
  const authority = await db.fisheryAuthority.findUnique({
    where: {
      id: props.params.id,
    },
    select: {
      id: true,
      fisheryAuthorityName: true,
      taxId: true,
      address: {
        select: {
          city: {
            select: { countyName: true, cityName: true, postalCode: true },
          },
          streetName: true,
          streetNumber: true,
          floor: true,
          door: true,
        },
      },
      waterArea:{
        select:{
            waterAreaName:true,
            waterAreaCode:true,
        }
      }
    },
  });

  if (!authority) {
    return notFound();
  }

  const address =
    authority.address.city.postalCode +
    " " +
    authority.address.city.cityName +
    ", " +
    authority.address.streetName +
    " " +
    authority.address.streetNumber +
    " " +
    (authority.address.floor !== null ? authority.address.floor + " floor " : "") +
    " " +
    (authority.address.door !== null ? authority.address.door + " door " : "");

  return (
    <div className="w-full mobile:items-center sm:items-start h-max-full flex flex-col p-5 rounded-xl space-y-3">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">{authority.fisheryAuthorityName}</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title="Details"
              description="The following information displays data related to the operation"
            />
          </div>
          <div className="w-full pt-3 space-y-3 pb-10">
            <Snippet symbol="Tax Identifier: " size="sm" fullWidth className=" overflow-auto">
              {authority.taxId}
            </Snippet>
            <Snippet symbol="Water Area Code: " size="sm" fullWidth className=" overflow-auto">
              {authority.waterArea.waterAreaCode}
            </Snippet>
            <Snippet symbol="Water Area Name: " size="sm" fullWidth className=" overflow-auto">
              {authority.waterArea.waterAreaName}
            </Snippet>
            <Snippet symbol="Address: " size="sm" fullWidth className=" overflow-auto">
              {address}
            </Snippet>
          </div>
          <FormSections
              title="Results"
              description="These results show the effectiveness of the association"
          />
          <div className="pt-3 rounded-lg">
            <dl className="grid max-w-screen-md grid-cols-2 gap-8 text-gray-900 sm:grid-cols-2 xl:grid-cols-6 dark:text-white">
              <div className="flex flex-col">
                <dt className="text-2xl font-bold">73M+</dt>
                <dd className="text-gray-500 dark:text-gray-400">Fisherman</dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xl font-bold">100M+</dt>
                <dd className="text-gray-500 dark:text-gray-400">
                  Caught fish
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="text-2xl font-bold">1000s</dt>
                <dd className="text-gray-500 dark:text-gray-400">
                    Successful event
                </dd>
              </div>
            </dl>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
