"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useSession } from "next-auth/react";
import { FormSections } from "@/components/form/form-section";
import {
  horizontalOption,
  verticalOption,
} from "@/helpers/statistics-options/options";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import {
  useAuthorityStat,
  useCatcByAuthority,
  useCatcByUserId,
  useOwnAuthorities,
  useUserStat,
} from "@/services/queries";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { FishCard } from "@/components/card/catch-card";

type authority = {
  fisheryAuthority: {
    id: string;
    fisheryAuthorityName: string;
  };
};

export default function DashboardPage() {
  const session = useSession();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [authority, setAuthority] = useState("");
  const yearSelectItems: number[] = [];

  for (let i = 2000; i <= new Date().getFullYear(); i++) {
    yearSelectItems.push(i);
  }

  const authorityStat = useAuthorityStat(authority, year);
  const userStat = useUserStat(year);
  const authorities = useOwnAuthorities();
  const userCatch = useCatcByUserId();
  const waterAreaCatch = useCatcByAuthority(authority);

  const { width } = useWindowDimensions();
  if (!session) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
            <h1 className="text-[30px]">Dashboard</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-1">
              <FormSections
                title={"Authorization failed!"}
                description={"There is no valid session! Sign in again!"}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  if (
    authorityStat.isLoading ||
    userStat.isLoading ||
    authorities.isLoading ||
    userCatch.isLoading
  ) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Dashboard</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Dashboard"}
              description={
                "The graphs below illustrate the statistics on fish caught. They show the number of catches per month, the proportion of healthy and damaged fish and the proportion of fish types caught"
              }
            />
            Statistics is loading...
          </CardBody>
        </Card>
      </div>
    );
  }

  const authorityBarSeries = [
    {
      data: authorityStat.data.monthlyCatch
        ? authorityStat.data.monthlyCatch
        : [],
    },
  ];

  const userBarSeries = [
    {
      data: userStat.data.monthlyCatch ? userStat.data.monthlyCatch : [],
    },
  ];

  const authorityLineSeries = [
    {
      name: "Healthy",
      type: "line",
      data: authorityStat.data.healthyFishCounts
        ? authorityStat.data.healthyFishCounts
        : [],
      color: "#0ea5e9",
    },
    {
      name: "Injured",
      type: "line",
      data: authorityStat.data.injuredFishCounts
        ? authorityStat.data.injuredFishCounts
        : [],
      color: "#e11d48",
    },
  ];

  const userLineSeries = [
    {
      name: "Healthy",
      type: "line",
      data: userStat.data
        ? userStat.data.healthyFishCounts
          ? userStat.data.healthyFishCounts
          : []
        : [],
      color: "#0ea5e9",
    },
    {
      name: "Injured",
      type: "line",
      data: userStat.data
        ? userStat.data.injuredFishCounts
          ? userStat.data.injuredFishCounts
          : []
        : [],
      color: "#e11d48",
    },
  ];

  if (session.data?.user) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Dashboard</h1>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {session.data.user.role === "OPERATOR" && authorities.data ? (
                <Select
                  variant="bordered"
                  defaultSelectedKeys={[authorityStat.data.authorityName]}
                  label="Select authority"
                  size="sm"
                  onChange={(e) => {
                    setAuthority(e.target.value);
                  }}
                >
                  {authorities.data.authorities.map((a: authority) => (
                    <SelectItem key={a.fisheryAuthority.fisheryAuthorityName}>
                      {a.fisheryAuthority.fisheryAuthorityName}
                    </SelectItem>
                  ))}
                </Select>
              ) : (
                ""
              )}
            </div>
          </CardBody>
        </Card>

        {session.data.user.role === "OPERATOR" ? (
          <div className="p-3">
            <div className="w-full text-sm pt-5">
              <FormSections
                size="third"
                title={"Catches by month"}
                description={
                  "The bar chart below shows the number of fish caught in the association's waters by month"
                }
              />
              <div className="border-1 p-2 rounded-xl mt-3">
                <ApexChart
                  type={"bar"}
                  options={
                    width && width < 600 ? horizontalOption : verticalOption
                  }
                  series={authorityBarSeries}
                  height={500}
                  width={"100%"}
                />
              </div>
            </div>
            <div className="pt-3">
              <FormSections
                size="third"
                title={"Recent catches"}
                description={
                  "The bar chart below shows the number of fish caught by month"
                }
              />
              <div className="grid grid-cols-1 mt-3 gap-3 sm:grid-cols-2 lg:grid-cols-3  w-full">
                {waterAreaCatch.data?.catches &&
                waterAreaCatch.data?.catches.length !== 0 ? (
                  waterAreaCatch.data?.catches.map((c) => (
                    <FishCard
                      key={c.id}
                      fishName={c.fish.fishName}
                      fishImageUrl={c.fish.fishImageURL}
                      date={"" + new Date(c.createdAt).toLocaleDateString()}
                      waterAreaName={c.waterArea.waterAreaName}
                      weightData={
                        c.CatchDetails[0].value +
                        " " +
                        c.CatchDetails[0].unit.unitAcronyms
                      }
                      lengthData={
                        c.CatchDetails[1].value +
                        " " +
                        c.CatchDetails[1].unit.unitAcronyms
                      }
                      pieceData={
                        c.CatchDetails[2].value +
                        " " +
                        c.CatchDetails[2].unit.unitAcronyms
                      }
                    />
                  ))
                ) : (
                  <div className="border-1 rounded-xl p-5  w-full">
                    <p>No catch found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {session.data.user.role === "USER" ||
        session.data.user.role === "INSPECTOR" ? (
          <div className="p-2">
            <div className="w-full text-sm">
              <FormSections
                title={"Catches by month"}
                description={
                  "The bar chart below shows the number of fish caught by month"
                }
              />
              <div className="border-1 p-2 rounded-xl mt-3">
                <ApexChart
                  type={"bar"}
                  options={
                    width && width < 600 ? horizontalOption : verticalOption
                  }
                  series={userBarSeries}
                  height={500}
                  width={"100%"}
                />
              </div>
            </div>
            <div className="pt-3">
              <FormSections
                title={"Recent catches"}
                description={
                  "The bar chart below shows the number of fish caught by month"
                }
              />
              <div className="grid grid-cols-1 mt-3 gap-3 sm:grid-cols-2 lg:grid-cols-3  w-full">
                {userCatch.data?.catches &&
                userCatch.data?.catches.length !== 0 ? (
                  userCatch.data?.catches.map((c) => (
                    <FishCard
                      key={c.id}
                      fishName={c.fish.fishName}
                      fishImageUrl={c.fish.fishImageURL}
                      date={"" + new Date(c.createdAt).toLocaleDateString()}
                      waterAreaName={c.waterArea.waterAreaName}
                      weightData={
                        c.CatchDetails[0].value +
                        " " +
                        c.CatchDetails[0].unit.unitAcronyms
                      }
                      lengthData={
                        c.CatchDetails[1].value +
                        " " +
                        c.CatchDetails[1].unit.unitAcronyms
                      }
                      pieceData={
                        c.CatchDetails[2].value +
                        " " +
                        c.CatchDetails[2].unit.unitAcronyms
                      }
                    />
                  ))
                ) : (
                  <div className="border-1 rounded-xl p-5 w-full">
                    <p>No catch found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
