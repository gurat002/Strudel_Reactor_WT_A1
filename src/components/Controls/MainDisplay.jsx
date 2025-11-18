import { useEffect, useRef, useState, useMemo } from "react";
import { VscDebugRestart , VscPlay, VscDebugStop } from "react-icons/vsc";
import { TbMultiplier2X, TbMultiplier05X } from "react-icons/tb"
import VolumeSlider from "../Sliders/VolumeSlider"
import Dock from "./Dock";
import MidiPad from "./MidiPad";
import CodeInputOutputCard from "../Editors/CodeInputOutputCard";
import { stranger_tune } from "../../tunes";
import Visualiser from "../Visualiser";
import SliderCard from "../Sliders/SliderCard";
import DJControls from "./TempoController";

export default function DockDisplayer({ globalEditor }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [tempo, setTempo] = useState(120);
    const [masterVolume, setMasterVolume] = useState(1.0);
    const [songText, setSongText] = useState(stranger_tune)

    const [reverb, setReverb] = useState(0);
    const [panning, setPanning] = useState(0.5);

        useEffect(() => {
        // Do not do anything until initialization is complete
            if (!globalEditor) return;

                // set the REPL text
                globalEditor.setCode(songText);
                if (isPlaying == true) {
                    globalEditor.repl.evaluate(songText);
                }
            console.log('setting repl')

        }, [songText, masterVolume, reverb, panning]);

        // Detect masterVolume and change
        useEffect(() => {
            if (!globalEditor) return;

            const cps = tempo / 60 / 4;

            const cmd = `
                (() => {
                    setcps(${cps});
                    all(x => x.gain(${masterVolume}));
                })()
            `;

            globalEditor.repl.evaluate(cmd);

        }, [tempo, masterVolume]);


        // Detect reverb and change  
        useEffect(() => {
            if (!globalEditor) return;

            // apply reverb to every playing pattern
            const reverbCommand = `all(x => x.room(${reverb}))`;
            globalEditor.repl.evaluate(reverbCommand);

        }, [reverb]); // run only when the reverb changes

        // Detect panning and change
        useEffect(() => {
            if (!globalEditor) return;

            // apply panning to every playing pattern
            const panningCommand = `all(x => x.pan(${panning}))`;
            console.log('pan:' + panningCommand);            
            globalEditor.repl.evaluate(panningCommand);

        }, [panning]); // run only when the panning changes




    const handlePlay = () => {
        if (globalEditor) {

            globalEditor.repl.evaluate(songText);
            setIsPlaying(true);
            // initAudioOnFirstClick();
        }
    };

    const handleStop = () => {
        if (globalEditor) {
            globalEditor.stop();
            setIsPlaying(false);
        }
    };

    

    const items = useMemo(() => [

        { icon: <VscDebugRestart  size={24} />, label: 'Restart', onClick: () => alert('Restart') },
        { icon: <TbMultiplier05X   size={24} />, label: '0.5x', onClick: () => setTempo(t => t / 2) },

        // { icon: <VscPlay size={18} />, label: 'Play', onClick: () => handlePlay },
        isPlaying
            ? { icon: <VscDebugStop size={22} />, label: 'Stop', onClick: handleStop }
            : { icon: <VscPlay size={22} />, label: 'Play', onClick: handlePlay },
        { icon: <TbMultiplier2X   size={24} />, label: '2x', onClick: () => setTempo(t => t * 2) },

        { icon: <VolumeSlider volume={masterVolume} onVolumeChange={setMasterVolume} />, },
    ]);

    return (
        <>

            <div className="row g-4">
                <div className="col-lg-7 d-flex flex-column">
                    <CodeInputOutputCard songText={songText} setSongText={setSongText}/>
                </div>
                <div className="col-lg-5 d-flex">
                    <MidiPad globalEditor={globalEditor}/>
                </div>
            </div>
            <div>

            <div className="row g-4 " >
                <div className="col-lg-7 d-flex flex-column">
                    <Visualiser/>
                    <canvas id="roll"></canvas>

                </div>

                <div className="col-lg-5 d-flex flex-column">
                    <SliderCard
                    reverb={reverb} onReverbChange={setReverb} panning={panning} onPannningChange={setPanning} />
                </div>
            </div>
            <Dock 
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={65}
            />
            </div>
        </>


    )
}

