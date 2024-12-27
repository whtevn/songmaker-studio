import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Accidental, Annotation } from "vexflow";
import scaleFinder from "../utils/scales";

const { FLAT, SHARP } = scaleFinder;

const ScaleRender = ({ scale }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    const width = 700;
    const height = 200;
    renderer.resize(width, height);

    const stave = new Stave(10, 40, width - 20);
    stave.addClef("treble").setContext(context).draw();

    let currentOctave = 4;
    let previousNote = null;

    const baseOrder = "ABCDEFG"; // Order of notes in a single octave
    const staveNotes = [];

    scale.rendered.forEach((note, index) => {
      const baseNote = note[0].toUpperCase();

      // Override for A and B to always stay in octave 4
      if (baseNote === "A" || baseNote === "B") {
        currentOctave = 4;
      } else if (previousNote) {
        const prevIndex = baseOrder.indexOf(previousNote);
        const currIndex = baseOrder.indexOf(baseNote);

        // Ascending from B to C increments the octave
        if (previousNote === "B" && baseNote === "C") {
          currentOctave++;
        }
        // Descending from C to B decrements the octave
        else if (previousNote === "C" && baseNote === "B") {
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

          if (chordIndex > 0) {
            if (chordNoteIndex < baseOrder.indexOf(baseNote)) {
              chordOctave++;
            }
          }

          if (chordBaseNote === "A" || chordBaseNote === "B") {
            chordOctave = 4;
          }

          if (chordOctave > 6) {
            chordOctave = 6;
          }

          return `${chordNote.replace(FLAT, "b").replace(SHARP, "#")}/${chordOctave}`;
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

        // Determine the chord type
        const mode = scale.mode.toLowerCase();
        let chordType = "";
        if (mode === "ionian") {
          chordType = "maj";
        } else if (mode === "aeolian") {
          chordType = "min";
        } else if (mode === "locrian") {
          chordType = "dim";
        }

        // Add annotation with the scale note and chord type
        staveNote.addModifier(
          new Annotation(`${note} ${chordType}`).setVerticalJustification(Annotation.VerticalJustify.BOTTOM),
          0
        );

        staveNotes.push(staveNote);
      } else {
        const singleNote = `${note.replace(FLAT, "b").replace(SHARP, "#")}/${currentOctave}`;

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

        // Add annotation for the single note
        staveNote.addModifier(
          new Annotation(note).setVerticalJustification(Annotation.VerticalJustify.BOTTOM),
          0
        );

        staveNotes.push(staveNote);
      }
    });

    Formatter.FormatAndDraw(context, stave, staveNotes);
  }, [scale]);

  return <div ref={containerRef}></div>;
};

export default ScaleRender;

