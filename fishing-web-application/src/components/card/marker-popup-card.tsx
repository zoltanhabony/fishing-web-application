import { deleteMarker } from "@/actions";
import { DeleteIcon } from "@/icons/delete-icon";
import { EditIcon } from "@/icons/edit-icon";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useSWRConfig } from "swr";

interface MarkerPopupProps {
  markerId: string | null;
  mapId: string | null;
  name: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageURL: string | null;
  title: string | null;
  info: string | null;
  createdAt: Date | null;
  isAuthor: boolean | null;
  revalidateMarker: ()=> void
}

export const MarkerPopup = ({
  markerId,
  mapId,
  name,
  imageURL,
  firstName,
  lastName,
  email,
  title,
  info,
  createdAt,
  isAuthor,
  revalidateMarker,

}: MarkerPopupProps) => {
  const router = useRouter();

  const removeMarker = deleteMarker.bind(null, String(markerId), String(mapId));

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [isMounted, setIsMounted] = useState<boolean>(false)

  let [isPending, startTransition] = useTransition();

    useEffect(() => {
        if(!isPending && !isMounted) {
          return;
        }
        setIsMounted(true)
    
        revalidateMarker()
        
    }, [isMounted, isPending, revalidateMarker]);

    const onSubmit = () => {

      startTransition(() => {
          removeMarker()
      });
  }


  return (
    <Card className="max-w-[200px] bg-transparent shadow-none">
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="z-100">
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      <p className="text-md">{"Delete marker"}</p>
                    </ModalHeader>
                    <ModalBody>
                      <p>{"The operation is final and cannot be revoked! Deleting the marker will remove all data marked by the marker."}</p>
                      <br />
                      <p className="text-sm">{"Do you want to delete it?"}</p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="default" onPress={onClose}>
                        Close
                      </Button>
                      <form action={onSubmit}>
                        <Button
                          color="danger"
                          aria-label="Delete marker"
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
      {isAuthor !== null ? (
        isAuthor ? (
          <div className="flex">
            <Button
              isIconOnly
              size="lg"
              color="primary"
              variant="light"
              aria-label="Edit marker"
              onClick={() =>
                router.push(`/map/${mapId}/marker/${markerId}/edit`)
              }
            >
              <EditIcon />
            </Button>
            <Button
              isIconOnly
              aria-label="Details"
              variant="light"
              size="lg"
              color="danger"
              onPress={onOpen}
            >
              <DeleteIcon />
            </Button>
          </div>
        ) : (
          ""
        )
      ) : (
        ""
      )}
      <CardHeader className="justify-between">
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
      </CardHeader>
      <CardBody className="space-y-2">
        <h1 className="text-lg">{title}</h1>
        <p className="text-sm text-default-500">{info}</p>
      </CardBody>
      <CardFooter>
        <div className="w-full flex items-center justify-between">
          <p className="text-sm">{"Created at: "}</p>
          <p className="text-default-500 pt-1">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};
