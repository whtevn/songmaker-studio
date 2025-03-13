import React, { createContext, useContext, useState } from "react";
import useCatalogStore from "~/stores/useCatalogStore";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { isMobile } from "react-device-detect";
import { DndProvider } from 'react-dnd'

// Our interface mode options:
export const interfaceModeOptions = {
  song: "song",
  chordProgression: "chordProgression"
};

export const SongChartBuilderContext = createContext();

/**
 * Provider component that holds interfaceMode state,
 * plus any functions that need to be shared across components.
 */
export function SongChartBuilderProvider({ children }) {
  // Our mode state, defaulting to "song"
  const [interfaceMode, setSongChartBuilder] = useState(interfaceModeOptions.song);
  const { getSongSection, updateSongSection, applyChordToSection, addChordtoChordProgression  } = useCatalogStore.getState();
  const [audioContext, setAudioContext] = useState(new (window.AudioContext || window.webkitAudioContext)());

  // Example of some data that might change when a click event happens
  // (e.g., "selectedChord" or something relevant to chord progression)
  const [selectedChordProgression, setSelectedChordProgression] = useState(null);
  const [selectedChord, setSelectedChord] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);

  const applyChordToSong = ({chord, word}) => {
    if(chord && word){
      const { sectionId, ...wordData } = word
      const section = { localId: sectionId }
      applyChordToSection(section, {...wordData, chord})
      
      setSelectedWord(null)
      setSelectedChord(null)
    }

    if(!chord && selectedWord && word && word.sectionId === selectedWord.sectionId && word.lineIndex === selectedWord.lineIndex && word.wordIndex === selectedWord.wordIndex && word.position === selectedWord.position){
      setSelectedWord(null)
    }

  }

  const handleScaleDegreeClick = (chordInfo) => {
    setSelectedChord(chordInfo);
    console.log(chordInfo)
    if (interfaceMode === interfaceModeOptions.song) {
      applyChordToSong({ chord: chordInfo, word: selectedWord })
    }
    if (interfaceMode === interfaceModeOptions.progression) {
      addChordtoChordProgression(chordProgression, chord)
    }
  };

  const handleSectionWordClick = (wordInfo) => {
    setSelectedWord(wordInfo);
    if (interfaceMode === interfaceModeOptions.song) {
      applyChordToSong({ chord: selectedChord, word: wordInfo })
    }
  };

  const handleSetSongChartBuilder = (mode) => {
    setSelectedWord(null)
    setSelectedChord(null)
    setSongChartBuilder(mode)
  }

  // The value we’re exposing to the entire subtree via the context
  const providerValue = {
    interfaceMode,
    selectedChord,
    selectedWord,
    handleSetSongChartBuilder,
    handleScaleDegreeClick,
    handleSectionWordClick,
    audioContext,
  };

  return (
    <SongChartBuilderContext.Provider value={providerValue}>
      <DndProvider
        backend={isMobile ? TouchBackend : HTML5Backend}
        options={{ enableMouseEvents: true }} // For better compatibility
      >
        {children}
      </DndProvider>
    </SongChartBuilderContext.Provider>
  );
}

/**
 * Custom hook so consuming components can easily get context data.
 */
export function useSongChartBuilder() {
  return useContext(SongChartBuilderContext);
}

