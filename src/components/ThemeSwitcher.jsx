import React from 'react';
import '../css/ThemeSwitcher.css';
import {VscCircleLargeFilled } from "react-icons/vsc";

export const ThemeSwitcher = ({ colors, activeColor, setActiveColor }) => {
  
console.log(activeColor)


// Map colors to buttons, properly set active color on button click and highlight selected button.
  return (
    <div className="flex items-center p-1">
      {colors.map((color) => (
        <button key={color.name} onClick={() => setActiveColor(color)} className={` button-${colors[color.name]}`}
        aria-label={`Swap to ${color.name} theme`}
        ><VscCircleLargeFilled size={25} style={{ border: activeColor.name === color.name ? "2px solid white" : "none",
          color: color.value, borderRadius: "50%", }} /></button>
      ))}
    </div>
  );
  
};
