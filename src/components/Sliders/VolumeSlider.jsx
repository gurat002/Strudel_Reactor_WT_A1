import React, { useRef, useEffect } from 'react';
import '../../css/VolumeSlider.css';


const VolumeSlider = ({ volume, onVolumeChange, }) => {

    // get reference to volume slider input
    const sliderRef = useRef(null);

    // run whenever volume slider changes
    useEffect(() => {
        const slider = sliderRef.current;
        if (slider) {
            const percentage = ((volume - slider.min) / (slider.max - slider.min)) * 100; // calculate slider percentage

            // apply linear gradient background for fill effect
            slider.style.background = `linear-gradient(to right, var(--accent-color) ${percentage}%, #4d4d4d ${percentage}%)`;
        }
    }, [volume]);





    return (
    <>
        <input ref={sliderRef} type="range" className="volume-slider" min="0" max="1" step="0.01" id="volume_range" value={volume}
        onChange={(e) => onVolumeChange(Number(e.target.value))}/>

        <div className="volume-input mb-3">
            <span className="input-text" id="basic-addon1">SetVolume</span>
            <input type="number" value={volume} className="form-input" placeholder="140" aria-label="set volume" max="2" aria-describedby="volume_label" id="volume_input"
            onChange={(e) => onVolumeChange(Number(e.target.value))}/>
        </div>
    </>
    )
}
export default VolumeSlider