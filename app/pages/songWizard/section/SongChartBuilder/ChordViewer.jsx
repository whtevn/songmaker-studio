import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Formatter, Voice, Accidental, Annotation } from "vexflow";
import ScaleUtil from "~/utils/scales";

const ChordRender = ({ chords }) => {
  const containerRef = useRef(null);
  const { SHARP, FLAT } = ScaleUtil;

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = ""; // Clear previous render

    const containerWidth = containerRef.current.offsetWidth || 700;
    const height = 200;

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

    const staveNotes = chords.map(({ chord, label, nashville }) => {
      const staveNote = new StaveNote({
        keys: chord.map((n) => `${n.note.slice(0,1).toLowerCase()}/${n.octave}`),
        duration: "q",
      });

      // Add accidentals
      chord.forEach((note, i) => {
        const accidental = note.note.includes(FLAT) ? "b" : note.note.includes(SHARP) ? "#" : null;
        if (accidental) staveNote.addModifier(new Accidental(accidental), i);
      });


      // Add second annotation (Nashville Number)
      if (nashville) {
        staveNote.addModifier(
          new Annotation(nashville)
            .setVerticalJustification(Annotation.VerticalJustify.BOTTOM)
            .setFont("Arial", 10)
            .setYShift(15), // Moves second line lower
          0
        );
      }
      
      // Add first annotation (label)
      if (label) {
        staveNote.addModifier(
          new Annotation(label)
            .setVerticalJustification(Annotation.VerticalJustify.BOTTOM)
            .setFont("Arial", 12),
          0
        );
      }

      return staveNote;
    });

    if (staveNotes.length === 0) return;

    const voice = new Voice({ num_beats: staveNotes.length, beat_value: 4 });
    voice.addTickables(staveNotes);

    new Formatter().joinVoices([voice]).format([voice], containerWidth - 40);
    voice.draw(context, stave);
  }, [chords]);

  return <div ref={containerRef} style={{ marginTop: "16px", width: "100%", minHeight: "200px" }}></div>;
};

export default ChordRender;

