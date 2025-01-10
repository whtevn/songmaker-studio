import React, { useState } from "react";
import { Fieldset, Field, Label } from "~/components/catalyst-theme/fieldset";
import { Listbox, ListboxOption, ListboxLabel } from "~/components/catalyst-theme/listbox";
import { Button } from "~/components/catalyst-theme/button";
import { CameraIcon } from "@heroicons/react/16/solid";

const VersionSelector = ({ addVersion, versions, lyrics, setLyrics }) => {
  const [selectedVersionIndex, setSelectedVersionIndex] = useState(versions.length - 1);

  const handleAddVersion = () => {
    addVersion(lyrics); // Save the current lyrics as a new version
  };

  const handleOnChange = (index) => {
    const foundVersion = versions[index]; // Find the selected version
    setSelectedVersionIndex(index); // Update selected version index
    setLyrics(foundVersion.lyrics); // Update lyrics with the selected version
  };

  return (
    <Fieldset>
      <Field className="mb-4">
        <Label>Snapshot History</Label>
        <Listbox
          name="versions"
          value={selectedVersionIndex}
          onChange={handleOnChange}
        >
          {versions.length > 0 ? (
            versions.map((version, index) => (
              <ListboxOption key={index} value={index}>
                <ListboxLabel>
                  {`V${index + 1}`}
                </ListboxLabel>
              </ListboxOption>
            ))
          ) : (
            <ListboxOption disabled>
              <ListboxLabel>No Saved Versions...</ListboxLabel>
            </ListboxOption>
          )}
        </Listbox>
      </Field>
    </Fieldset>
  );
};

export default VersionSelector;

