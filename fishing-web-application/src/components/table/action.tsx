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
import { usePathname } from 'next/navigation'

type deleteAction = {
  deleteTitle: string,
  deleteMessage: string
}


type Action<T> = {
  tooltip: string;
  action?: undefined | (() => Promise<T>);
  event?: () => void;
  id?: string;
  type: "submit" | "button" | "reset" | undefined;
  permissonsToAction?:boolean
  actionURL?:string
};

interface IActionsProps<V> {
  detail?: Action<V>;
  edit?: Action<V>;
  delete?: Action<V> & deleteAction;
}

export const Actions = <A,>(props: IActionsProps<A>) => {
  const router = useRouter();
  const pathname = usePathname()

  
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
              props.detail?.actionURL ? router.push(props.detail?.actionURL) : router.push(`${pathname}/${props.detail?.id}`);
            }}
          >
            <span className="text-lg text-default-800 cursor-pointer active:opacity-50">
              <EyeFilledIcon />
            </span>
          </Button>
        </form>
      </Tooltip>

      {props.edit?.permissonsToAction !== false ? <Tooltip color="primary" content={props.edit?.tooltip}>
        <form action={props.edit?.action ? props.edit?.action : () => null}>
          <Button
            isIconOnly
            aria-label="Edit"
            variant="light"
            onClick={() => {
              props.edit?.actionURL ? router.push(props.edit?.actionURL) : router.push(`${pathname}/${props.edit?.id}/edit`);
            }}
          >
            <span className="text-lg text-primary cursor-pointer active:opacity-50">
              <EditIcon />
            </span>
          </Button>
        </form>
      </Tooltip> : ""}

      {props.delete?.permissonsToAction !== false ? <Tooltip color="danger" content={props.delete?.tooltip}>
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
      </Tooltip>:""}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {props.delete?.deleteTitle || ""}
              </ModalHeader>
              <ModalBody>
                <p>
                 {props.delete?.deleteMessage || ""}
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
