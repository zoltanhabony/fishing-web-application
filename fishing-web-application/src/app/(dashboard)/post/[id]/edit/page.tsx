"use client";
import { auth } from "@/auth";
import { FormSections } from "@/components/form/form-section";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import {
  useOwnAuthorities,
  usePostByIdForEdit,
  useUserAccess,
} from "@/services/queries";
import { NewPostForm } from "@/components/form/new-post-form";
import { EditPostForm } from "@/components/form/edit-post-form";

const MdEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface PostEditPageProps {
  params: {
    id: string;
  };
}

export default function NewPostPage(props: PostEditPageProps) {
  const session = useSession();

  const authorities = useOwnAuthorities();
  const access = useUserAccess();

  const post = usePostByIdForEdit(props.params.id);

  const [value, setValue] = useState<string>("**Create post**");

  useEffect(() => {
    if (!post.isLoading) {
      setValue(post.data.post.content);
    }
  }, [post.data, post.isLoading]);

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Post</h1>
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

  if (post.isLoading || authorities.isLoading || access.isLoading) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Edit Post</h1>
          </CardHeader>
          <CardBody>
            <FormSections
              title={"Edit Post"}
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
    session.data?.user.role !== "OPERATOR" &&
    (session.data?.user.role !== "INSPECTOR" || !access.data?.access?.accessToPost)){
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Edit Post</h1>
        </CardHeader>
        <CardBody>
          <div className="space-y-1">
            <FormSections
              title={"No permission!"}
              description={"You have no right to edit this post!"}
            />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (Object.keys(post.data.post).length === 0) {
    return (
      <div className="p-5 h-full">
        <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent px-3">
          <CardHeader className="mobile:block flex flex-col">
            <h1 className="text-[30px]">Edit Post</h1>
          </CardHeader>
          <CardBody>
          <FormSections
              title={"Edit Post"}
              description={
                "The post cannot be found or you do not have permission to edit it!"
              }
            />
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Edit Post</h1>
        </CardHeader>
        <CardBody>
          <FormSections
            title={"Edit Post"}
            description={
              "Below are maps of the associations, if they have been created. Not all associations have maps. The maps allow you to find your way around the lake"
            }
          />
          <EditPostForm
            id={post.data.post.id}
            authority={post.data.post.fisheryAuthority.fisheryAuthorityName}
            authorities={authorities.data.authorities}
            mainTitle={post.data.post.mainTitle}
            summary={post.data.post.summary}
            content={value}
          />
        </CardBody>
      </Card>
      <br />
      <div className="w-full px-3">
        <MdEditor
          value={value}
          onChange={setValue as () => void}
          className=" h-screen bg-transparent text-white"
        />
      </div>
    </div>
  );
}
