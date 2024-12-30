import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice, Accidental, Annotation } from "vexflow";
import scaleFinder from "../../utils/scales";

const { scaleToNotation } = scaleFinder;

const ScaleRender = ({ scale, degree = null, onNoteClick = () => {} }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const render = () => {
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

      // Process the scale with `scaleToNotation`
      const staveNotesData = scaleToNotation(scale);

      // Determine if rendering a specific degree or the full scale
      let staveNotes = [];
      if (degree !== null) {
        // Find the corresponding degree
        const targetDegree = scale.degrees.find((deg) => deg.degree === degree);

        if (targetDegree) {
          // Render the chord for the degree
          staveNotes = targetDegree.chord.flatMap((chordNote) =>
            createStaveNote([`${chordNote}/4`], "q")
          );
        } else {
          // Fall back to rendering the note at the specified degree index in the scale
          const noteIndex = degree - 1; // Convert 1-based degree to 0-based index
          const fallbackNote = scale.rendered[noteIndex];

          if (fallbackNote) {
            staveNotes = [createStaveNote([`${fallbackNote}/4`], "q")];
          } else {
            console.warn(`Degree ${degree} not found, and no fallback note available.`);
            staveNotes = [];
          }
        }

      } else {
        // Render the entire scale
        staveNotes = staveNotesData
          .map(({ keys, duration, label }) => createStaveNote(keys, duration, label))
          .filter(Boolean); // Ensure only valid stave notes
      }

      if (staveNotes.length === 0) {
        console.warn("No valid stave notes to render.");
        return;
      }

      // Create a Voice and add the stave notes to it
      const voice = new Voice({ num_beats: staveNotes.length, beat_value: 4 });
      voice.addTickables(staveNotes);

      // Format the notes and draw them on the stave
      new Formatter().joinVoices([voice]).format([voice], containerWidth - 40);
      voice.draw(context, stave);

      // Attach click handlers after drawing
      staveNotes.forEach((staveNote, index) => {
        const noteElement = document.querySelector(`#vf-${staveNote.attrs.id}`);
        if (noteElement) {
          noteElement.addEventListener("click", () =>
            onNoteClick({
              keys: staveNotes[index].keys,
              label: staveNotes[index].label,
              index,
            })
          );
        }
      });
    };

    if (scale) {
      render();
    }
  }, [scale, degree]);

  // Helper function to create stave notes
  const createStaveNote = (keys, duration, label = null) => {
    if (!keys || keys.length === 0) {
      console.error("Invalid keys:", keys);
      return null; // Skip invalid notes
    }

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
  };

  return (
    <div
      ref={containerRef}
      style={{ marginTop: "16px", width: "100%", minHeight: "200px" }}
    ></div>
  );
};

export default ScaleRender;

