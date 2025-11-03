import React, { useState, useEffect } from "react";

export default function DJControls({ tempo, onTempoChange }) {
  const [bpm, setBpm] = useState(tempo || 140); // set initial tempo input field

  const handleTempoInput = (e) => {
    const newBpm = Number(e.target.value); // convert input to number
    setBpm(newBpm);
    if (onTempoChange) onTempoChange(newBpm); // update tempo
  };

    return (
    <>
        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">setBPM</span>
        <input type="number" value={bpm} className="form-control" placeholder="120" aria-label="set bpm" aria-describedby="bpm_label" id="bpm_input"
        onChange={handleTempoInput}/>
        </div>


        <label htmlFor="volume_range" className="form-label">Volume</label>
        <input type="range" className="form-range" min="0" max="1" step="0.01" id="volume_range"></input>

        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="s1" />
            <label className="form-check-label" htmlFor="s1">
                s1
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="d1" />
            <label className="form-check-label" htmlFor="d1">
                d1
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="d2" />
            <label className="form-check-label" htmlFor="d2">
                d2
            </label>
        </div>
    </>
    )
}
