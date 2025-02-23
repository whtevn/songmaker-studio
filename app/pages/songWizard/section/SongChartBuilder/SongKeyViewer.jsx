import { BadgeButton } from "~/components/catalyst-theme/badge";
import ScaleUtil from "~/utils/scales"
import { useInterfaceMode } from "./context";
export default ({ scale }) => {
  const { chordProgressionShortName } = ScaleUtil;
  const { handleScaleDegreeClick, selectedChord } = useInterfaceMode();
  return (
      <div className="flex flex-row justify-evenly p-4">
        { scale.map((chord, index) => 
          <BadgeButton key={index} color={index === selectedChord?.index ? "blue" : "slate"} onClick={()=>handleScaleDegreeClick(chord)}>
            <div className="flex flex-col">
              <span>{chord.numeral}</span>
              <span>{chord.note}</span>
              <span>{chordProgressionShortName[chord.type]}</span>
            </div>
          </BadgeButton>
        ) }
      </div>
  )
}

