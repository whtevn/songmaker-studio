import React, { useRef, useState } from "react";
import { PencilIcon } from "@heroicons/react/16/solid";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import DefaultAlbumIcon from "~/components/common/defaultAlbumIcon";

const AlbumCoverEditor = ({ album, onUpdateImage }) => {
  const fileInputRef = useRef(null); // Reference to the hidden file input

  const handleEditClick = () => {
    fileInputRef.current.click(); // Simulate a click on the file input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleImageUpload(droppedFile);
    }
  };

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
      onUpdateImage(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="h-[100px] w-[100px]"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {album.image ? (
        <img
          src={album.image}
          alt={`${album.name} Artwork`}
          className="object-cover rounded-md mx-auto h-full w-full"
        />
      ) : (
        <DefaultAlbumIcon className="mx-auto text-gray-400" />
      )}

      <div className="bottom-2 flex flex-col items-center gap-1">
        <BadgeButton onClick={handleEditClick} className="text-xs">
          <PencilIcon className="h-3 w-3" />
          Edit Cover
        </BadgeButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default AlbumCoverEditor;

