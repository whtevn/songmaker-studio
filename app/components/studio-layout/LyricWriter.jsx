import React, { useState } from "react";
import SummarizableSection from "~/components/studio-layout/SummarizableSection";
import useSongInProgress from "~/stores/useSongInProgress";
import { Textarea } from "~/components/catalyst-theme/textarea";
import { Button } from "~/components/catalyst-theme/button";

const CreateLyrics = ({ expand }) => {
  const { lyrics, setLyrics } = useSongInProgress();
  const [showFull, setShowFull] = React.useState(false);

  // Function to show the first 3 lines of lyrics
  const renderSummary = () => {
    const lines = lyrics ? lyrics.split("\n") : [];
    const summary = lines.slice(0, 3).join("\n");
    const hasMore = lines.length > 3;

    const toggleShowFullLyrics = () => {
      setShowFull(!showFull);
    };

    return (
      <>
        <p className="whitespace-pre-line">
          {lines.length === 0 ? "Add lyrics..." : showFull ? lyrics : summary}
        </p>
        {hasMore && (
          <Button onClick={toggleShowFullLyrics} plain>
            Show {showFull ? "less" : "more"}...
          </Button>
        )}
      </>
    );
  };

  return (
    <SummarizableSection
      title="Lyrics"
      renderSummary={renderSummary}
      expandProp={expand}
      allowContinue={false}
    >
      <Textarea
        value={lyrics}
        onChange={(e) => setLyrics(e.target.value)}
        placeholder="Write your lyrics here..."
        rows={10}
        className="w-full mt-2"
      />
    </SummarizableSection>
  );
};

export default CreateLyrics;

