import React, { useState } from "react";
import SortableCards from "~/components/common/SortableCards";
import useCatalogStore from "~/stores/useCatalogStore";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Text } from "~/components/catalyst-theme/text";

export default ({ chordProgression }) => {
  const { updateChordInProgression, removeChordFromProgression, addChordToChordProgression } = useCatalogStore();
  const [editingIndex, setEditingIndex] = useState(null); // Track which chord is being edited

  const handleChordClick = (index) => {
    setEditingIndex(index);
  };

  const handleChordUpdate = (index, field, value) => {
    const updatedChord = { ...chordProgression.chords[index], [field]: value };
    updateChordInProgression(chordProgression, index, updatedChord);
  };

  return (
    <div className="border p-4 rounded-md shadow-md">
      <h3 className="text-lg font-semibold mb-2">Chord Progression</h3>

      {/* Chord List (Sortable & Editable) */}
      <SortableCards
        onCardClick={(chord, index) => handleChordClick(index)}
        cards={chordProgression.chords || []}
        setCards={(fromIndex, toIndex) => {
          updateChordInProgression(chordProgression, fromIndex, toIndex);
        }}
        renderCard={(chord, index) => (
          <div className="flex flex-col justify-center p-2 bg-gray-100 rounded-md">
            {/* Roman Numeral (Editable) */}
            {editingIndex === index ? (
              <input
                type="text"
                value={chord.numeral}
                onChange={(e) => handleChordUpdate(index, "numeral", e.target.value)}
                className="text-center text-lg font-bold border rounded-md p-1"
              />
            ) : (
              <Text className="text-center font-bold" onClick={() => handleChordClick(index)}>
                {chord.numeral}
              </Text>
            )}

            {/* Note Name + Chord Type (Editable) */}
            {editingIndex === index ? (
              <div className="flex flex-row justify-center space-x-2 mt-1">
                <input
                  type="text"
                  value={chord.note}
                  onChange={(e) => handleChordUpdate(index, "note", e.target.value)}
                  className="text-center border rounded-md p-1 w-16"
                />
                <input
                  type="text"
                  value={chord.shortName}
                  onChange={(e) => handleChordUpdate(index, "shortName", e.target.value)}
                  className="text-center border rounded-md p-1 w-16"
                />
              </div>
            ) : (
              <Text className="text-center text-sm" onClick={() => handleChordClick(index)}>
                {chord.note} {chord.shortName}
              </Text>
            )}
          </div>
        )}
      />

      {/* Controls */}
      <div className="flex flex-row justify-between mt-4">
        <BadgeButton color="red" onClick={() => removeChordFromProgression(chordProgression, editingIndex)}>Remove Chord</BadgeButton>
        <BadgeButton color="green" onClick={() => addChordToChordProgression(chordProgression, { numeral: "", note: "", shortName: "" })}>
          Add Chord
        </BadgeButton>
      </div>
    </div>
  );
};

