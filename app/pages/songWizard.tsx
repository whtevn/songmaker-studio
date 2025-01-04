import React, { useState, cloneElement } from "react";
import SongDefinition from "~/components/studio-layout/SongDefinition";
import SongSectionEditor from "~/components/studio-layout/SongSectionEditor";
import LyricWriter from "~/components/studio-layout/LyricWriter";

export function SongWizard({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SongDefinition expand={false} />
      <LyricWriter expand={false} />
      <SongSectionEditor expand={true} />
    </div>
  );
}

export default SongWizard;

