import React, { useState, useCallback } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ChevronRightIcon } from "@heroicons/react/16/solid";

const ItemType = {
  CARD: "CARD",
};

const DraggableCard = ({ card, index, moveCard, setInputLocation, inputLocation, onClick }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.CARD,
    hover(item) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
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
      onClick={onClick}
      className={`flex flex-row items-center ${isDragging ? "opacity-50" : "opacity-100"} transition-transform duration-300 ease-in-out`}
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
      <div
        className={`flex-grow-0 text-center text-${card.color}-700 bg-${card.color}-200 rounded-md p-4 m-2 shadow-md cursor-pointer`}
        data-id={card.id}
      >
        {card.type}
      </div>
    </div>
  );
};

const StateDiagram = ({ cards, setCards, inputLocation, setInputLocation, onCardClick }) => {

  const moveCard = useCallback((fromIndex, toIndex) => {
    setCards((prevCards) => {
      const updatedCards = [...prevCards];
      const [movedCard] = updatedCards.splice(fromIndex, 1);
      updatedCards.splice(toIndex, 0, movedCard);
      return updatedCards;
    });
  }, [setCards]);

  return (
    <div className="flex flex-wrap justify-start items-center p-4 gap-4">
      {cards.map((card, index) => (
        <DraggableCard
          key={card.id}
          card={card}
          index={index}
          moveCard={moveCard}
          setInputLocation={setInputLocation}
          inputLocation={inputLocation}
          onClick={()=>onCardClick(card)}
        />
      ))}
    </div>
  );
};

const StateDiagramWrapper = ({ cards, setCards, inputLocation, setInputLocation, onCardClick }) => (
  <DndProvider backend={HTML5Backend}>
    <StateDiagram
        cards={cards}
        setCards={setCards}
        inputLocation={inputLocation}
        setInputLocation={setInputLocation}
        onCardClick={onCardClick}
    />
  </DndProvider>
);

export default StateDiagramWrapper;

