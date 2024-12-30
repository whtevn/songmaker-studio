import React, { useState, useRef, useEffect } from "react";
import ScaleRender from "~/components/studio/ScaleRender";
import PlayScale from "~/components/studio/PlayScale";
import { assignRandomColors } from "~/utils/colors";
import { Heading } from "~/components/catalyst-theme/heading";
import { Button } from "~/components/catalyst-theme/button";
import { Divider } from "~/components/catalyst-theme/divider";

const ScalesList = ({ scales }) => {
  const [selectedScale, setSelectedScale] = useState(null);
  const chosenScaleRef = useRef(null);

  // Scroll to the chosen scale when it changes
  useEffect(() => {
    if (selectedScale && chosenScaleRef.current) {
      chosenScaleRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedScale]);

  const handleChooseScale = (scale) => {
    setSelectedScale(scale); // Trigger the state change
  };

  return (
    <div className="list-disc pl-4">
      {/* Render the chosen scale */}
      {selectedScale && (
        <div ref={chosenScaleRef}>
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
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button
                onClick={() => {
                  setSelectedScale(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Choose Another Scale
              </Button>
                            <Button onClick={() => setSelectedScale(selectedScale)}>Start Song</Button>
                          </div>
                        </div>
          <Divider className="mb-6" />
        </div>
      )}

      {/* Render the list of scales */}
      {scales.map((scale, index) => (
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
            </div>
            <div className="flex justify-center mt-4">
              <Button onClick={() => handleChooseScale(scale)}>Choose This Scale</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScalesList;

