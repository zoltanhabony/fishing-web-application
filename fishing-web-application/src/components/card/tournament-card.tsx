"use client";

import { deleteMap, deleteTournament } from "@/actions";
import { DeleteIcon } from "@/icons/delete-icon";
import { EditIcon } from "@/icons/edit-icon";
import { MapIcon } from "@/icons/sidebar-icons/map-icon";
import { TrophyIcon } from "@/icons/sidebar-icons/trophy-icon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { StringToBoolean } from "tailwind-variants";

interface MapProps {
  isFinished: boolean;
  tournamentId: string;
  authorityName: string;
  tournamentName: string;
  tournamentDescription: string;
  tournamentType: string;
  isAuthor: Boolean;
  numberOfParticipants: number;
}

export const TournamentCard = ({
  authorityName,
  tournamentId,
  tournamentName,
  tournamentDescription,
  tournamentType,
  isAuthor,
  isFinished,
}: MapProps) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const removeTournament = deleteTournament.bind(null, tournamentId);

  return (
    <div className="flex gap-4 items-start flex-col justify-between bg-transparent border-solid border-1 border-default p-5 rounded-xl">
      <div className="w-full">
        <div className="w-full flex justify-between items-center">
          <span className="text-violet-600 bg-blue-300/10 p-3 rounded-full">
            <TrophyIcon />
          </span>
          {isAuthor ? (
            <div className="flex ">
              <Button
                variant="light"
                isIconOnly
                size="lg"
                color="primary"
                aria-label="Like"
                onClick={() => router.push(`/tournament/${tournamentId}/edit`)}
              >
                <EditIcon />
              </Button>
              {isFinished ? (
                <Button
                  isIconOnly
                  variant="light"
                  size="lg"
                  color="danger"
                  aria-label="Like"
                  type="submit"
                  onPress={onOpen}
                >
                  <DeleteIcon />
                </Button>
              ) : (
                ""
              )}
            </div>
          ) : null}
        </div>
        <div className="space-y-3">
          <p className="text-xs mt-2 text-gray-500">{authorityName}</p>
          <h3 className="font-semibold text-lg">{tournamentName}</h3>
          <div className="w-full">
            <p className="text-sm break-normal break-words">
              {tournamentDescription.length > 250
                ? tournamentDescription.substring(0, 250) + "..."
                : tournamentDescription.substring(0, 250)}
            </p>
          </div>
          <p className="text-sm text-gray-500">
            {"Tournament type: " + tournamentType}
          </p>
        </div>
      </div>
      <div className="flex w-full justify-end">
        <Button
          variant="light"
          size="md"
          color="primary"
          aria-label="Like"
          onClick={() => router.push(`/tournament/${tournamentId}`)}
        >
          View tournament
        </Button>
        {isFinished ? (
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="z-100">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <p className="text-md">{"Delete marker"}</p>
                  </ModalHeader>
                  <ModalBody>
                    <p>
                      {
                        "The operation is final and cannot be revoked! Deleting the marker will remove all data marked by the marker."
                      }
                    </p>
                    <br />
                    <p className="text-sm">{"Do you want to delete it?"}</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="default" onPress={onClose}>
                      Close
                    </Button>
                    <form action={removeTournament}>
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
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
