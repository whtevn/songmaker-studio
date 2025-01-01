import React, { useState, useRef, useEffect } from "react";

const TapTempo = ({ tempo, setTempo }) => {
  const [taps, setTaps] = useState([]);
  const [inputTempo, setInputTempo] = useState(tempo);
  const timer = useRef(null);
  const pulseRef = useRef(null);

  const handleTap = () => {
    const now = Date.now();
    setTaps((prevTaps) => {
      const updatedTaps = [...prevTaps, now];
      if (updatedTaps.length > 1) {
        const intervals = updatedTaps.slice(1).map((t, i) => t - updatedTaps[i]);
        const averageInterval =
          intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;
        const calculatedTempo = Math.round(60000 / averageInterval);
        setTempo(calculatedTempo);
        setInputTempo(calculatedTempo);
      }
      return updatedTaps;
    });

    // Reset taps after 2 seconds of inactivity
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setTaps([]);
    }, 2000);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setInputTempo(value);
      setTempo(value);
    }
  };

  useEffect(() => {
    if (pulseRef.current) {
      pulseRef.current.style.animation = "none";
      void pulseRef.current.offsetWidth; // Trigger reflow
      pulseRef.current.style.animation = `pulse ${60 / tempo}s infinite`;
    }
  }, [tempo]);

  return (
    <div className="tap-tempo flex items-center gap-4">
      <button
        onClick={handleTap}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Tap
      </button>
      <input
        type="number"
        className="border rounded p-2 w-24"
        value={inputTempo}
        onChange={handleInputChange}
        placeholder="Enter tempo"
      />
        {/*
      <div
        ref={pulseRef}
        className="w-6 h-6 bg-blue-500 rounded-full"
        style={{ animation: `pulse 1s infinite` }}
      ></div>
      */}
    </div>
  );
};

export default TapTempo;

