import React, { useState } from "react";
import { Input } from "~/components/catalyst-theme/input";
import { Button } from "~/components/catalyst-theme/button";
import { Heading } from "~/components/catalyst-theme/heading";
import TapTempo from "~/components/studio/TapTempo";
import { Dropdown, DropdownMenu, DropdownButton, DropdownItem } from "~/components/catalyst-theme/dropdown";
import useSongInProgress from "~/stores/useSongInProgress";
import { PencilSquareIcon, XMarkIcon, CheckIcon} from "@heroicons/react/16/solid";
import ScaleFinder from "~/utils/scales";

const CreateSong = ({ nameOnly = false }) => {
  const {
    title,
    tempo,
    timeSignature,
    key,
    setTitle,
    setTempo,
    setTimeSignature,
    setKey,
  } = useSongInProgress();

  const { notes, modes } = ScaleFinder;

  const [isEditing, setIsEditing] = useState(false);
  const [tempState, setTempState] = useState({ title, key, timeSignature, tempo });

  const handleSave = () => {
    setTitle(tempState.title);
    setKey(tempState.key);
    setTimeSignature(tempState.timeSignature);
    setTempo(tempState.tempo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempState({ title, key, timeSignature, tempo });
    setIsEditing(false);
  };

  return (
    <>
      <Heading className="my-2 flex flex-row gap-2 items-center">
        {!isEditing ? (
          <>
            <span>{title || "Untitled"}</span>
            <Button plain onClick={() => setIsEditing(true)}>
              <PencilSquareIcon className="h-6 w-6" />
            </Button>
          </>
        ) : (
          <>
            <Input
              value={tempState.title}
              onChange={(e) => setTempState({ ...tempState, title: e.target.value })}
              placeholder="Enter title"
            />
            <Button plain onClick={handleCancel}>
              <XMarkIcon className="h-6 w-6" />
            </Button>
            { nameOnly &&
              <Button plain onClick={handleSave}>
                <CheckIcon className="h-6 w-6" />
              </Button>
            } 
          </>
        )}
      </Heading>

      {/* Render additional fields only when nameOnly is false */}
      {!nameOnly && (
        <>
          <div className="flex flex-col sm:flex-row justify-between mx-8">
            <div className="flex flex-row sm:flex-col gap-2">
              <strong>Key:</strong>
              {!isEditing ? (
                <div>{key.root} {key.mode}</div>
              ) : (
                <>
                  <Dropdown>
                    <DropdownButton>{tempState.key.root || "Root"}</DropdownButton>
                    <DropdownMenu>
                      {notes.map((note) => (
                        <DropdownItem
                          key={note.labels[0]}
                          onClick={() => setTempState({ ...tempState, key: { ...tempState.key, root: note.labels[0] } })}
                        >
                          {note.labels[0]}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                  <Dropdown>
                    <DropdownButton>{tempState.key.mode || "Mode"}</DropdownButton>
                    <DropdownMenu>
                      {modes.map((mode) => (
                        <DropdownItem
                          key={mode.label}
                          onClick={() => setTempState({ ...tempState, key: { ...tempState.key, mode: mode.label } })}
                        >
                          {mode.label}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </>
              )}
            </div>

            <div className="flex flex-row sm:flex-col gap-2">
              <strong>Time Signature:</strong>
              {!isEditing ? (
                <div>{timeSignature}</div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={tempState.timeSignature.split("/")[0]}
                    onChange={(e) =>
                      setTempState({
                        ...tempState,
                        timeSignature: `${e.target.value}/${tempState.timeSignature.split("/")[1]}`,
                      })
                    }
                    className="w-16"
                  />
                  <Dropdown>
                    <DropdownButton>{tempState.timeSignature.split("/")[1]}</DropdownButton>
                    <DropdownMenu>
                      {["2", "4", "8"].map((value) => (
                        <DropdownItem
                          key={value}
                          onClick={() =>
                            setTempState({
                              ...tempState,
                              timeSignature: `${tempState.timeSignature.split("/")[0]}/${value}`,
                            })
                          }
                        >
                          {value}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </div>

            <div className="flex flex-row sm:flex-col gap-2">
              <strong>Tempo:</strong>
              {!isEditing ? (
                <>{tempo} BPM</>
              ) : (
                <TapTempo tempo={tempState.tempo} setTempo={(value) => setTempState({ ...tempState, tempo: value })} />
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-2 justify-end mt-4">
              <Button onClick={handleSave} className="bg-green-500 text-white">
                Save
              </Button>
              <Button onClick={handleCancel} className="bg-gray-500 text-white">
                Cancel
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CreateSong;

