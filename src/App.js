import './App.css';
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
import PlayButtons from './components/PlayButtons'
import ProcessButtons from './components/ProcessButtons'
import PreprocessTextArea from './components/PreprocessTextArea'


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

    const handlePlay = () => {
        globalEditor.evaluate()
        console.log(globalEditor);
    }

    const handleStop = () => {
        globalEditor.stop()
    }

    const [songText, setSongText] = useState(stranger_tune)

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
                    onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
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
                
            document.getElementById('proc').value = stranger_tune
            // SetupButtons()
            // Proc()
        }
        globalEditor.setCode(songText)
    }, [songText]);

    // applies changed tempo
    useEffect(() => {
        // check that Strudel has loaded
        const checkReady = setInterval(() => {
        if (globalEditor?.repl?.evaluate) {
            clearInterval(checkReady); // clear if loaded/ready

            // def helper method to change tempo
            globalEditor.__setTempo = (bpm) => {
            const cps = bpm / 60 / 4; // // takes a BPM value and converts it to CPS which is what strudel uses
            globalEditor.repl.evaluate(`setcps(${cps})`);
            };

            globalEditor.__setTempo(tempo); // set tempo
        }
        }, 250); // check if ready every 250 milliseconds

        return () => clearInterval(checkReady); // stop to prevent duplicate timers
    }, [tempo]);


    return (
        <div>
            <h2>Strudel Demo</h2>
            <main>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>

                            <PreprocessTextArea defaultValue={songText} onChange={(e) => setSongText(e.target.value)}/>
                        </div>
                        <div className="col-md-4">

                            <nav>
                                <ProcessButtons />
                                <br />
                                <PlayButtons onPlay={handlePlay} onStop={handleStop}/>

                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            <div id="output" />
                        </div>
                        <div className="col-md-4">
                    <DJControls
                    tempo={tempo}
                    onTempoChange={(newBpm) => {
                        setTempo(newBpm);
                    }}
                    />
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );


}