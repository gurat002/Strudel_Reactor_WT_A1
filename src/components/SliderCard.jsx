import '../css/SliderCard.css';
import React, { useRef, useEffect } from 'react';


function SliderCard( {reverb, onReverbChange }) {


    const reverbSliderRef = useRef(null);

    // run whenever volume slider changes
    useEffect(() => {
        const reverbSlider = reverbSliderRef.current;
        if (reverbSlider) {
            const percentage = ((reverb - reverbSlider.min) / (reverbSlider.max - reverbSlider.min)) * 100; // calculate slider percentage

            // apply linear gradient background for fill effect
            reverbSlider.style.background = `linear-gradient(to right, var(--accent-color) ${percentage}%, #4d4d4d ${percentage}%)`;
        }
    }, [reverb]);

    return (
    <>
        <div className="row g-0 p-0"> 
            <div className="slider-card mb-3">
                <div className="reverb-card">
                    <div className="form-control">
                        <div className="row"> 
                            <div className="col-lg-2">
                                <h2 className="form-label">Reverb</h2>
                             </div>
                        </div>
                        <div className="row"> 
                                <input ref={reverbSliderRef} type="range" className="slider" min="0" max="1" step="0.01" id="reverb_range" value={reverb}
                                onChange={(e) => onReverbChange(Number(e.target.value))}/>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>

            <div className="slider-card p-0 mb-3">
                <div className="panning-card">
                    <div className="form-control">

                        <div className="row"> 
                            <div className="col-lg-2">
                                <h2 className="form-label">Panning</h2>
                             </div>
                            <div className="col-lg-10">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </>
    )
}

export default SliderCard;