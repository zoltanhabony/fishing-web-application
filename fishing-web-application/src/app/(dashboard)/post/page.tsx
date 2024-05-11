"use server";
import { getAllPost } from "@/actions/db-actions/post-actions/get-all-post";
import { auth } from "@/auth";
import { PostCard } from "@/components/card/post-card";
import { FormSections } from "@/components/form/form-section";
import { BottomPagination } from "@/components/pagination/bottom-pagination";
import { Button, Card, CardBody, CardHeader, Link } from "@nextui-org/react";

export default async function PostPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    search?: string;
  };
}) {
  const session = await auth();

  const page = searchParams?.page || "1";
  const search = searchParams?.search || "";

  const postList = await getAllPost(page, search);

  const pages = Math.ceil(postList.numberOfPost / 12);

  const PostCardsPromise = postList.posts.map(
    async (post) =>
      await (
        <PostCard
          key={post.id}
          mainTitle={post.mainTitle}
          summary={post.summary}
          authorityName={post.fisheryAuthority.fisheryAuthorityName}
          isAuthor={await post.isAuthor}
          postId={post.id}
          imageURL={post.member.user.image}
          firstName={post.member.user.firstName}
          lastName={post.member.user.lastName}
          email={post.member.user.email}
          name={post.member.user.name}
        />
      )
  );

  const PostCards = await Promise.all(PostCardsPromise)

  if (!session) {
    return (
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col mobile:justify-between mobile:items-center">
          <h1 className="text-[30px]">Posts</h1>
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

  return (
    <div className="p-5 h-full">
      <Card className="w-full mobile:w-[450px] flex flex-col justify-center items-center shadow-none bg-transparent">
        <CardHeader className="mobile:block flex flex-col">
          <h1 className="text-[30px]">Posts</h1>
        </CardHeader>
        <CardBody>
          <FormSections
            title={"Posts of associations"}
            description={
              "In the list below you can see the posts created by the associations. You can get important information from the posts."
            }
          />
          <br />
          {session.user.role === "OPERATOR" ? (
            <Button color="primary" href="/post/new" as={Link}>
              Create Post
            </Button>
          ) : (
            ""
          )}
        </CardBody>
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 mt-16 px-3 ">
        {PostCards}
      </div>
      <br />
      <div className="w-full flex items-center justify-center">
        {pages !==0 ? <BottomPagination pages={pages} /> : <p>No post found</p>}
      </div>
    </div>
  );
}
