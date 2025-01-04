import React, { useState, cloneElement } from "react";
import SongDefinition from "~/components/studio-layout/SongDefinition";
import SongSectionEditor from "~/components/studio-layout/SongSectionEditor";
import LyricWriter from "~/components/studio-layout/LyricWriter";
import { Heading } from "~/components/catalyst-theme/heading";

const MinimizableSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="minimizable-section">
      <div className="flex justify-between items-center">
        <Heading onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {title}
        </Heading>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm text-blue-500 hover:underline"
        >
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>
      <div>
        {React.Children.map(children, (child) =>
          cloneElement(child, { expand: isOpen })
        )}
      </div>
    </div>
  );
};

export function SongWizard({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SongDefinition expand={false} />
      <SongSectionEditor expand={true} />
      <LyricWriter expand={false} />
    </div>
  );
}

export default SongWizard;

