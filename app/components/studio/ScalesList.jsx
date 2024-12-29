import React from "react";
import ScaleRender from "./ScaleRender";
import PlayScale from "./PlayScale";
import StringsRender from "./StringsRender";
import { assignRandomColors } from "../../utils/colors"; // Assuming assignRandomColors is in a utility file
import { Heading } from '../catalyst-theme/heading'

function Example() {
  return <Button>Save changes</Button>
}

const ScalesList = ({ scales }) => {
  return (
    <div className="list-disc pl-4">
      {scales.map((scale, index) => {
        // Generate random colors for all used notes
        const highlightedNotes = assignRandomColors(scale.allNotes);

        return (
          <div key={index} style={{ marginBottom: "16px" }}>
            <Heading style={{ marginBottom: "8px" }}>{scale.name}</Heading>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <div className="flex justify-center items-center">
                  <Heading style={{ color: "black" }}>{scale.degrees.map(d => d.degree).join(" - ") }</Heading>
                </div>
                <PlayScale scale={scale} />
                <ScaleRender scale={scale} />
                <StringsRender
                  tuning={["E", "A", "D", "G", "B", "E"]}
                  numFrets={12}
                  highlightedNotes={highlightedNotes}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScalesList;

