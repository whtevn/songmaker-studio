import React, { useState, useRef } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { Input } from "~/components/catalyst-theme/input";

const DragAndDropUploader = ({ onFileChange, acceptedFileTypes = "image/*" }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleImageUpload(selectedFile);
    }
  };

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result;
      setFile(base64String); // Save Base64 string
      setPreview(base64String); // Use for preview
      onFileChange(base64String);
    };
    reader.readAsDataURL(file);
  };


  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleImageUpload(droppedFile);
      onFileChange(droppedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    onFileChange(null);
  };

  return (
    <div
      className="border-dashed border-2 border-gray-500 p-4 text-center cursor-pointer relative"
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Preview" className="max-h-40 mx-auto" />
          <button
            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              clearFile();
            }}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <>
          <p>Drag and drop a file here, or click to upload</p>
          <Input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
};

export default DragAndDropUploader;

