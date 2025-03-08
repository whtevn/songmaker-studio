import useCatalogStore from "~/stores/useCatalogStore";
import { useSongChartBuilder } from "./context";
import { BadgeButton } from "~/components/catalyst-theme/badge";
import { Text } from "~/components/catalyst-theme/text";
import ChordProgressionViewer from "./ChordProgressionViewer";
import ChordProgression from "~/models/ChordProgression"
import Chord from "~/models/Chord"
export default ({ songData, songSections }) => {

  console.log(songData)
  const chordProgressions = useCatalogStore((state) => state.chordProgressions || []);
  const songChordProgressionSet = songData?.chordProgressions || []

  const songChordProgressionIds = songChordProgressionSet.map(p => p.localId)
  const songChordProgressions = chordProgressions.filter(p => songChordProgressionIds.includes(p.localId))

  const { addChordProgressionToSong } = useCatalogStore()

  const startChordProgression = () => {
    addChordProgressionToSong(songData, new ChordProgression())
  }
  return (
    <div>
      { songChordProgressions.length > 0 
        ? songChordProgressions.map(chordProgression => 
            <ChordProgressionViewer chordProgression={chordProgression} />
          )
          : <div className="text-center"><Text>( no chord progressions... )</Text></div>
      }
      <div className="flex flex-row justify-end">
        <BadgeButton color="orange" onClick={startChordProgression}>Add Chord Progression</BadgeButton>
      </div>
    </div>
  );
};

