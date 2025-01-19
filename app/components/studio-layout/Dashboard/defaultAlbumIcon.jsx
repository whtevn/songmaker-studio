import React from "react";

const CustomIcon = (props) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1275 1246"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeMiterlimit="1.5"
      {...props} // Allow additional props
    >
      <g>
        <path
          d="M1230.37,336.727c-0,-166.973 -135.561,-302.533 -302.533,-302.533l-919.191,1.854l-8.642,1209.23l1228.55,-4.234l1.814,-904.314Z"
          style={{ fill: "#d5d9de" }}
        />
        <g>
          <circle cx="688.584" cy="941.105" r="253.71" style={{ fill: "#5e7794" }} />
          <path
            d="M910.457,63.099l0,849.86"
            style={{ fill: "none", stroke: "#5e7794", strokeWidth: "62.5px" }}
          />
          <path
            d="M910.833,44.194c189.137,0.837 317.529,113.405 319.533,302.533"
            style={{ fill: "none", stroke: "#5e7794", strokeWidth: "62.5px" }}
          />
        </g>
      </g>
    </svg>
  );
};

export default CustomIcon;

