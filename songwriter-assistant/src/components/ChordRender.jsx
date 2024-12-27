import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter } from "vexflow";
import scaleFinder from "../utils/scales";

const { FLAT, SHARP } = scaleFinder;

const ChordRender = ({ degrees }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear any existing rendering
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    // Create a VexFlow renderer
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    const width = 500;
    const heightPerChord = 150;
    renderer.resize(width, degrees.length * heightPerChord);

    // Render each degree's chord on its own staff
    degrees.forEach((degree, index) => {
      const yOffset = index * heightPerChord;

      // Create a stave for the chord
      const stave = new Stave(10, yOffset + 40, width - 20);
      stave.addClef("treble").setContext(context).draw();

      // Flatten the chord and map it to VexFlow keys
      const chordNotes = degree.chord
        .flat()
        .map((note) =>
        `${note
          .toLowerCase()
          .replace(/\${FLAT}/g, "@") // Replace ${FLAT} with @
          .replace(/\${SHARP}/g, "#")}/4` // Replace ${SHARP} with #
       );

      const staveNote = new StaveNote({
        keys: chordNotes,
        duration: "q", // Quarter note
      });

      // Format and draw the chord
      Formatter.FormatAndDraw(context, stave, [staveNote]);
    });
  }, [degrees]);

  return <div ref={containerRef}></div>;
};

export default ChordRender;

