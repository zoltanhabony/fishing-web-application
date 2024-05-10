"use client";
import { FormSections } from "@/components/form/form-section";
import {
  horizontalOption,
  lineOptions,
  pieOptions,
  verticalOption,
} from "@/helpers/statistics-options/options";
import useWindowDimensions from "@/hooks/use-window-dimensions";
import {
  useAuthorityStat,
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
import { useSession } from "next-auth/react";

import dynamic from "next/dynamic";
import { useState } from "react";
const ApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type authority = {
  fisheryAuthority: {
    id: string;
    fisheryAuthorityName: string;
  };
};

export default function StatisticsPage() {
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

  const { width } = useWindowDimensions();

  if (!session) {
    return (
      <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Statistics</h1>
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

  if (authorityStat.isLoading || userStat.isLoading || authorities.isLoading) {
    return (
      <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Statistics</h1>
        </CardHeader>
        <CardBody>
          <FormSections
            title={"Statistics of catches"}
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

  let authorityPieOpt = JSON.parse(JSON.stringify(pieOptions));;
  let userPieOpt = JSON.parse(JSON.stringify(pieOptions));
  
  authorityPieOpt.labels = authorityStat.data.fishTypes ? authorityStat.data.fishTypes : [];
  userPieOpt.labels = userStat.data.fishTypes ? userStat.data.fishTypes  : [];
  
  const authorityPieSeries = authorityStat.data.fishGroupSizes
    ? authorityStat.data.fishGroupSizes
    : [];

  const userPieSeries = userStat.data
    ? userStat.data.fishGroupSizes
      ? userStat.data.fishGroupSizes
      : []
    : [];

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
            <h1 className="text-[30px]">Statistics</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Statistics of catches"}
              description={
                "The graphs below illustrate the statistics on fish caught. They show the number of catches per month, the proportion of healthy and damaged fish and the proportion of fish types caught"
              }
            />
            <h3 className="text-sm py-3">Add filter:</h3>
            <div className="space-y-3">
              <Select
                selectedKeys={[year]}
                label="Select year"
                size="sm"
                onChange={(e) => {
                  setYear(e.target.value);
                }}
              >
                {yearSelectItems.map((item) => {
                  return (
                    <SelectItem key={String(item)}>{String(item)}</SelectItem>
                  );
                })}
              </Select>

              {session.data.user.role === "OPERATOR" ? (
                <Select
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

        {session.data.user.role === "OPERATOR" ||
        session.data.user.role === "INSPECTOR" ? (
          <div className="p-3">
            <FormSections
              size="secondary"
              title={"Authority Statistics"}
              description={
                "The bar chart below shows the number of fish caught in the association's waters by month"
              }
            />
            <div className="w-full text-sm pt-5">
              <FormSections
                size="third"
                title={"Catches by month"}
                description={
                  "The bar chart below shows the number of fish caught in the association's waters by month"
                }
              />
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
            <br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className=" py-3">
                <FormSections
                  size="third"
                  title={"Proportion of fish types caught"}
                  description={
                    "The pie chart below shows the distribution of fish species caught as a percentage"
                  }
                />
                <ApexChart
                  type={"pie"}
                  options={authorityPieOpt}
                  series={authorityPieSeries}
                  height={500}
                  width={"100%"}
                />
              </div>
              <div className=" py-3">
                <FormSections
                  size="third"
                  title={"Health status of fish caught"}
                  description={
                    "The line graph below shows the health of the fish caught by month."
                  }
                />
                <ApexChart
                  type={"line"}
                  options={lineOptions}
                  series={authorityLineSeries}
                  height={500}
                  width={"100%"}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {session.data.user.role === "USER" ||
        session.data.user.role === "INSPECTOR" ? (
          <div className="p-3">
            <FormSections
              size="secondary"
              title={"Catch Statistics"}
              description={
                "The bar chart below shows the number of fish caught by month"
              }
            />
            <div className="w-full text-sm pt-5">
              <FormSections
                size="third"
                title={"Catches by month"}
                description={
                  "The bar chart below shows the number of fish caught by month"
                }
              />
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
            <br />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className=" py-3">
                <FormSections
                  size="third"
                  title={"Proportion of fish types caught"}
                  description={
                    "The pie chart below shows the distribution of fish species caught as a percentage"
                  }
                />
                <ApexChart
                  type={"pie"}
                  options={userPieOpt}
                  series={userPieSeries}
                  height={500}
                  width={"100%"}
                />
              </div>
              <div className=" py-3">
                <FormSections
                  size="third"
                  title={"Health status of fish caught"}
                  description={
                    "The line graph below shows the health of the fish caught by month."
                  }
                />
                <ApexChart
                  type={"line"}
                  options={lineOptions}
                  series={userLineSeries}
                  height={500}
                  width={"100%"}
                />
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  return "";
}
