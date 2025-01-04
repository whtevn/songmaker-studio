import React, { useState } from "react";
import { Heading } from "~/components/catalyst-theme/heading";
import { Button } from "~/components/catalyst-theme/button";

const SummarizableSection = ({ title, children, renderSummary, expandProp, headerButton, hideText, showText, allowContinue=true }) => {
  const [expand, setExpand] = useState(expandProp || false);

  const HeaderButton = headerButton
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        { title && 
        <Heading>{title}</Heading>
        }
        <div>
          <Button onClick={() => setExpand(!expand)} plain>
            {expand ? (hideText || "Hide") : (showText || "Edit")}
          </Button>
        </div>
        { headerButton && <HeaderButton /> }
      </div>
      {expand ? (
        <div>
          {children}
          { allowContinue && 
            <div className="mt-4 flex justify-end">
              <Button onClick={ () => setExpand(!expand) }>Continue</Button>
            </div>
          }
        </div>
      ) : (
        <div className="text-gray-500 italic">{renderSummary()}</div>
      )}
    </div>
  );
};

export default SummarizableSection;

