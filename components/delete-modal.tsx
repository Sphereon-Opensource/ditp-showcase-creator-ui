import {
  CircleAlert,
  Cross,
  FileWarning,
  TriangleAlert,
  X,
} from "lucide-react";
import React from "react";
import ButtonOutline from "./ui/button-outline";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  header?: string;
  description?: string;
  subDescription?: string;
  cancelText?: string;
  deleteText?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  header = "Are you sure?",
  description = "Are you sure you want to delete this item?",
  subDescription = "This action cannot be undone.",
  cancelText = "Cancel",
  deleteText = "Delete",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" flex flex-col justify-between bg-white p-4 rounded shadow-lg max-w-[40%] text-center">
        <div>
        <div className="flex items-center justify-between border-b border-gray-300 pb-4">
          <h3 className="text-lg font-semibold flex gap-2 items-center">
            <TriangleAlert color={"orange"} size={22} />
            {header}
          </h3>
          <X onClick={onClose} size={22} className="cursor-pointer ml-4" />
        </div>
        <div className="py-4">
          <p
            className="mt-2 text-gray-600 text-start"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          {subDescription && (
            <p
              className="text-start mt-2 font-base"
              dangerouslySetInnerHTML={{ __html: subDescription }}
            />
          )}
        </div>
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t pt-3 border-gray-300">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 rounded"
          >
            {cancelText}
          </button>
          <ButtonOutline onClick={onDelete}>{deleteText}</ButtonOutline>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
