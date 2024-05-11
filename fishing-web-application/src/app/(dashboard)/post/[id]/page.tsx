"use client"
import { FormSections } from "@/components/form/form-section";
import { Avatar, Card, CardBody, CardHeader} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useOwnAuthorities, usePostById } from "@/services/queries";
import { NewPostForm } from "@/components/form/new-post-form";
import MDEditor from "@uiw/react-md-editor";

interface ViewPostProps {
    params: {
      id: string;
    };
  }

const MdEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );


export default function ViewPostPage(props: ViewPostProps) {
  
    const session = useSession();

    const post = usePostById(props.params.id)

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">View Post</h1>
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


  if (post.isLoading) {
    return (
      <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Post</h1>
        </CardHeader>
        <CardBody>
          The post is loading...
        </CardBody>
      </Card>
      </div>
    );
  }

  if (Object.keys(post.data.post).length === 0) {

    return (
      <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Post</h1>
        </CardHeader>
        <CardBody>
          No post found
        </CardBody>
      </Card>
      </div>
    );
  }


    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">View Post</h1>
          </CardHeader>
          <CardBody>
          <div className="flex gap-3">
          <Avatar
            isBordered
            radius="full"
            size="md"
            src={post.data.post.member.user.image ? post.data.post.member.user.image : ""}
          />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {post.data.post.member.user.firstName && post.data.post.member.user.lastName ? `${post.data.post.member.user.firstName} ${post.data.post.member.user.lastName}` : post.data.post.member.user.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {post.data.post.member.user.firstName && post.data.post.member.user.lastName ? post.data.post.member.user.name : post.data.post.member.user.email}
            </h5>
          </div>
        </div>
          </CardBody>
        </Card>
        <br />
        <div className="w-full lg:w-[1000px] px-3">
        <MDEditor.Markdown source={post.data.post.content} style={{ whiteSpace: 'pre-wrap' }} className="bg-transparent"/>
        </div>
      </div>
    );
}
