import React from "react";
import ScaleFinder from "../../utils/scales";
import { Button } from '../catalyst-theme/button'

const { scaleToNotation, calculateFrequency } = ScaleFinder;

const playNotes = (notes, audioContext) => {
  const startTime = audioContext.currentTime;

  notes.forEach((noteOrChord, index) => {
    if (Array.isArray(noteOrChord.keys)) {
      // Chord: play all notes simultaneously
      noteOrChord.keys.forEach((note) => {
        const frequency = calculateFrequency(note);
        playSound(frequency, audioContext, startTime + index * 0.5); // Offset by 0.5s
      });
    } else {
      // Single note: play one note
      const frequency = calculateFrequency(noteOrChord.keys[0]);
      playSound(frequency, audioContext, startTime + index * 0.5);
    }
  });
};

const playSound = (frequency, audioContext, startTime) => {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine"; // You can use other types like "square", "triangle", etc.
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gainNode.gain.setValueAtTime(0.2, startTime); // Adjust volume
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4); // Fade out

  oscillator.connect(gainNode).connect(audioContext.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.5); // Note duration
};

const ScalePlayback = ({ scale }) => {
  const handlePlayScale = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const notes = scaleToNotation(scale); // Convert scale to notation
    playNotes(notes, audioContext); // Play the notes
  };

  return (
    <Button onClick={handlePlayScale} style={{ marginTop: "16px" }}>
      Play Scale
    </Button>
  );
};

export default ScalePlayback;

