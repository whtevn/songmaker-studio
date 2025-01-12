import React, { useState } from "react";
import { Fieldset, Field } from "~/components/catalyst-theme/fieldset";
import { Input } from "~/components/catalyst-theme/input";
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

const VersionSelector = ({ store }) => {
  const { addVersion, lyricVersions, lyrics, setLyrics, setLyricVersion, deleteLyricVersion } = store;

  const [currentPage, setCurrentPage] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [tempVersionName, setTempVersionName] = useState("");

  const paginatedVersions = lyricVersions.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleAddVersion = () => {
    addVersion(lyrics);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempVersionName(lyricVersions[index].name);
  };

  const handleSave = (index) => {
    const updatedVersion = { ...lyricVersions[index], name: tempVersionName };
    setLyricVersion(updatedVersion);
    setEditingIndex(null);
    setTempVersionName("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempVersionName("");
  };

  const handleDelete = (id) => {
    deleteLyricVersion(id);
    setConfirmDeleteIndex(null);
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
          {paginatedVersions.map((version, index) => {
            const globalIndex = currentPage * ITEMS_PER_PAGE + index;

            return (
              <div key={version.id} className="flex items-center border-b border-slate-600">
                {editingIndex === globalIndex ? (
                  <div className="p-2 flex items-center justify-between w-full">
                    <Field className="w-full mr-2">
                      <Input
                        value={tempVersionName}
                        onChange={(e) => setTempVersionName(e.target.value)}
                      />
                    </Field>
                    <div className="flex items-center gap-2">
                      <Button onClick={() => handleSave(globalIndex)} className="cursor-pointer">
                        <CheckIcon className="h-5 w-5" />
                      </Button>
                      <Button onClick={handleCancel} className="cursor-pointer">
                        <XMarkIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`text-sm flex items-center justify-between w-full p-2 rounded-md ${
                      confirmDeleteIndex === globalIndex ? "bg-slate-600" : ""
                    }`}
                  >
                    <div className="max-w-[200px] flex-shrink-0 items-center flex flex-row gap-2">
                      {lyrics === version.lyrics && <StarIcon className="h-4 w-4 text-yellow-500" />}
                      <span
                        className="truncate overflow-hidden text-ellipsis cursor-pointer text-small"
                        onClick={() => setLyrics(version.lyrics)}
                      >
                        {version.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {confirmDeleteIndex !== globalIndex && (
                        <Button plain onClick={() => handleEdit(globalIndex)} className="cursor-pointer">
                          <PencilSquareIcon className="h-4 w-4 text-gray-500" />
                        </Button>
                      )}
                      {confirmDeleteIndex === globalIndex ? (
                        <div className="flex items-center gap-2">
                          <Button
                            color="blue"
                            onClick={() => setConfirmDeleteIndex(null)}
                            className="cursor-pointer"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            color="red"
                            onClick={() => handleDelete(version.id)}
                            className="cursor-pointer"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          plain
                          onClick={() => setConfirmDeleteIndex(globalIndex)}
                          className="cursor-pointer"
                        >
                          <TrashIcon className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </Field>
      </Fieldset>

      {lyricVersions.length > ITEMS_PER_PAGE && (
        <Pagination className="mt-4 flex justify-center">
          <PaginationPrevious onClick={handleGotoPrevious} disabled={currentPage === 0}>
            Previous
          </PaginationPrevious>
          <PaginationNext
            onClick={handleGotoNext}
          >
            Next
          </PaginationNext>
        </Pagination>
      )}
    </>
  );
};

export default VersionSelector;

