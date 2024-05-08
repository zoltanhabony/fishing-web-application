"use client"

import { deleteMap } from "@/actions";
import { DeleteIcon } from "@/icons/delete-icon";
import { EditIcon } from "@/icons/edit-icon";
import { MapIcon } from "@/icons/sidebar-icons/map-icon";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useRouter } from "next/navigation";

interface MapProps {
  mapId: string
  authorityName: string;
  waterAreaName: string;
  lat: string;
  long: string;
  isAuthor: Boolean;
}

export const MapCard = ({
  authorityName,
  waterAreaName,
  lat,
  long,
  isAuthor,
  mapId
}: MapProps) => {

  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const removeMap = deleteMap.bind(null, mapId)

  return (
    <div className="flex gap-4 items-start flex-col bg-zinc-900 p-5 rounded-xl">
      <div className="w-full flex justify-between items-center">
        <span className="text-violet-600 bg-blue-300/10 p-3 rounded-full">
          <MapIcon />
        </span>
        {isAuthor ? (
          <div className="flex ">
            <Button variant="light" isIconOnly size="lg" color="primary" aria-label="Like" onClick={()=>router.push(`/map/${mapId}/edit`)}>
              <EditIcon />
            </Button>
            <Button isIconOnly variant="light" size="lg" color="danger" aria-label="Like" type="submit" onPress={onOpen}>
              <DeleteIcon />
            </Button>
          </div>
        ) : (
         null
        )}
      </div>
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">{authorityName + "'s Map"}</h3>
        <p className="text-sm mt-1 text-gray-300">
          This map shows the angling association {authorityName}, which is part
          of the {waterAreaName} water area. The map may provide useful
          information for those who are in the water area
        </p>
        <div>
          <p className="text-xs mt-2 text-gray-500">
            lat: {lat} long: {long}
          </p>
        </div>
      </div>
      <div className="flex w-full justify-end">
      <Button variant="light" size="md" color="primary" aria-label="Like" onClick={()=>router.push(`/map/${mapId}`)}>
      View map
      </Button>
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
                      <form action={removeMap}>
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
      </div>
    </div>
  );
};
