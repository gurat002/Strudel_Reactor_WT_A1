import { stranger_tune } from '../tunes';
import { useState, useEffect } from "react";


function ToggleInstruments( {bassline, main_arp, drums, globalEditor} ) {
console.log(globalEditor)
    const PARTS = {
  "bassline:": "bassline",
  "main_arp:":"main_arp",
  "drums:": "drums"
};
        const states = { bassline, main_arp, drums };
        let output = stranger_tune;

        for (const part in PARTS) {
            const key = PARTS[part]; 
            const isOn = states[key];

            if (isOn) {
            // remove underscore if present
            output = output.replace(`_${part}`, part);
            } else {
            // add underscore if missing
            output = output.replace(part, `_${part}`);
            }
        }

            
        if (globalEditor?.repl?.evaluate) {
            console.log('reevaluating')
            globalEditor.setCode(output)
            globalEditor.repl.evaluate(output);
    }
    };

    function MidiPad( {globalEditor} ) {
        const [bassline, setBassline] = useState(true);
        const [main_arp, setMainArp] = useState(true);
        const [drums, setDrums] = useState(true);

        useEffect(() => {
            ToggleInstruments(bassline, main_arp, drums, globalEditor)
            console.log('change registered')
        }, [bassline, main_arp, drums]);

    return (
    <>
        <div className="form-control">
            <div className="card-custom p-3 mb-3">
                <h2 className="form-label">Instrument Mutes</h2>
                <div className="row gx-2 gy-5">
                    <div className="col-3"><button className="instrument-btn" onClick={() => setBassline(!bassline)}>Bassline</button></div>
                    <div className="col-3"><button className="instrument-btn" onClick={() => setMainArp(!main_arp)}>Main Arp</button></div>
                    <div className="col-3"><button className="instrument-btn" onClick={() => setDrums(!drums)}>Drums</button></div>
                    <div className="col-3"><button className="instrument-btn">...</button></div>
                    <div className="col-3"><button className="instrument-btn">Kick</button></div>
                    <div className="col-3"><button className="instrument-btn">HiHat</button></div>
                    <div className="col-3"><button className="instrument-btn">Clap</button></div>
                    <div className="col-3"><button className="instrument-btn">Other</button></div>
                </div>
            </div>
        </div>
    </>
    )
    };

export default MidiPad;