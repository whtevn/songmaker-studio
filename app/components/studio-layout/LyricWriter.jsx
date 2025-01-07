import React, { useState } from "react";
import SummarizableSection from "~/components/studio-layout/SummarizableSection";
import useSongInProgress from "~/stores/useSongInProgress";
import { Textarea } from "~/components/catalyst-theme/textarea";
import { Button } from "~/components/catalyst-theme/button";

const CreateLyrics = ({ expand }) => {
  const { lyrics, setLyrics } = useSongInProgress();
  const [showFull, setShowFull] = React.useState(false);

  // Function to show the first 3 lines of lyrics

  return (
    <Textarea
      value={lyrics}
      onChange={(e) => setLyrics(e.target.value)}
      placeholder="Write your lyrics here..."
      rows={50}
      className="w-full mt-2"
    />
  );
};

export default CreateLyrics;

