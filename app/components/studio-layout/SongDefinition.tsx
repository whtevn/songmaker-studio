import React from "react";
import SummarizableSection from "~/components/studio-layout/SummarizableSection";
import { Input } from "~/components/catalyst-theme/input";
import TapTempo from "~/components/studio/TapTempo";
import { Dropdown, DropdownMenu, DropdownButton, DropdownItem } from "~/components/catalyst-theme/dropdown";
import useSongInProgress from "~/stores/useSongInProgress";

const CreateSong = ( {expand} ) => {
  const {
    title,
    tempo,
    duration,
    timeSignature,
    key,
    setTitle,
    setTempo,
    setDuration,
    setTimeSignature,
    setKey,
  } = useSongInProgress();

  const handleDurationChange = (minutes, seconds) => {
    const totalSeconds = minutes * 60 + seconds;
    setDuration(totalSeconds);
  };

  const calculateMeasures = (duration, tempo, timeSignature) => {
    const [beatsPerMeasure, beatUnit] = timeSignature.split("/").map(Number);
    const secondsPerBeat = 60 / tempo;
    const totalBeats = duration / secondsPerBeat;
    const measures = totalBeats / beatsPerMeasure;
    return Math.floor(measures);
  };

  const renderSummary = () => (
    <>
      <p><strong>Title:</strong> {title || "Untitled"}</p>
      <p><strong>Tempo:</strong> {tempo} BPM</p>
      <p><strong>Time Signature:</strong> {timeSignature}</p>
      <p><strong>Key:</strong> {key.root} {key.mode}</p>
      { /* <ScaleRender /> */ }
    </>
  );

  return (
    <SummarizableSection
      title="Song Setup"
      renderSummary={renderSummary}
      expandProp={expand}
    >
      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter song title"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Tempo</label>
        <TapTempo tempo={tempo} setTempo={setTempo} />
      </div>


      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Time Signature</label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            value={timeSignature.split("/")[0]}
            onChange={(e) => setTimeSignature(`${e.target.value}/${timeSignature.split("/")[1]}`)}
          />
          <Dropdown>
            <DropdownButton>{timeSignature.split("/")[1]}</DropdownButton>
            <DropdownMenu>
              {["2", "4", "8"].map((option) => (
                <DropdownItem
                  key={option}
                  onClick={() => setTimeSignature(`${timeSignature.split("/")[0]}/${option}`)}
                >
                  {option}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium mb-2">Key</label>
        <div className="flex gap-4">
          <Dropdown>
            <DropdownButton>{key.root}</DropdownButton>
            <DropdownMenu>
              {["C", "D", "E", "F", "G", "A", "B"].map((root) => (
                <DropdownItem key={root} onClick={() => setKey((prev) => ({ ...prev, root }))}>
                  {root}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownButton>{key.mode}</DropdownButton>
            <DropdownMenu>
              {["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"].map((mode) => (
                <DropdownItem key={mode} onClick={() => setKey((prev) => ({ ...prev, mode }))}>
                  {mode}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </SummarizableSection>
  );
};

export default CreateSong;

