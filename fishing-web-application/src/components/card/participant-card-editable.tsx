"use client";
import { deleteParticipant } from "@/actions";
import { DeleteIcon } from "@/icons/delete-icon";
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
import { Dispatch, SetStateAction } from "react";
interface ParticipantCardProps {
  index: number;
  tournamentId: string;
  setState: Dispatch<SetStateAction<any>>;
  item: {
    id: string;
    member: {
      id: string;
      user: {
        image: string | null;
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
      };
    };
  };
}

type array = {
  id: string;
  member: {
    id: string;
    user: {
      image: string | null;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      email: string | null;
    };
  };
}[];

export const ParticipantCardEditable = ({
  index,
  item,
  tournamentId,
  setState,
}: ParticipantCardProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  console.log("Item:" + item.id);

  const removeParticipant = deleteParticipant.bind(null, tournamentId, item.id);

  const updateParticipantArray = () => {
    setState((prevState: array) => prevState.filter((i) => i.id !== item.id));
  };

  const onSubmit = () => {
    removeParticipant();
    updateParticipantArray();
  };

  return (
    <div className="flex gap-3 items-center justify-between border-solid border-1 p-3 rounded-xl">
      <div className="flex gap-3 items-center">
        <p>{index}</p>
        <Avatar isBordered radius="full" size="md" src={""} />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-small font-semibold leading-none text-default-600">
            {item.member.user.firstName && item.member.user.lastName
              ? item.member.user.firstName + " " + item.member.user.lastName
              : item.member.user.name
              ? item.member.user.name
              : "no name"}
          </h4>
          <h5 className="text-small tracking-tight text-default-400">
            {item.member.user.firstName && item.member.user.lastName
              ? item.member.user.name
              : item.member.user.email
              ? item.member.user.email
              : "no name"}
          </h5>
        </div>
      </div>
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
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="z-100">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <p className="text-md">{"Delete participant"}</p>
              </ModalHeader>
              <ModalBody>
                <p>
                  {
                    "Deleting a participant from the list of competitors is a permanent action and cannot be reversed. The user can only join the competition by re-registering"
                  }
                </p>
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
  );
};
