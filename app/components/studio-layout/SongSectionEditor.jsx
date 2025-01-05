import React, { useState } from "react";
import SummarizableSection from "~/components/studio-layout/SummarizableSection";
import SongTimeline from "~/components/studio/SongTimeline";
import LyricDisplay from "~/components/studio-layout/LyricDisplay";
import { Input } from "~/components/catalyst-theme/input";
import { Button } from "~/components/catalyst-theme/button";
import { DropdownMenu, DropdownItem } from "~/components/catalyst-theme/dropdown";
import useSongInProgress from "~/stores/useSongInProgress";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { DndProvider } from 'react-dnd'


const chordFormulas = {
  major: ["root", "major3rd", "perfect5th"],
  minor: ["root", "minor3rd", "perfect5th"],
  diminished: ["root", "minor3rd", "diminished5th"],
  sus2: ["root", "major2nd", "perfect5th"],
  sus4: ["root", "perfect4th", "perfect5th"],
};

const chordExtensions = [
  { id: "6", semitones: 10, label: "Major 6th" },
  { id: "m7", semitones: 11, label: "Minor 7th" },
  { id: "M7", semitones: 12, label: "Major 7th" },
  { id: "9", semitones: 15, label: "Major 9th" },
];

const predefinedSections = ["Intro", "Verse", "Chorus", "Bridge", "Outro"];

const HeaderButton = ()=>{
  return (
    <Button href="/song/chart">
      Start Chart
    </Button>
  )
}


const SongSectionEditor = ({ expand }) => {
  const songStore = useSongInProgress();
  const { sections, setSections } = songStore;

  const [currentSection, setCurrentSection] = useState({
    name: "",
    chordProgressions: [],
  });

  const [filteredSections, setFilteredSections] = useState(predefinedSections);

  const handleSectionNameChange = (value) => {
    setCurrentSection((prev) => ({ ...prev, name: value }));
    if (value === "") {
      setFilteredSections(predefinedSections);
    } else {
      setFilteredSections(
        predefinedSections.filter((section) =>
          section.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleAddChord = () => {
    setCurrentSection((prev) => ({
      ...prev,
      chordProgressions: [...prev.chordProgressions, { root: "C", formula: "major", extensions: [] }],
    }));
  };

  const handleSaveSection = () => {
    setSections((prev) => [...prev, currentSection]);
    setCurrentSection({ name: "", chordProgressions: [] });
  };

  const renderSummary = () => {
    return <></>
  };

  return (
      <DndProvider
        backend={isMobile ? TouchBackend : HTML5Backend}
        options={{ enableMouseEvents: true }} // For better compatibility
      >
        <SongTimeline store={songStore} />
        <LyricDisplay text={songStore.lyrics} />
      </DndProvider>
  );
};


export default SongSectionEditor;

