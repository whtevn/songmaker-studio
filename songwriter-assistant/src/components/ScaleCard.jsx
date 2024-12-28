import React from "react";
import ScaleRender from "./ScaleRender";
import StringsRender from "./StringsRender";
import { assignRandomColors } from "../utils/colors";
import Card from "./Card";

const ScaleCard = ({ scale }) => {
  const highlightedNotes = assignRandomColors(scale.allNotes);

  return (
    <Card title={scale.name} toggleable={true}>
      <div style={{ marginBottom: "16px" }}>
        <ScaleRender scale={scale} />
      </div>
      <StringsRender
        tuning={["E", "A", "D", "G", "B", "E"]}
        numFrets={12}
        highlightedNotes={highlightedNotes}
      />
    </Card>
  );
};

export default ScaleCard;
