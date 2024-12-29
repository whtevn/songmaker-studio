import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Accidental, Annotation } from "vexflow";
import scaleFinder from "../../utils/scales";

const { scaleToNotation } = scaleFinder

const ScaleRender = ({ scale }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const renderScale = () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""; // Clear previous render
      }

      const containerWidth = containerRef.current.offsetWidth || 700; // Fallback width
      const height = 200; // Fixed height

      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(containerWidth, height);

      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        svg.setAttribute("viewBox", `0 0 ${containerWidth} ${height}`);
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.width = "100%";
        svg.style.height = "auto";
      }

      const context = renderer.getContext();

      const stave = new Stave(10, 40, containerWidth - 20);
      stave.addClef("treble").setContext(context).draw();

      // Use the `scaleToNotation` function to get stave notes
      const staveNotesData = scaleToNotation(scale);

      const staveNotes = staveNotesData.map(({ keys, duration, label }) => {
        const staveNote = new StaveNote({
          keys,
          duration,
        });

        keys.forEach((key, i) => {
          const accidental = key.includes("b")
            ? "b"
            : key.includes("#")
            ? "#"
            : null;

          if (accidental) {
            staveNote.addModifier(new Accidental(accidental), i);
          }
        });

        if (label) {
          staveNote.addModifier(
            new Annotation(label).setVerticalJustification(Annotation.VerticalJustify.BOTTOM),
            0
          );
        }

        return staveNote;
      });

      Formatter.FormatAndDraw(context, stave, staveNotes);
    };

    if (scale) {
      renderScale();
    }
  }, [scale]);

  return (
    <div
      ref={containerRef}
      style={{ marginTop: "16px", width: "100%", minHeight: "200px" }}
    ></div>
  );
};

export default ScaleRender;

