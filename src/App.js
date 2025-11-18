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
import TempoController from './components/Controls/TempoController'
import ProcessButtons from './components/ProcessButtons'
import VolumeSlider from './components/Sliders/VolumeSlider'
import Dock from './components/Controls/Dock'
import { VscDebugRestart , VscPlay, VscDebugStop } from "react-icons/vsc";
import { TbMultiplier2X, TbMultiplier05X } from "react-icons/tb"
import Header from './components/Header.jsx'
import MidiPad from './components/Controls/MidiPad.jsx'
import CodeInputOutputCard from './components/Editors/CodeInputOutputCard.jsx'
import SliderCard from './components/Sliders/SliderCard';
import Visualiser from './components/Visualiser';
import StrudelSetup from './components/Editors/StrudelSetup';
import MainDisplay from './components/Controls/MainDisplay';


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

    const [globalEditor, setGlobalEditor] = useState(null);

    return (
    <>
        <StrudelSetup setGlobalEditor={setGlobalEditor}/>
        
        <Header/>
        <main>
                    <MainDisplay globalEditor={globalEditor}/>
        </main >
            

        </>
    );


}