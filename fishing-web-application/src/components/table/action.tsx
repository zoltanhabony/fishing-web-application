import { DeleteIcon } from "@/icons/delete-icon";
import { EditIcon } from "@/icons/edit-icon";
import { EyeFilledIcon } from "@/icons/eye-icon";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";

type Action<T> = {
  tooltip: string;
  action?: undefined | (() => Promise<T>);
  event?: () => void;
  id?: string;
  type: "submit" | "button" | "reset" | undefined;
};

interface IActionsProps<V> {
  detail?: Action<V>;
  edit?: Action<V>;
  delete?: Action<V>;
}

export const Actions = <A,>(props: IActionsProps<A>) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="relative flex items-center">
      <Tooltip content={props.detail?.tooltip}>
        <form action={props.detail?.action ? props.detail?.action : () => null}>
          <Button
            isIconOnly
            aria-label="Details"
            variant="light"
            type="submit"
            onClick={() => {
              router.push(`/authority/${props.detail?.id}`);
            }}
          >
            <span className="text-lg text-default-800 cursor-pointer active:opacity-50">
              <EyeFilledIcon />
            </span>
          </Button>
        </form>
      </Tooltip>
      <Tooltip color="primary" content={props.edit?.tooltip}>
        <form action={props.edit?.action ? props.edit?.action : () => null}>
          <Button
            isIconOnly
            aria-label="Edit"
            variant="light"
            onClick={() => {
              router.push(`/authority/${props.edit?.id}/edit`);
            }}
          >
            <span className="text-lg text-primary cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Button>
        </form>
      </Tooltip>
      <Tooltip color="danger" content={props.delete?.tooltip}>
          <Button
            isIconOnly
            aria-label="Details"
            variant="light"
            type={props.delete?.type}
            onPress={onOpen}
          >
            <span className="text-lg text-danger cursor-pointer active:opacity-50">
              <DeleteIcon />
            </span>
          </Button>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete association
              </ModalHeader>
              <ModalBody>
                <p>
                  Deleting the association will delete all statistical data,
                  catch logs, users and other specific settings from the system.
                  The action cannot be undone, so please inform the members of
                  the association of your decision before deleting!
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Close
                </Button>
                <form action={props.delete?.action ? props.delete?.action : () => null}>
                <Button color="danger" type="submit">
                  Delete
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
