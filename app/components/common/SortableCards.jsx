import React, { useState, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { CheckCircleIcon, ChevronRightIcon } from "@heroicons/react/16/solid";

const ItemType = {
  CARD: "CARD",
  LYRIC: "LYRIC",
};

const DraggableCard = ({
  card,
  index,
  moveCard,
  setInputLocation,
  inputLocation,
  onClick,
  onApplyLyrics,
  renderCard,
}) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: [ItemType.LYRIC, ItemType.CARD],
    hover(item, monitor) {
      if (!ref.current) return;

      const dropType = monitor.getItemType();
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dropType === ItemType.CARD) {
        // Handle card reordering
        if (dragIndex === hoverIndex) return;

        moveCard(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }

    },
    drop(item, monitor){
      if (!ref.current) return;
      const dropType = monitor.getItemType();
      const hoverIndex = index;
      if (dropType === ItemType.LYRIC) {
        // Handle lyrics application
        if (monitor.isOver({ shallow: true })) {
          onApplyLyrics(hoverIndex, item.lyrics);
        }
      }
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.CARD,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex flex-row items-center ${
        isDragging ? "opacity-50" : "opacity-100"
      } transition-transform duration-300 ease-in-out`}
    >
      {/* Chevron */}
      {index > 0 && (
        <div
          className={`flex items-center cursor-pointer mr-2 ${
            inputLocation === index ? "text-blue-500" : "text-gray-500"
          }`}
          onClick={() => setInputLocation(index)}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </div>
      )}

      {/* Card */}
        { renderCard ? <span key={index}>{renderCard(card, index)}</span> : 
        <div
          className="relative"
          onClick={onClick}
          key={index}
        >
          <div
            className={`flex-grow-0 text-center text-${card.color}-700 bg-${card.color}-200 rounded-md p-4 m-2 shadow-md cursor-pointer`}
            data-id={card.localId}
          >
            <p>{card.type}</p>
          </div>
          {card.lyrics && (
            <span
              className={`absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-${card.color}-500 text-white rounded-full p-1`}
            >
              <CheckCircleIcon className="h-4 w-4" />
            </span>
          )}
        </div>
      }
    </div>

  );
};

const StateDiagram = ({
  onApplyLyrics,
  cards,
  setCards,
  inputLocation,
  setInputLocation,
  renderCard,
  onCardClick,
}) => {
  const moveCard = useCallback(setCards, [setCards]);

  return (
    <div className="flex flex-wrap justify-start items-center gap-4">
      {cards.map((card, index) => (
        <DraggableCard
          key={card.localId}
          card={card}
          index={index}
          moveCard={moveCard}
          renderCard={renderCard}
          setInputLocation={setInputLocation}
          inputLocation={inputLocation}
          onClick={() => onCardClick(card)}
          onApplyLyrics={onApplyLyrics}
        />
      ))}
    </div>
  );
};

const StateDiagramWrapper = ({
  store,
  cards,
  setCards,
  inputLocation,
  setInputLocation,
  onCardClick,
  onApplyLyrics,
  renderCard,
}) => (
    <StateDiagram
      cards={cards}
      setCards={setCards}
      renderCard={renderCard}
      inputLocation={inputLocation}
      setInputLocation={setInputLocation}
      onCardClick={onCardClick}
      onApplyLyrics={onApplyLyrics}
    />
);

export default StateDiagramWrapper;

