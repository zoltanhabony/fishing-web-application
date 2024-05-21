"use client";
import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useOwnAuthorities, useUserAccess } from "@/services/queries";
import { NewPostForm } from "@/components/form/new-post-form";
import { BackIcon } from "@/icons/back-icon";

const MdEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function NewPostPage() {
  const session = useSession();

  const authorities = useOwnAuthorities();
  const access = useUserAccess();

  const [value, setValue] = useState<string>("**Create Post**");

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">New Post</h1>
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
    );
  }

  if (authorities.isLoading || access.isLoading) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">New Post</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Create New Post"}
              description={
                "The graphs below illustrate the statistics on fish caught. They show the number of catches per month, the proportion of healthy and damaged fish and the proportion of fish types caught"
              }
            />
            The post editor is loading...
          </CardBody>
        </Card>
      </div>
    );
  }

  if (
    session.data?.user.role === "OPERATOR" ||
    (session.data?.user.role === "INSPECTOR" &&
      (access.data?.access !== null || access.data?.access !== undefined
        ? access.data?.access?.accessToPost !== undefined
          ? access.data?.access?.accessToPost
          : false
        : false))
  ) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
          <Link href={"/post"} className="pb-3 text-sm flex">
            <BackIcon />
            <span className="pl-3">{"back to list of posts"}</span>
          </Link>
            <h1 className="text-[30px]">New Post</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Create New Post"}
              description={
                "Below are maps of the associations, if they have been created. Not all associations have maps. The maps allow you to find your way around the lake"
              }
            />
            <NewPostForm
              content={value}
              authorities={authorities.data.authorities}
            />
          </CardBody>
        </Card>
        <br />
        <div className="w-full px-3">
          <MdEditor
            value={value}
            onChange={setValue as () => void}
            className="bg-transparent h-screen"
          />
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
      <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
        <h1 className="text-[30px]">New Post</h1>
      </CardHeader>
      <CardBody>
        <div className="space-y-1">
          <FormSections
            title={"You do not have access!"}
            description={"You do not have proper access to create posts!"}
          />
        </div>
      </CardBody>
    </Card>
  );
}
