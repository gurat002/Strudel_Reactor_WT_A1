
import { ThemeSwitcher } from './Controls/ThemeSwitcher.jsx'
import { VscMusic } from "react-icons/vsc";
import '../css/Header.css';
import { useEffect, useRef, useState } from "react";



function Header() {
    // define theme colors and their values and put in list
    const themeColors = [
        { name: 'red', value: 'rgb(239, 68, 68)' },
        { name: 'blue', value: 'rgb(59, 130, 246)' },
        { name: 'green', value: 'rgb(34, 197, 94)' },
        { name: 'yellow', value: 'rgb(234, 179, 8)' },
        { name: 'purple', value: 'rgb(168, 85, 247)' },
        { name: 'white', value: 'rgb(255, 255, 255)' },
    ];

    // set default color to red
    const [activeColor, setActiveColor] = useState(themeColors[0]);

    // set CSS variable based on selected theme
    useEffect(() => {
        document.documentElement.style.setProperty('--accent-color', activeColor.value);
    }, [activeColor]); // execute when changed


    

    return (
    <>
        <header className="d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center">
                <VscMusic className="music-icon"/>&nbsp;&nbsp;&nbsp;
                <h1 className="h3 fw-bold mb-0">Strudel Demo</h1>
            </div>
            <div className="color-picker"> <ThemeSwitcher colors={themeColors} activeColor={activeColor}
            setActiveColor={setActiveColor}/></div>


        </header>
    </>
    )
}

export default Header;