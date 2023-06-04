import { Dialog } from "@headlessui/react";
import { useRef } from "react";
import Button from "./Button";

interface CreateModalProps {
  title: string;
  open?: boolean;
  close: () => void;
  create: (value: string) => void;
}

const CreateModal = (props: CreateModalProps) => {
  const { title, open, close, create } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  function closeAndReset() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    close();
  }

  function submit() {
    if (inputRef.current) {
      create(inputRef.current.value);
    }
    close();
  }

  return (
    <Dialog className="relative z-50" open={!!open} onClose={closeAndReset}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="flex w-full max-w-sm flex-col rounded bg-slate-700 p-4">
          <Dialog.Title className="text-2xl text-white">{title}</Dialog.Title>

          <div className="h-2"></div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}>
            <input
              className="flex-grow rounded bg-slate-600 px-2 py-0 text-white placeholder:text-gray-200"
              type="text"
              placeholder="Name"
              ref={inputRef}
            />
            <input type="submit" hidden />
          </form>

          <div className="h-6"></div>

          <div className="flex justify-end gap-2">
            <Button
              varient={"secondary"}
              varientStyle="text"
              onClick={closeAndReset}>
              Cancel
            </Button>
            <button
              className="rounded bg-purple-400 px-3 py-1 text-black hover:bg-purple-300"
              onClick={submit}>
              Create
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateModal;
