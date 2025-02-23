import useCatalogStore from "~/stores/useCatalogStore";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Text } from "~/components/catalyst-theme/text";
import ChordProgressionViewer from "./ChordProgressionViewer";
export default ({ songData, songSections }) => {

  const chordProgressions = useCatalogStore((state) => state.chordProgressions || []);
  const songChordProgressionSet = songData.chordProgressions || []

  const songChordProgressionIds = songChordProgressionSet.map(p => p.localId)
  const songChordProgressions = chordProgressions.filter(p => songChordProgressionIds.includes(p.localId))
  return (
    <div>
      { songChordProgressions.length > 0 
        ? songChordProgressions.map(chordProgression => 
            <ChordProgressionViewer chordProgression={chordProgression} />
          )
          : <div className="text-center"><Text>( no chord progressions... )</Text></div>
      }
      <div className="flex flex-row justify-end">
        <BadgeButton color="orange">Add Chord Progression</BadgeButton>
      </div>
    </div>
  );
};

