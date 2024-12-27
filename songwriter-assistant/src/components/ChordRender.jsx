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
    // Create a stave for the chord
    const yOffset = heightPerChord;
    const stave = new Stave(10, 0, width - 20);
    stave.addClef("treble").setContext(context).draw();
    const staveNotes = degrees.map((degree, index) => {


      // Flatten the chord and map it to VexFlow keys
      const chordNotes = degree.chord.flat().map((note) =>
        `${note
          .replace(FLAT, "b") // Replace FLAT with @
          .replace(SHARP, "#")}/4` // Replace SHARP with #
      );


      try {
        return new StaveNote({
          keys: chordNotes, // Correctly formatted keys
          duration: "q", // Quarter note
        });

      } catch (error) {
        console.error("Error rendering chord:", error, "Chord Notes:", chordNotes);
      }
    });
    // Format and draw the chords
    Formatter.FormatAndDraw(context, stave, staveNotes);
  }, [degrees]);

  return <div ref={containerRef}></div>;
};

export default ChordRender;

