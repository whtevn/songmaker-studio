import { BadgeButton } from "~/components/catalyst-theme/badge";
import ScaleUtil from "~/utils/scales"
import { useInterfaceMode } from "./context";
export default ({ scale }) => {
  const { chordProgressionIndicator } = ScaleUtil;
  const { handleScaleDegreeClick, selectedChord } = useInterfaceMode();
  return (
      <div className="flex flex-row justify-evenly p-4">
        { scale.map((chord, index) => 
          <BadgeButton key={index} color={index === selectedChord?.index ? "blue" : "slate"} onClick={()=>handleScaleDegreeClick(chord)}>
            <div className="flex flex-col">
              <span>{chord.nashville}</span>
              <span>{chord.note}{chordProgressionIndicator[chord.quality]}</span>
            </div>
          </BadgeButton>
        ) }
      </div>
  )
}

