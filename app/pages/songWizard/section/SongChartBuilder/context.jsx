import React, { createContext, useContext, useState } from "react";
import useCatalogStore from "~/stores/useCatalogStore";

// Our interface mode options:
export const interfaceModeOptions = {
  song: "song",
  chordProgression: "chordProgression"
};

export const InterfaceModeContext = createContext();

/**
 * Provider component that holds interfaceMode state,
 * plus any functions that need to be shared across components.
 */
export function InterfaceModeProvider({ children }) {
  // Our mode state, defaulting to "song"
  const [interfaceMode, setInterfaceMode] = useState(interfaceModeOptions.song);
  const { getSongSection, updateSongSection, applyChordToSection } = useCatalogStore.getState();

  // Example of some data that might change when a click event happens
  // (e.g., "selectedChord" or something relevant to chord progression)
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
    if (interfaceMode === interfaceModeOptions.song) {
      applyChordToSong({ chord: chordInfo, word: selectedWord })
    }
  };

  const handleSectionWordClick = (wordInfo) => {
    setSelectedWord(wordInfo);
    if (interfaceMode === interfaceModeOptions.song) {
      applyChordToSong({ chord: selectedChord, word: wordInfo })
    }
  };

  const handleSetInterfaceMode = (mode) => {
    setSelectedWord(null)
    setSelectedChord(null)
    setInterfaceMode(mode)
  }

  // The value we’re exposing to the entire subtree via the context
  const providerValue = {
    interfaceMode,
    selectedChord,
    selectedWord,
    handleSetInterfaceMode,
    handleScaleDegreeClick,
    handleSectionWordClick
  };

  return (
    <InterfaceModeContext.Provider value={providerValue}>
      {children}
    </InterfaceModeContext.Provider>
  );
}

/**
 * Custom hook so consuming components can easily get context data.
 */
export function useInterfaceMode() {
  return useContext(InterfaceModeContext);
}

