import React, { useState } from "react";
import { Fieldset, Field } from "~/components/catalyst-theme/fieldset";
import { Button } from "~/components/catalyst-theme/button";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
} from "~/components/catalyst-theme/pagination";
import {
  StarIcon,
  PencilSquareIcon,
  XMarkIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/16/solid";

const ITEMS_PER_PAGE = 3;

const VersionSelector = ({ lyricVersions, store }) => {
  const {
    addVersion,
    lyrics,
    setLyrics,
    setLyricVersion,
    getLyricVersion,
    deleteLyricVersion,
  } = store;

  const [currentPage, setCurrentPage] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [tempVersionName, setTempVersionName] = useState("");

  const paginatedVersions = lyricVersions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleAddVersion = () => {
    addVersion(lyrics);
  };

  const handleEdit = (id) => {
    setEditingId(id);
    const version = getLyricVersion(id);
    setTempVersionName(version?.name || "");
  };

  const handleSave = (id) => {
    setLyricVersion({ id, name: tempVersionName });
    setEditingId(null);
    setTempVersionName("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempVersionName("");
  };

  const handleDelete = (id) => {
    deleteLyricVersion(id);
    setConfirmDeleteId(null);
  };

  const handleGotoNext = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < lyricVersions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleGotoPrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Fieldset>
        <Field>
          {paginatedVersions.map((version) => (
            <VersionItem
              key={version.id}
              version={version}
              editingId={editingId}
              confirmDeleteId={confirmDeleteId}
              store={store}
              tempVersionName={tempVersionName}
              setTempVersionName={setTempVersionName}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              handleDelete={handleDelete}
              setConfirmDeleteId={setConfirmDeleteId}
            />
          ))}
        </Field>
      </Fieldset>

      {lyricVersions.length > ITEMS_PER_PAGE && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationPrevious
            onClick={handleGotoPrevious}
            disabled={currentPage === 0}
          >
            Previous
          </PaginationPrevious>
          <PaginationNext
            onClick={handleGotoNext}
            disabled={(currentPage + 1) * ITEMS_PER_PAGE >= lyricVersions.length}
          >
            Next
          </PaginationNext>
        </Pagination>
      )}
    </>
  );
};

const VersionItem = ({
  version,
  editingId,
  confirmDeleteId,
  store,
  tempVersionName,
  setTempVersionName,
  handleEdit,
  handleSave,
  handleCancel,
  handleDelete,
  setConfirmDeleteId,
}) => {
  const { lyrics, setLyrics } = store;
  const isEditing = editingId === version.id;
  const isConfirmingDelete = confirmDeleteId === version.id;
  const isCurrent = lyrics === version.lyrics;

  return (
    <div className="flex items-center border-b border-slate-600">
      <div
        className={`flex items-center justify-between w-full gap-2 p-2 ${
          isConfirmingDelete ? "bg-slate-600" : ""
        }`}
       >
        <div
          className="flex-grow flex items-center gap-2 cursor-pointer min-w-[200px]"
          onClick={() => !isEditing && !isConfirmingDelete && setLyrics(version.lyrics)}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            {isCurrent && <StarIcon className="h-4 w-4 text-yellow-500" />}
          </div>
          {!isEditing ? (
            <span className="truncate p-1">{version.name}</span>
          ) : (
            <input
              value={tempVersionName}
              onChange={(e) => setTempVersionName(e.target.value)}
              className="bg-gray-700 border border-slate-500 rounded-md p-1 text-white"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel}>
                <XMarkIcon className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleSave(version.id)} color="blue">
                <CheckIcon className="h-4 w-4" />
              </Button>
            </>
          ) : isConfirmingDelete ? (
            <>
              <Button onClick={() => setConfirmDeleteId(null)} color="blue">
                <XMarkIcon className="h-4 w-4" />
              </Button>
              <Button onClick={() => handleDelete(version.id)} color="red">
                <TrashIcon className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button plain onClick={() => handleEdit(version.id)}>
                <PencilSquareIcon className="h-4 w-4" />
              </Button>
              <Button
                plain
                onClick={() => setConfirmDeleteId(version.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionSelector;

