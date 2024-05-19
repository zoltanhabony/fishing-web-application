"use client";

import { deletePost } from "@/actions";
import { DeleteIcon } from "@/icons/delete-icon";
import { EditIcon } from "@/icons/edit-icon";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface PostCardProps {
  mainTitle: string;
  summary: string;
  authorityName: string;
  isAuthor: Boolean;
  postId: string;
  imageURL: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  name: string | null;
}

export const PostCard = ({
  mainTitle,
  summary,
  authorityName,
  isAuthor,
  postId,
  imageURL,
  firstName,
  lastName,
  email,
  name,
}: PostCardProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const removePost = deletePost.bind(null, postId);

  return (
    <div className="flex gap-4 items-start flex-col justify-between border-solid border-1 border-default p-5 rounded-xl">
      <div className="w-full">
        <div className="w-full block sm:flex justify-between items-center">
          <div className="flex gap-3">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={imageURL ? imageURL : ""}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                {firstName && lastName ? `${firstName} ${lastName}` : name}
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                {firstName && lastName ? name : email}
              </h5>
            </div>
          </div>
          {isAuthor ? (
            <div className="flex ">
              <Button
                variant="light"
                isIconOnly
                size="lg"
                color="primary"
                aria-label="Like"
                onClick={() => router.push(`/post/${postId}/edit`)}
              >
                <EditIcon />
              </Button>
              <Button
                isIconOnly
                variant="light"
                size="lg"
                color="danger"
                aria-label="Like"
                onPress={onOpen}
              >
                <DeleteIcon />
              </Button>
            </div>
          ) : null}
        </div>

        <div className="space-y-3 pt-5 w-full">
          <p className="text-xs text-default">{authorityName + "'s post"}</p>
          <h3 className="font-semibold text-lg">{mainTitle}</h3>
          <p className="text-sm mt-1 text-gray-300 break-normal break-words w-full">
            {summary.length > 250 ? summary.substring(0, 250) + "..." : summary}
          </p>
          <div></div>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          variant="light"
          size="md"
          color="primary"
          aria-label="Like"
          onClick={() => router.push(`/post/${postId}`)}
        >
          View post
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="z-100">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <p className="text-md">{"Delete Post"}</p>
                </ModalHeader>
                <ModalBody>
                  <p>
                    {
                      "The operation is final and cannot be revoked! Deleting the post will remove all data."
                    }
                  </p>
                  <br />
                  <p className="text-sm">{"Do you want to delete it?"}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" onPress={onClose}>
                    Close
                  </Button>
                  <form action={removePost}>
                    <Button
                      color="danger"
                      aria-label="Delete post"
                      type="submit"
                      onPress={onClose}
                    >
                      {"Delete"}
                    </Button>
                  </form>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
