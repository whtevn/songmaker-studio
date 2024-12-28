import React from "react";
import ScaleRender from "./ScaleRender";
import StringsRender from "./StringsRender";
import { assignRandomColors } from "../utils/colors"; // Assuming assignRandomColors is in a utility file

const ScalesList = ({ scales }) => {
  return (
    <div className="list-disc pl-4">
      {scales.map((scale, index) => {
        // Generate random colors for all used notes
        const highlightedNotes = assignRandomColors(scale.allNotes);

        return (
          <div key={index} style={{ marginBottom: "16px" }}>
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3 style={{ marginBottom: "8px" }}>{scale.name}</h3>
              <div style={{ marginBottom: "16px" }}>
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

