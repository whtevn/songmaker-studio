import React, { useState } from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import { Button } from "~/components/catalyst-theme/button";

const SummarizableSection = ({ title, children, renderSummary, expandProp, headerButton }) => {
  const [expand, setExpand] = useState(expandProp || false);

  const HeaderButton = headerButton
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Heading>{title}</Heading>
        <div>
          { headerButton && <HeaderButton /> }
          <Button onClick={() => setExpand(!expand)} plain>
            {expand ? "Hide" : "Edit"}
          </Button>
        </div>
      </div>
      {expand ? (
        <div>
          {children}
          <div className="mt-4 flex justify-end">
            <Button onClick={ () => setExpand(!expand) }>Continue</Button>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 italic">{renderSummary()}</div>
      )}
    </div>
  );
};

export default SummarizableSection;

