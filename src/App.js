import './css/App.css';
import { useEffect, useRef, useState } from "react";
import Header from './components/Header.jsx'
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