import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import SongTimeline from "~/components/studio/SongTimelineMini";
import LyricDisplay from "~/components/studio-layout/LyricDisplay";
import { Button } from "~/components/catalyst-theme/button";

const TimelineLyricAssemble = ( { store }) => {

  const durationInSeconds =  store.getSongDuration()
  const minutes = Math.floor(durationInSeconds / 60)
  const seconds = Math.ceil(durationInSeconds % 60)

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-end">
        <p>Estimated Length: { `${minutes} m ${seconds} s` }</p>
      </div>
      <div className="flex gap-8 p-4 flex-col">
        <div>
          <SongTimeline store={store} showSummary={true} />
        </div>
        <div>
          <LyricDisplay text={store.lyrics} />
        </div>
      </div>
    </DndProvider>
  );
};

export default TimelineLyricAssemble;

