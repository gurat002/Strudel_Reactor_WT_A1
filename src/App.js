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
import { VscDebugRestart , VscPlay, VscDebugStop } from "react-icons/vsc";
import { TbMultiplier2X, TbMultiplier05X } from "react-icons/tb"
import Header from './components/Header.jsx'
import MidiPad from './components/MidiPad.jsx'
import CodeInputOutputCard from './components/CodeInputOutputCard.jsx'
import SliderCard from './components/SliderCard';
import Visualiser from './components/Visualiser';

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
    const [reverb, setReverb] = useState(0);
    const [panning, setPanning] = useState(0.5);

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
                        initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
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

            // apply gain to every playing pattern
            const volumeCommand = `all(x => x.gain(${masterVolume}))`;
            globalEditor.repl.evaluate(volumeCommand);
            console.log('evaluating volume' + volumeCommand)

        }, [masterVolume]); // run only when the volume changes

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

        { icon: <VscDebugRestart  size={24} />, label: 'Restart', onClick: () => alert('Restart') },
        { icon: <TbMultiplier05X   size={24} />, label: '0.5x', onClick: () => setTempo(tempo/2) },

        // { icon: <VscPlay size={18} />, label: 'Play', onClick: () => handlePlay },
        isPlaying
            ? { icon: <VscDebugStop size={22} />, label: 'Stop', onClick: handleStop }
            : { icon: <VscPlay size={22} />, label: 'Play', onClick: handlePlay },
        { icon: <TbMultiplier2X   size={24} />, label: '2x', onClick: () => setTempo(tempo*2) },

        { icon: <VolumeSlider volume={masterVolume} onVolumeChange={setMasterVolume} />, },
    ];
    
    return (
    <>
        <Header/>
        <main>
            <div className="row g-4">
                <div className="col-lg-7 d-flex flex-column">
                    <CodeInputOutputCard songText={songText} setSongText={setSongText}/>
                </div>
                <div className="col-lg-5 d-flex">
                    <MidiPad globalEditor={globalEditor}/>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-lg-7 d-flex flex-column">
                    <Visualiser/>
                    <canvas id="roll"></canvas>

                </div>

                <div className="col-lg-5 d-flex flex-column">
                    <SliderCard
                    reverb={reverb} onReverbChange={setReverb} panning={panning} onPannningChange={setPanning} />
                </div>
            </div>

                <div className="col-lg-3 d-flex flex-column">
                    <DJControls
                        tempo={tempo}
                        onTempoChange={(newBpm) => {
                            setTempo(newBpm);
                        }}
                    />
                </div>
                <div className="row">
        
                    <div className="col-md-4">

                        <nav>
                            <ProcessButtons />
                            <br />

                        </nav>
                    </div>
                    <div className="col-md-4">

                    </div>
                </div>
                <Dock 
                    items={items}
                    panelHeight={68}
                    baseItemSize={50}
                    magnification={65}
                />
        </main >
            

        </>
    );


}