import React, { useState } from "react";
import SongSectionEditor from "~/components/studio-layout/SongSectionEditor";
import SongChartBuilder from "~/components/studio-layout/SongChartBuilder";
import LyricWriter from "~/components/studio-layout/LyricWriter";
import useSongInProgress from "~/stores/useSongInProgress";
import { Badge } from "~/components/catalyst-theme/badge";
import { Button } from "~/components/catalyst-theme/button";
import { Heading } from "~/components/catalyst-theme/heading";
import { Input } from "~/components/catalyst-theme/input";
import { PencilSquareIcon, XMarkIcon, CheckIcon} from "@heroicons/react/16/solid";


export function SongWizard() {
  const store = useSongInProgress();
  const tabs = [
    { id: "lyrics", label: "Write Lyrics", component: <LyricWriter /> },
    { id: "sections", label: "Layout Song", component: <SongSectionEditor /> },
    { id: "music", label: "Build Music", component: <SongChartBuilder store={ store } /> },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const renderActiveTabContent = () => {
    const active = tabs.find((tab) => tab.id === activeTab);
    return active?.component || null;
  };

  const {
    title,
    setTitle,
  } = store;

  const [isEditing, setIsEditing] = useState(false);
  const [tempState, setTempState] = useState({ title });

  const handleSave = () => {
    setTitle(tempState.title);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempState({ title });
    setIsEditing(false);
  };

  return (
    <>
      {!isEditing ? (
        <Heading className="border-b pb-4">
          <span className="text-ellipsis overflow-hidden">{title || "Untitled"}</span>
          <Button plain onClick={() => setIsEditing(true)}>
            <PencilSquareIcon className="h-6 w-6" />
          </Button>
        </Heading>
      ) : (
        <div className="flex flex-row border-b pb-4">
          <Input
            value={tempState.title}
            onChange={(e) => setTempState({ ...tempState, title: e.target.value })}
            placeholder="Enter title"
          />
          <Button plain onClick={handleCancel}>
            <XMarkIcon className="h-6 w-6" />
          </Button>
          <Button plain onClick={handleSave}>
            <CheckIcon className="h-6 w-6" />
          </Button>
        </div>
      )}
          <div className="flex mb-4 justify-end">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-gray-300 text-black rounded-b-lg"
                    : "text-gray-600 hover:text-gray-400"
                }`}
              >
              <div>
                {tab.label}
              </div>
              </button>
            ))}
          </div>
    <div>{renderActiveTabContent()}</div>
  </>
  );
}

export default SongWizard;

