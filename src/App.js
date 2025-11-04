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
import PlaybackControls from './components/PlaybackControls'
import ProcessButtons from './components/ProcessButtons'
import PreprocessTextArea from './components/PreprocessTextArea'
import PlayerBar from './components/PlayerBar'
import VolumeSlider from './components/VolumeSlider'


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

        }
    }, []);
    

    useEffect(() => {
        // Do not do anything until initialization is complete
        const editorInstance = globalEditor;
            if (!editorInstance) return;
                editorInstance.setCode(songText);
                editorInstance.repl.evaluate(songText);

        }, [songText, masterVolume]);

            // runs only when masterVolume changes
        useEffect(() => {
            const editorInstance = globalEditor;
            if (!editorInstance) return;

            // apply gain to every playing pattern
            const volumeCommand = `all(x => x.gain(${masterVolume}))`;
            editorInstance.repl.evaluate(volumeCommand);

        }, [masterVolume]); // run only when the volume changes

        // run only when the tempo state changes
        useEffect(() => {
            const editorInstance = globalEditor;

            // Convert bpm to cps
            const cps = tempo / 60 / 4;

            // Send to REPL
            editorInstance.repl.evaluate(`setcps(${cps})`);

        }, [tempo]);

    const handlePlay = () => {
        const editorInstance = globalEditor;
        if (editorInstance) {

            editorInstance.repl.evaluate(songText);
        }
    };

    const handleStop = () => {
        const editorInstance = globalEditor;
        if (editorInstance) {
            editorInstance.stop();
        }
    };

    return (
        <div className="row">
            <h2>Strudel Demo</h2>
            <main>

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6" style={{ maxHeight: '50vh', overflowY: 'auto' }}>

                            <PreprocessTextArea defaultValue={songText} onChange={(e) => setSongText(e.target.value)}/>
                        </div>

                        <div className="col-md-6" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                            <label className="form-label">Output Text:</label>
                            <div id="editor" />
                            
                            {/* <div id="output" /> */}
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
                    <PlayerBar
                        onPlay={handlePlay}
                        onStop={handleStop}
                        volume={masterVolume}
                        onVolumeChange={setMasterVolume}
                    />
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
            
        </div >
    );


}