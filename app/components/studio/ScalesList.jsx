import React, { useState } from "react";
import ScaleRender from "./ScaleRender";
import PlayScale from "./PlayScale";
import StringsRender from "./StringsRender";
import { assignRandomColors } from "../../utils/colors"; // Assuming assignRandomColors is in a utility file
import { Heading } from "../catalyst-theme/heading";
import { Button } from "../catalyst-theme/button";
import { Divider } from "../catalyst-theme/divider";

const ScalesList = ({ scales, chordFormulas, extensions }) => {
  const [selectedScale, setSelectedScale] = useState(null);

  return (
    <div className="list-disc pl-4">
      {/* Render the chosen scale */}
      {selectedScale && (
        <>
          <Heading style={{ marginBottom: "8px" }}>Chosen Scale</Heading>
          <Heading style={{ marginBottom: "8px" }}>{selectedScale.name}</Heading>
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
              marginBottom: "16px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div className="flex justify-center items-center">
                <Heading style={{ color: "black" }}>
                  {selectedScale.degrees.map((d) => d.degree).join(" - ")}
                </Heading>
              </div>
              <PlayScale scale={selectedScale} />
              <ScaleRender scale={selectedScale} />
            </div>
          </div>
          <Divider className="mb-6"/>
        </>
      )}

      {/* Render the list of scales */}
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
                  <Heading style={{ color: "black" }}>
                    {scale.degrees.map((d) => d.degree).join(" - ")}
                  </Heading>
                </div>
                <PlayScale scale={scale} />
                <ScaleRender scale={scale} />
                <StringsRender
                  tuning={["E", "A", "D", "G", "B", "E"]}
                  numFrets={12}
                  highlightedNotes={highlightedNotes}
                />
              </div>
              <div className="flex justify-center mt-4">
                <Button onClick={() => setSelectedScale(scale)}>
                  Choose This Scale
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScalesList;

