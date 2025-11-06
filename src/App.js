import './css/App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import DJControls from './components/DJControls'
import ProcessButtons from './components/ProcessButtons'
import PreprocessTextArea from './components/PreprocessTextArea'
import VolumeSlider from './components/VolumeSlider'
import Dock from './components/Dock'
import { VscDebugRestart , VscPlay, VscDebugStop, VscMusic } from "react-icons/vsc";



let globalEditor = null;

const handleD3Data = (event) => {
    console.log(event.detail);
};

//  



// export function ProcAndPlay() {
//     if (globalEditor != null && globalEditor.repl.state.started == true) {
//         console.log(globalEditor)
//         Proc()
//         globalEditor.evaluate();
//     }
// }

// export function Proc() {

//     let proc_text = document.getElementById('proc').value
//     let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
//     ProcessText(proc_text);
//     globalEditor.setCode(proc_text_replaced)
// }

// export function ProcessText(match, ...args) {

//     let replace = ""
//     if (document.getElementById('flexRadioDefault2').checked) {
//         replace = "_"
//     }

//     return replace
// }

export default function StrudelDemo() {

    const hasRun = useRef(false);
    const [tempo, setTempo] = useState(140); // set tempo to default 140
    const [masterVolume, setMasterVolume] = useState(1.0);
    const [songText, setSongText] = useState(stranger_tune)
    const [isPlaying, setIsPlaying] = useState(false);



    useState(() => {

    })

    //initialize strudel env
    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
                //init canvas
                const canvas = document.getElementById('roll');
                canvas.width = canvas.width * 2;
                canvas.height = canvas.height * 2;
                const drawContext = canvas.getContext('2d');
                const drawTime = [-2, 2]; // time window of drawn haps
                globalEditor = new StrudelMirror({
                    defaultOutput: webaudioOutput,
                    getTime: () => getAudioContext().currentTime,
                    transpiler,
                    root: document.getElementById('editor'),
                    drawTime,
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0,}),
                    prebake: async () => {
                        // initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                        const loadModules = evalScope(
                            import('@strudel/core'),
                            import('@strudel/draw'),
                            import('@strudel/mini'),
                            import('@strudel/tonal'),
                            import('@strudel/webaudio'),
                        );
                        await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                    },
                });

        }
    }, []);
    

    useEffect(() => {
        // Do not do anything until initialization is complete
            if (!globalEditor) return;
                globalEditor.setCode(songText);
                globalEditor.repl.evaluate(songText);

        }, [songText, masterVolume]);

            // runs only when masterVolume changes
        useEffect(() => {
            if (!globalEditor) return;

            // apply gain to every playing pattern
            const volumeCommand = `all(x => x.gain(${masterVolume}))`;
            globalEditor.repl.evaluate(volumeCommand);

        }, [masterVolume]); // run only when the volume changes

        // run only when the tempo state changes
        useEffect(() => {
            // Convert bpm to cps
            const cps = tempo / 60 / 4;

            // Send to REPL
            globalEditor.repl.evaluate(`setcps(${cps})`);

        }, [tempo]);

    const handlePlay = () => {
        if (globalEditor) {

            globalEditor.repl.evaluate(songText);
            setIsPlaying(true);
            initAudioOnFirstClick();
        }
    };

    const handleStop = () => {
        if (globalEditor) {
            globalEditor.stop();
            setIsPlaying(false);
        }
    };

    // Create items list to be put into dock (taskbar)
    const items = [
        { icon: <VscDebugRestart  size={18} />, label: 'Restart', onClick: () => alert('Restart') },
        // { icon: <VscPlay size={18} />, label: 'Play', onClick: () => handlePlay },
        isPlaying
            ? { icon: <VscDebugStop size={22} />, label: 'Stop', onClick: handleStop }
            : { icon: <VscPlay size={22} />, label: 'Play', onClick: handlePlay },
        { icon: <VolumeSlider volume={masterVolume} onVolumeChange={setMasterVolume} />, },
    ];
    
    return (
    <>
        <header className="d-flex justify-content-between align-items-center py-3">
            <div className="d-flex align-items-center">
                <VscMusic className="music-icon"/>&nbsp;&nbsp;&nbsp;
                <h1 className="h3 fw-bold mb-0">Strudel Demo</h1>
            </div>
        </header>

            <main>
                <div className="row g-4">

                    <div className="col-lg-7 d-flex flex-column">
                            <div className="row g-0"> 

                            <div className="col-md-6" style={{overflowY: 'auto' }}>
                                <div className="card-custom p-2 d-flex flex-column">
                                    <div className="form-container">
                                        <PreprocessTextArea defaultValue={songText} onChange={(e) => setSongText(e.target.value)}/>
                                    </div>
                                </div>
                            </div>
                            

                            
                            <div className="col-md-6" style={{overflowY: 'auto' }}>
                                <div className="card-custom p-2 d-flex flex-column">
                                        <div className="form-container-top">
                                            <label htmlFor="editor" className="form-label mb-2">Output:</label>
                                        </div>
                                    <div className="form-container">

                                    <div id="editor"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="col-lg-5 d-flex">
                    <div className="form-control">
                        <div className="card-custom p-3 mb-3">
                            <h2 className="form-label">Instrument Mutes</h2>
                            <div className="row gx-2 gy-5">
                                <div className="col-3"><button className="instrument-btn">Bassline</button></div>
                                <div className="col-3"><button className="instrument-btn">Main Arp</button></div>
                                <div className="col-3"><button className="instrument-btn">...</button></div>
                                <div className="col-3"><button className="instrument-btn">...</button></div>
                                <div className="col-3"><button className="instrument-btn">Kick</button></div>
                                <div className="col-3"><button className="instrument-btn">HiHat</button></div>
                                <div className="col-3"><button className="instrument-btn">Clap</button></div>
                                <div className="col-3"><button className="instrument-btn">Other</button></div>
                            </div>
                        </div>

                    </div>

                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-lg-7 d-flex flex-column">
                    <canvas id="roll"></canvas>
                </div>
                <div className="col-lg-5 d-flex flex-column">
                    <div className="row g-0"> 
                        <div className="slider-card p-0 mb-3">
                            <div className="reverb-card">
                                <div className="form-control">

                                    <h2 className="form-label">Reverb</h2>
                                </div>
                            </div>
                        </div>
                        <div className="slider-card p-0 mb-3">
                            <div className="panning-card">
                                <div className="form-control">

                                    <h2 className="form-label">panning</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
</div>
                    
                



                    <div className="row">
            
                        <div className="col-md-4">

                            <nav>
                                <ProcessButtons />
                                <br />

                            </nav>
                        </div>
                        <div className="col-md-4">
                    <DJControls
                        tempo={tempo}
                        onTempoChange={(newBpm) => {
                            setTempo(newBpm);
                        }}
                    />
                        </div>
                    <Dock 
                        items={items}
                        panelHeight={68}
                        baseItemSize={50}
                        magnification={65}
                    />
                    </div>
                
            </main >
            

        </>
    );


}