import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Accidental, Annotation } from "vexflow";

import scaleFinder from "../../utils/scales";

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

      let currentOctave = 4;
      let previousNote = null;

      const baseOrder = "ABCDEFG";
      const staveNotes = [];

      scale.rendered.forEach((note, index) => {
        const baseNote = note[0].toUpperCase();

        if (baseNote === "A" || baseNote === "B") {
          currentOctave = 4;
        } else if (previousNote) {
          const prevIndex = baseOrder.indexOf(previousNote);
          const currIndex = baseOrder.indexOf(baseNote);

          if (previousNote === "B" && baseNote === "C") {
            currentOctave++;
          } else if (previousNote === "C" && baseNote === "B") {
            currentOctave--;
          }
        }

        previousNote = baseNote;

        const degree = scale.degrees.find((deg) => deg.degree === index + 1);

        if (degree) {
          const chordNotes = degree.chord.flat().map((chordNote, chordIndex) => {
            const chordBaseNote = chordNote[0].toUpperCase();
            const chordNoteIndex = baseOrder.indexOf(chordBaseNote);

            let chordOctave = currentOctave;
            if (chordIndex > 0 && chordNoteIndex < baseOrder.indexOf(baseNote)) {
              chordOctave++;
            }

            if (chordBaseNote === "A" || chordBaseNote === "B") {
              chordOctave = 4;
            }

            return `${chordNote.replace(scaleFinder.FLAT, "b").replace(scaleFinder.SHARP, "#")}/${chordOctave}`;
          });

          const staveNote = new StaveNote({
            keys: chordNotes,
            duration: "q",
          });

          chordNotes.forEach((chordNote, i) => {
            const accidental = chordNote.includes("b")
              ? "b"
              : chordNote.includes("#")
              ? "#"
              : null;

            if (accidental) {
              staveNote.addModifier(new Accidental(accidental), i);
            }
          });

          const chordLabel = `${note} ${degree.name.split(" ")[1]}`;
          staveNote.addModifier(
            new Annotation(chordLabel).setVerticalJustification(Annotation.VerticalJustify.BOTTOM),
            0
          );

          staveNotes.push(staveNote);
        } else {
          const singleNote = `${note.replace(scaleFinder.FLAT, "b").replace(scaleFinder.SHARP, "#")}/${currentOctave}`;
          const staveNote = new StaveNote({
            keys: [singleNote],
            duration: "q",
          });

          const accidental = singleNote.includes("b")
            ? "b"
            : singleNote.includes("#")
            ? "#"
            : null;

          if (accidental) {
            staveNote.addModifier(new Accidental(accidental), 0);
          }

          staveNote.addModifier(
            new Annotation(note).setVerticalJustification(Annotation.VerticalJustify.BOTTOM),
            0
          );

          staveNotes.push(staveNote);
        }
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

