"use client"
import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import MDEditor from '@uiw/react-md-editor';
import { useOwnAuthorities } from "@/services/queries";
import { NewPostForm } from "@/components/form/new-post-form";

const MdEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );


export default function NewPostPage() {
  const session = useSession();

  const authorities = useOwnAuthorities();

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

  if (session.data?.user.role !== "OPERATOR") {
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

  if (authorities.isLoading) {
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
                "Below are maps of the associations, if they have been created. Not all associations have maps. The maps allow you to find your way around the lake"
              }
            />
            <NewPostForm content={value} authorities={authorities.data.authorities}/>
          </CardBody>
        </Card>
        <br />
        <div className="w-full px-3">
        <MdEditor value={value} onChange={setValue as ()=>void} className="bg-transparent h-screen"/>
        </div>
      </div>
    );
}
