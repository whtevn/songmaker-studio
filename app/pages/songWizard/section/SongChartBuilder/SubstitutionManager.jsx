import { useState } from "react";
import { useSongChartBuilder } from "./context";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from "~/components/catalyst-theme/dropdown";
import ScaleUtil from "~/utils/scales";
import ChordViewer from "./ChordViewer";
import _ from "lodash";

export default ({ scale }) => {
  const { selectedChord } = useSongChartBuilder();
  const { chordExtensions, modes, getParallelNashvilleNumber, generateTriadWithOctave, constructChordWithOctave, relativeChordDefinitions, getNashvilleNumber } = ScaleUtil;

  const [selectedSubstitution, setSelectedSubstitution] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [secondaryDominantExtension, setSecondaryDominantExtension] = useState(null);
  const [selectedExtensions, setSelectedExtensions] = useState([]);
  const [selectedChords, setSelectedChords] = useState([]); // Array to store additional chords

  console.log(scale)

  if (!selectedChord) return null;

  // Toggle extension selection
  const toggleExtension = (extension) => {
    setSelectedExtensions((prev) =>
      prev.includes(extension)
        ? prev.filter((ext) => ext !== extension)
        : [...prev, extension]
    );
  };

  // Compute selected chord triad
  const selectedChordTriad = generateTriadWithOctave(selectedChord.note, selectedChord.quality);

  // Handle parallel chord selection
  const handleParallelSelection = (mode) => {
    setSelectedMode(mode);
    const parallelChordData = getParallelNashvilleNumber(scale, selectedChord, mode.label);

    const newChord = {
      chord: generateTriadWithOctave(parallelChordData.note, parallelChordData.quality),
      label: `${parallelChordData.note} ${parallelChordData.quality}`,
      nashville: parallelChordData.nashville,
    };

    // Add to selectedChords array, ensuring no duplicates
    setSelectedChords((prevChords) =>
      prevChords.some((chord) => chord.label === newChord.label) ? prevChords : [...prevChords, newChord]
    );
  };

  const handleRelativeSelection = (chordType) => {
	  console.log(selectedChord, chordType)

    const relativeSelection = constructChordWithOctave(scale, { ...selectedChord, quality: chordType.quality })
	
    console.log(relativeSelection)

    const newChord = {
      chord: relativeSelection,
      label: `${selectedChord.note} ${chordType.name}`,
      nashville: getNashvilleNumber(chordType)
    };

    // Add to selectedChords array, ensuring no duplicates
    setSelectedChords((prevChords) =>
      prevChords.some((chord) => chord.label === newChord.label) ? prevChords : [...prevChords, newChord]
    );
  };

  // Reset selectedChords when substitution changes away from "Parallel"
  if (selectedSubstitution !== "Relative" && selectedChords.length > 0) {
    //setSelectedChords([]);
  }

  return (
    <>
      {/* Dropdown for Chord Substitutions */}
      <Dropdown>
        <DropdownButton outline>
          {selectedSubstitution || `${selectedChord.note} ${_.startCase(selectedChord.quality)}`}
        </DropdownButton>
        <DropdownMenu>
          <DropdownItem
            onClick={() => {
              setSelectedSubstitution(null);
              setSelectedMode(null);
              setSecondaryDominantExtension(null);
              setSelectedChords([]); // Clear additional chords
            }}
          >
            {selectedChord.note} {_.startCase(selectedChord.quality)}
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setSelectedSubstitution("Parallel");
              setSelectedMode(null);
              setSelectedChords([]); // Reset when changing substitution
            }}
          >
            Parallel Chord
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setSelectedSubstitution("Relative");
              setSelectedMode(null);
              setSelectedChords([]); // Reset when changing substitution
            }}
          >
            Relative Chord
          </DropdownItem>
          {selectedChord.quality !== "diminished" && (
            <DropdownItem
              onClick={() => {
                setSelectedSubstitution(`V7/${selectedChord.nashville}`);
                setSecondaryDominantExtension(null);
                setSelectedChords([]); // Reset when changing substitution
              }}
            >
              Secondary Dominant
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>

      {/* Secondary Dominant Extensions */}
      {selectedSubstitution?.includes("V7") && (
        <Dropdown>
          <DropdownButton outline>
            {secondaryDominantExtension || "Select Extension"}
          </DropdownButton>
          <DropdownMenu>
            {["7", "9", "13"].map((ext) => (
              <DropdownItem key={ext} onClick={() => setSecondaryDominantExtension(ext)}>
                V{ext}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}

      {/* Parallel Mode Selection */}
      {selectedSubstitution === "Parallel" && (
        <Dropdown>
          <DropdownButton outline>
            {selectedMode ? selectedMode.label : "Select Mode"}
          </DropdownButton>
          <DropdownMenu>
            {modes.map((mode) => (
              <DropdownItem key={mode.label} onClick={() => handleParallelSelection(mode)}>
                {mode.name || mode.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
      )}

      {/* Parallel Mode Selection */}
      {selectedSubstitution === "Relative" && (
        <Dropdown>
          <DropdownButton outline>
            {selectedMode ? selectedMode.label : "Select Mode"}
          </DropdownButton>
          <DropdownMenu>
            {Object.keys(relativeChordDefinitions).map((key) => {
		const chordType = relativeChordDefinitions[key]
             	return <DropdownItem key={chordType.name} onClick={() => handleRelativeSelection(chordType)}>
                {chordType.name}
              </DropdownItem>
            })}
          </DropdownMenu>
        </Dropdown>
      )}
      {/* Chord Extensions */}
      {false &&
        chordExtensions
          .filter((ext) => selectedChord.quality !== "diminished")
          .map((extension) => (
            <BadgeButton
              key={extension.id}
              color={selectedExtensions.includes(extension.id) ? "blue" : "gray"}
              onClick={() => toggleExtension(extension.id)}
            >
              {extension.label}
            </BadgeButton>
          ))}

      {/* Chord Viewer */}
      <div className="bg-white">
        <ChordViewer
          chords={[
            { chord: selectedChordTriad, label: `${selectedChord.note} ${selectedChord.quality}`, nashville: selectedChord.nashville },
            ...selectedChords
          ]}
        />
      </div>
    </>
  );
};

