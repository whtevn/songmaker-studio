import React, { useState } from "react";

const Card = ({ title, children, style = {}, toggleable = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#f9f9f9",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: toggleable ? "pointer" : "default",
        }}
        onClick={toggleable ? handleToggle : undefined}
      >
        {title && <h3 style={{ margin: 0 }}>{title}</h3>}
        {toggleable && (
          <button
            style={{
              background: "transparent",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: "#007BFF",
            }}
          >
            {isExpanded ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {(!toggleable || isExpanded) && <div style={{ marginTop: "16px" }}>{children}</div>}
    </div>
  );
};

export default Card;
