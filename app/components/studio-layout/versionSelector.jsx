import React, { useState } from "react";
import { Fieldset, Field, Label } from "~/components/catalyst-theme/fieldset";
import { Heading } from "~/components/catalyst-theme/heading";
import { Input } from "~/components/catalyst-theme/input";
import { Button } from "~/components/catalyst-theme/button";
import { StarIcon, PencilSquareIcon, XMarkIcon, TrashIcon, CheckIcon } from "@heroicons/react/16/solid";

const VersionSelector = ({ store }) => {
  console.log(store)
  const {  addVersion, lyricVersions, lyrics, setLyrics, setLyricVersion, deleteLyricVersion } = store;
  const [editingIndex, setEditingIndex] = useState(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const [tempVersionName, setTempVersionName] = useState("");

  const handleEdit = (index) => {
    setEditingIndex(index);
    setTempVersionName(lyricVersions[index].name); // Set temp name to current name
  };

  const handleSave = (index) => {
    const updatedVersion = { ...lyricVersions[index], name: tempVersionName };
    setLyricVersion(updatedVersion); // Save updated version
    setEditingIndex(null);
    setTempVersionName("");
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setTempVersionName("");
  };

  const handleDelete = (id) => {
    deleteLyricVersion(id); // Delete the version
    setConfirmDeleteIndex(null)
  };

  const handleAddVersion = () => {
    addVersion(lyrics); // Save the current lyrics as a new version
  };

  return (
    <>
    <Heading className="mb-2"><span className="text-slate-400">Snapshot History</span></Heading>
    <Fieldset>
      <Field className="mb-4">
        {lyricVersions.map((version, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            {editingIndex === index ? (
              <div className="flex items-center justify-between w-full">
                <Field className="w-full mr-2">
                  <Input
                    value={tempVersionName}
                    onChange={(e) => setTempVersionName(e.target.value)}
                  />
                </Field>
                <div className="flex items-center gap-2">
                  <Button
                    className="bg-green-500 text-white"
                    onClick={() => handleSave(index)}
                    className="cursor-pointer"
                  >
                    <CheckIcon className="h-5 w-5" />
                  </Button>
                  <Button
                    className="bg-gray-500 text-white"
                    onClick={handleCancel}
                    className="cursor-pointer"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-between w-full p-2 rounded-md ${confirmDeleteIndex===index ? "bg-slate-600" : ""}`}>
                <div className=" max-w-[200px] flex-shrink-0 items-center flex flex-row gap-2">
                  { lyrics === version.lyrics && <StarIcon className="h-4 w-4 text-yellow-500" /> }
                  <span className="truncate overflow-hidden text-ellipsis cursor-pointer text-underline"
                  onClick={()=>setLyrics(version.lyrics)} >{version.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {confirmDeleteIndex !== index && (
                  <Button
                    plain
                    onClick={() => handleEdit(index)}
                    className="cursor-pointer"
                  >
                    <PencilSquareIcon className="h-3 w-3 text-gray-500" />
                  </Button>
                  )}
                  {confirmDeleteIndex === index ? (
                    <div className="flex items-center gap-2">
                      <Button
                        color="blue"
                        onClick={() => setConfirmDeleteIndex(null)}
                        className="cursor-pointer"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        color="red"
                        onClick={() => handleDelete(version.id)}
                        className="cursor-pointer"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      plain
                      onClick={() => setConfirmDeleteIndex(index)}
                      className="cursor-pointer"
                    >
                      <TrashIcon className="h-3 w-3 text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </Field>
    </Fieldset>
    </>
  );
};

export default VersionSelector;

