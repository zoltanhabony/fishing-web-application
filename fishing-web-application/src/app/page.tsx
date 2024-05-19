import { AppLogo } from "@/components/brand/app-logo";
import { ServiceCard } from "@/components/card/service-card";
import { MembersIcon } from "@/icons/member-icon";
import { BookmarkIcon } from "@/icons/sidebar-icons/bookmark-icon";
import { HomeIcon } from "@/icons/sidebar-icons/home-icon";
import { MapIcon } from "@/icons/sidebar-icons/map-icon";
import { NewspaperIcon } from "@/icons/sidebar-icons/newspaper-icon";
import { StatisticsIcon } from "@/icons/sidebar-icons/statistics-icon";
import { TrophyIcon } from "@/icons/sidebar-icons/trophy-icon";
import { UserIcon } from "@/icons/user-icon";
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="block">
      <div className="flex h-screen flex-col">
        <div className="w-full h-[70px] flex justify-between items-center p-3">
          <div className="flex items-center w-full ">
            <AppLogo />
            <div className="flex flex-col justify-center gap-4 pl-3 ">
              <h3 className="text-md font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
                FISHING
              </h3>
              <p className="text-xs">WEB APPLICATON</p>
            </div>
          </div>
          <div className="space-x-3 flex">
            <Button
              href="/auth/login"
              variant="light"
              color="primary"
              as={Link}
            >
              Login
            </Button>
            <Button
              href="/auth/registration"
              variant="light"
              color="secondary"
              as={Link}
            >
              Sign Up
            </Button>
          </div>
        </div>
        <div className="flex flex-1 justify-center items-center">
          <div className="flex flex-col text-center justify-center items-center w-full h-full px-5 md:w-[1400px] py-5">
            <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              <span className="text-primary">Organise</span> your angling{" "}
              <span className="text-red-300">{"association's"}</span> operations
              in the <span className="text-secondary">online space</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center pb-3">
        <h2 className="text-2xl leading-normal mb-2 font-bold ">
          For <span className="text-secondary">users</span>
        </h2>
        <p className="text-default">Less administration more fishing</p>
      </div>
      <div className="w-full flex justify-center items-center">
        <div className="w-full grid mobile:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-center justify-center items-center md:w-[1400px] gap-3">
          <ServiceCard
            serviceName={"Logbook"}
            serviceDesc={
              "Manage your catch log online, record your catches quickly and easily"
            }
            icon={<BookmarkIcon />}
          />
          <ServiceCard
            serviceName={"Posts"}
            serviceDesc={
              "Get the latest information, browse the entries, read the posts"
            }
            icon={<NewspaperIcon />}
          />
          <ServiceCard
            serviceName={"Competitions"}
            serviceDesc={
              "Register for the competitions online, don't miss out on a great opportunity to test yourself"
            }
            icon={<TrophyIcon />}
          />
          <ServiceCard
            serviceName={"Map"}
            serviceDesc={
              "Use the map to easily navigate around the water area, find the best fishing spots and nearby services"
            }
            icon={<MapIcon />}
          />
          <ServiceCard
            serviceName={"Statistics"}
            serviceDesc={
              "Track your catch statistics, monthly catches and proportions of fish types caught"
            }
            icon={<StatisticsIcon />}
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center pb-3">
        <Link
          href="/auth/registration"
          showAnchorIcon
          color="primary"
          className="text-sm"
        >
          Get started
        </Link>
      </div>

      <br />
      <br />
      <br />
      <br />
      <div className="w-full flex flex-col justify-center items-center pb-3">
        <h2 className="text-2xl leading-normal mb-2 font-bold ">
          For <span className="text-primary">operators</span>
        </h2>
        <p className="text-default">
          Less administration more services for users
        </p>
      </div>
      <div className="w-full flex justify-center items-center py-5">
        <div className="w-full grid mobile:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 text-center justify-center items-center md:w-[1400px] gap-3">
          <ServiceCard
            serviceName={"Logbook"}
            serviceDesc={
              "Create catch logs for these users and monitor their activities"
            }
            icon={<BookmarkIcon />}
          />
          <ServiceCard
            serviceName={"Posts"}
            serviceDesc={
              "Create posts and inform your users about the latest news and events"
            }
            icon={<NewspaperIcon />}
          />
          <ServiceCard
            serviceName={"Competitions"}
            serviceDesc={
              "Organise competitions and promote the association and the sport"
            }
            icon={<TrophyIcon />}
          />
          <ServiceCard
            serviceName={"Map"}
            serviceDesc={
              "Create a map and mark key points in the water area to help users find their way around"
            }
            icon={<MapIcon />}
          />
          <ServiceCard
            serviceName={"Statistics"}
            serviceDesc={
              "You can track catch statistics, monthly catches, catch rates and monitor fish health"
            }
            icon={<StatisticsIcon />}
          />
          <ServiceCard
            serviceName={"Members"}
            serviceDesc={
              "You can track catch statistics, monthly catches, catch rates and monitor fish health"
            }
            icon={<MembersIcon />}
          />
        </div>
      </div>
      <div className="w-full flex flex-col justify-center items-center pb-3">
        <Link
          href="/auth/registration"
          showAnchorIcon
          color="primary"
          className="text-sm"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}
