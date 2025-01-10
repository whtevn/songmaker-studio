import React from "react";

const CircleOfFifths = () => {
  const majorKeys = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
  const minorKeys = ["Am", "Em", "Bm", "F#m", "C#m", "G#m", "D#m", "Bbm", "Fm", "Cm", "Gm", "Dm"];

  return (
    <div style={{ textAlign: "center" }}>
      <svg
        viewBox="-150 -150 300 300"
        width="300"
        height="300"
        style={{ background: "#1c1c1c", borderRadius: "50%" }}
      >
        {/* Outer Circle (Major Keys) */}
        {majorKeys.map((key, i) => {
          const angle = (i * 360) / majorKeys.length;
          const x = 100 * Math.cos((angle * Math.PI) / 180);
          const y = 100 * Math.sin((angle * Math.PI) / 180);

          return (
            <text
              key={key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#fff"
              style={{
                fontSize: "12px",
                transform: `rotate(${angle + 90}deg)`,
              }}
            >
              {key}
            </text>
          );
        })}

        {/* Inner Circle (Minor Keys) */}
        {minorKeys.map((key, i) => {
          const angle = (i * 360) / minorKeys.length;
          const x = 60 * Math.cos((angle * Math.PI) / 180);
          const y = 60 * Math.sin((angle * Math.PI) / 180);

          return (
            <text
              key={key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#ccc"
              style={{
                fontSize: "10px",
              }}
            >
              {key}
            </text>
          );
        })}

        {/* Center Key Signature */}
        <circle cx="0" cy="0" r="30" fill="#333" />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fill="#fff"
          style={{ fontSize: "14px", fontWeight: "bold" }}
        >
          Key
        </text>
      </svg>
    </div>
  );
};

export default CircleOfFifths;

