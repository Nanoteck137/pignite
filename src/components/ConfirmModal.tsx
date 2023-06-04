/* eslint-disable react/display-name */
import { forwardRef } from "react";
import { handleModalOutsideClick } from "../utils/modal";
import Button from "./Button";

interface NewConfirmModalProps {
  title: string;
  desc?: string;
  cancelTitle?: string;
  confirmTitle?: string;
  cancel?: () => void;
  confirm?: () => void;
}

const NewConfirmModal = forwardRef<HTMLDialogElement, NewConfirmModalProps>(
  (props, ref) => {
    const { title, desc, cancelTitle, confirmTitle, cancel, confirm } = props;
    return (
      <dialog
        className="w-full max-w-sm rounded bg-slate-700 px-4 py-4"
        ref={ref}
        onClick={handleModalOutsideClick}>
        <h1 className="text-xl text-white">{title}</h1>
        {desc && <h3 className="text-md text-white">{desc}</h3>}

        <div className="h-6"></div>

        <div className="flex justify-end gap-2">
          <Button varient="secondary" varientStyle="text" onClick={cancel}>
            {cancelTitle || "Cancel"}
          </Button>
          <Button varient="danger" onClick={confirm}>
            {confirmTitle || "Confirm"}
          </Button>
        </div>
      </dialog>
    );
  },
);

export default NewConfirmModal;
