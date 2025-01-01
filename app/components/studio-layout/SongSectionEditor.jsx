import React from "react";
import SummarizableSection from "~/components/studio-layout/SummarizableSection";
import { Input } from "~/components/catalyst-theme/input";
import TapTempo from "~/components/studio/TapTempo";
import { Dropdown, DropdownMenu, DropdownButton, DropdownItem } from "~/components/catalyst-theme/dropdown";
import useSongInProgress from "~/stores/useSongInProgress";

const SongSectionEditor = ( {expand} ) => {
  const {
  } = useSongInProgress();

  const renderSummary = () => (
    <>
    </>
  );

  return (
    <SummarizableSection
      title="Song Section Layout"
      renderSummary={renderSummary}
      expandProp={expand}
    >
    </SummarizableSection>
  );
};

export default SongSectionEditor;

