import React, { useRef, useEffect, useState } from "react";

const ADSREnvelopeGraph = ({ adsr, setAdsr }) => {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null); // Track which point is being dragged

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const { attack, decay, sustain, release } = adsr;
    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const sustainLevel = sustain * 0.8 * height; // Scale sustain to canvas height

    const totalTime = attack + decay + release;
    const attackX = (attack / totalTime) * (width - 2 * padding);
    const decayX = (decay / totalTime) * (width - 2 * padding);
    const sustainX = (width - 2 * padding) * 0.3; // Placeholder for sustain length
    const releaseX = (release / totalTime) * (width - 2 * padding);

    const startX = padding;
    const startY = height - padding;

    const points = [
      { id: "attack", x: startX + attackX, y: padding },
      { id: "decay", x: startX + attackX + decayX, y: height - sustainLevel },
      { id: "sustain", x: startX + attackX + decayX + sustainX, y: height - sustainLevel },
      { id: "release", x: startX + attackX + decayX + sustainX + releaseX, y: startY },
    ];

    // Clear and draw graph
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = "#4caf50";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    points.forEach(({ x, y }) => ctx.lineTo(x, y));
    ctx.stroke();

  }, [adsr]);

  // Handle dragging logic
  const handleMouseDown = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    canvas.points.forEach(point => {
      const dx = mouseX - point.x;
      const dy = mouseY - point.y;
      if (Math.sqrt(dx * dx + dy * dy) < 8) {
        setDragging(point.id);
      }
    });
  };

  const handleMouseMove = (event) => {
    if (!dragging) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 10;
    const maxTime = 2.0; // Assume max 2s time for attack, decay, release

    let newAdsr = { ...adsr };

    if (dragging === "attack") {
      newAdsr.attack = Math.max(0.05, (mouseX / width) * maxTime);
    } else if (dragging === "decay") {
      newAdsr.decay = Math.max(0.05, (mouseX / width) * maxTime);
    } else if (dragging === "sustain") {
      newAdsr.sustain = Math.min(1, Math.max(0, 1 - mouseY / height));
    } else if (dragging === "release") {
      newAdsr.release = Math.max(0.05, (mouseX / width) * maxTime);
    }

    setAdsr(newAdsr);
  };

  const handleMouseUp = () => setDragging(null);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={150}
      style={{ border: "1px solid #ddd", cursor: dragging ? "grabbing" : "pointer" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default ADSREnvelopeGraph;

