/* eslint-disable react/display-name */
import { forwardRef } from "react";
import { handleModalOutsideClick } from "../utils/modal";

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
        <h1 className="text-white text-xl">{title}</h1>
        {desc && <h3 className="text-white text-md">{desc}</h3>}

        <div className="h-6"></div>

        <div className="flex justify-end gap-2">
          <button
            className="rounded bg-slate-700 hover:bg-slate-600 text-white px-3 py-1"
            onClick={cancel}>
            {cancelTitle || "Cancel"}
          </button>

          <button
            className="rounded bg-purple-400 hover:bg-purple-300 text-black px-3 py-1"
            onClick={confirm}>
            {confirmTitle || "Confirm"}
          </button>
        </div>
      </dialog>
    );
  },
);

export default NewConfirmModal;
