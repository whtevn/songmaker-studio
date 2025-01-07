import React, { useState } from "react";
import SongDefinition from "~/components/studio-layout/SongDefinition";
import SongSectionEditor from "~/components/studio-layout/SongSectionEditor";
import SongChartBuilder from "~/components/studio-layout/SongChartBuilder";
import LyricWriter from "~/components/studio-layout/LyricWriter";
import useSongInProgress from "~/stores/useSongInProgress";
import { Badge } from "~/components/catalyst-theme/badge";
import { Button } from "~/components/catalyst-theme/button";


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



  return (
    <div className="p-4">
      <div className="flex mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
          <Badge>
            {tab.label}
          </Badge>
          </button>
        ))}
      </div>
      {/* Song Definition */}
      <SongDefinition nameOnly={activeTab != "sections"}/>

      {/* Tab Navigation */}

      {/* Active Tab Content */}
      <div className="mt-4">{renderActiveTabContent()}</div>
    </div>
  );
}

export default SongWizard;

