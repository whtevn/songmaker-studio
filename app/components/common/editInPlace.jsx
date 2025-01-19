import React, { useState, useRef } from "react";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

const EditInPlace = ({ children, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef(null); // Reference for the input field

  const handleSave = () => {
    onSave(inputValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setInputValue(value);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0); // Focus the input field
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {isEditing ? (
        <div className="flex items-center gap-2 w-full">
          <input
            ref={inputRef} // Attach the ref to the input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <CheckIcon
            className="h-5 w-5 text-slate-500 cursor-pointer"
            onClick={handleSave}
          />
          <XMarkIcon
            className="h-5 w-5 text-slate-500 cursor-pointer"
            onClick={handleCancel}
          />
        </div>
      ) : (
        <div className="flex items-center gap-2 w-full">
          <PencilIcon
            className="h-5 w-5 text-gray-500 cursor-pointer"
            onClick={handleEdit} // Handle edit mode and set focus
          />
          <span className="flex-grow">{children}</span>
        </div>
      )}
    </div>
  );
};

export default EditInPlace;

