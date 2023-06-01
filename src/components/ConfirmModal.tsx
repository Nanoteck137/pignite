import { Dialog } from "@headlessui/react";

interface ConfirmModalProps {
  title: string;
  desc?: string;
  cancelTitle?: string;
  confirmTitle?: string;
  open?: boolean;
  cancel: () => void;
  confirm: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const { title, desc, open, cancelTitle, confirmTitle, cancel, confirm } =
    props;

  return (
    <Dialog className="relative z-50" open={!!open} onClose={cancel}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="flex flex-col w-full max-w-sm rounded bg-slate-700 px-4 py-4">
          <Dialog.Title className="text-white text-xl">{title}</Dialog.Title>
          {desc && (
            <Dialog.Description className="text-white text-md">
              {desc}
            </Dialog.Description>
          )}

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
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmModal;
