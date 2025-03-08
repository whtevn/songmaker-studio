import { BadgeButton } from "~/components/catalyst-theme/badge";
import { playChord } from "~/musicTheory";
import { useSongChartBuilder } from "./context";
import EnvelopeManager from "./envelopeManager";
import { useState } from "react";

export default ({ scale }) => {
  const { handleScaleDegreeClick, selectedChord, audioContext } = useSongChartBuilder();
  const [adsr, setAdsr] = useState({ attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.3 });

  const onScaleDegreeClick = (note) => {
    const { chord } = note;
    const now = audioContext.currentTime;
    const frequencies = chord.notes.map(({ render }) => ({
      velocity: 0.8,
      frequency: render.frequency,
    }));
    playChord(frequencies, audioContext, now, adsr); // Now uses the live ADSR settings
    handleScaleDegreeClick(note);
  };

  return (
    <>
      {/* Interactive ADSR Envelope Editor */}
      <div className="p-4 border rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">ADSR Envelope</h3>
        <EnvelopeManager adsr={adsr} setAdsr={setAdsr} />
        <div className="grid grid-cols-2 gap-4 mt-4">
          {["attack", "decay", "sustain", "release"].map((param) => (
            <div key={param}>
              <label className="block text-sm font-medium">{param}: {adsr[param].toFixed(2)}</label>
              <input
                type="range"
                min={param === "sustain" ? 0 : 0.05}
                max={param === "sustain" ? 1 : 2}
                step={0.05}
                value={adsr[param]}
                onChange={(e) => setAdsr({ ...adsr, [param]: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale Degree Buttons */}
      <div className="flex flex-row justify-evenly p-4">
        {scale.notes.map((note, index) => (
          <BadgeButton
            key={index}
            color={index === selectedChord?.index ? "blue" : "slate"}
            onClick={() => onScaleDegreeClick(note)}
          >
            <div className="flex flex-col">
              <span>{note.render.romanNumeral}</span>
              <span>{note.render.chordName}</span>
            </div>
          </BadgeButton>
        ))}
      </div>
    </>
  );
};

