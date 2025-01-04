import React, { useEffect, useRef } from "react";
import { ChevronRightIcon } from '@heroicons/react/16/solid';
import Sortable from "sortablejs";

const StateDiagram = ({ cards, setCards, selectedInputLocation, setSelectedInputLocation, showSummary }) => {
  const containerRef = useRef(null);
  const [selectedStates, setSelectedStates] = React.useState([]);

  useEffect(() => {
    const sortable = new Sortable(containerRef.current, {
      animation: 150,
      handle: ".sortable-handle",
      onEnd: (evt) => {
        const reorderedCards = [...cards];
        const [movedCard] = reorderedCards.splice(evt.oldIndex, 1);
        reorderedCards.splice(evt.newIndex, 0, movedCard);
        setCards(reorderedCards);
      },
    });

    return () => sortable.destroy();
  }, [cards, setCards]);

  const handleSelectState = (id) => {
    if(showSummary) return
    const updatedSelectedStates = selectedStates.includes(id)
      ? selectedStates.filter((stateId) => stateId !== id)
      : [...selectedStates, id];

    setSelectedStates(updatedSelectedStates);
  };

  const handleSelectChevron = (index) => {
    setSelectedInputLocation(selectedInputLocation === index ? null : index);
  };

  const handleCopy = () => {
    const copiedCards = cards.filter((card) => selectedStates.includes(card.id));
    const newCards = copiedCards.map((card) => ({
      ...card,
      id: `${card.id}-copy-${Date.now()}`,
    }));

    if (selectedInputLocation !== null) {
      const insertionIndex = selectedInputLocation + 1;
      const updatedCards = [
        ...cards.slice(0, insertionIndex),
        ...newCards,
        ...cards.slice(insertionIndex),
      ];
      setCards(updatedCards);
    } else {
      setCards([...cards, ...newCards]);
    }

    setSelectedStates([]);
    setSelectedInputLocation(null);
  };

  const handleDelete = () => {
    const updatedCards = cards.filter(
      (card, index) => !selectedStates.includes(card.id) && index !== selectedInputLocation
    );
    setCards(updatedCards);
    setSelectedStates([]);
    setSelectedInputLocation(null);
  };

  return (
    <>

      <div ref={containerRef} className={`flex flex-wrap justify-start items-center p-4 ${showSummary ? "" : "gap-4" }`}>
        {cards.map((card, index) => (
          <React.Fragment key={card.id}>
            {/* State Card and Chevron */}
            <span className={`flex flex-row justify-start ${showSummary ? "" : "sortable-handle"}`}>

              {/* Chevron */}
              {(index > 0 && !showSummary) && (
                <div
                  className={`flex items-center cursor-pointer mr-2 ${
                    selectedInputLocation === index ? "text-blue-500" : "text-gray-500"
                  }`}
                  onClick={() => handleSelectChevron(index)}
                >
                  <ChevronRightIcon className="h-6 w-6" />
                </div>
              )}

              {/* State Card */}
              <div
                className={`flex-grow-0 text-center ${
                  selectedStates.includes(card.id) ? `border border-4 bg-${card.color}-500 border-${card.color}-100 text-${card.color}-100` : `text-${card.color}-700 bg-${card.color}-200 `
                } ${
                  showSummary ? "p-2 m-x-0" : "rounded-md p-4 m-2 shadow-md cursor-pointer"
                }`}
                data-id={card.id}
                onClick={() => handleSelectState(card.id)}
              >
                {card.type}
              </div>
            </span>
          </React.Fragment>

        ))}
      </div>
      {(selectedStates.length > 0) && (
        <div className="p-2 flex gap-4 justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleCopy}>
            Copy
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </>
  );
};

export default StateDiagram;

