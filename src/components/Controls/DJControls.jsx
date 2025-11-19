import './ThemeSwitcher.jsx';
import '../../css/App.css'


const DJControls = ({ bpm, onTempoChange }) => {

    return (
    <>
        <div className="tempo-input mb-3">
        <span className="input-text" id="basic-addon1">setBPM</span>
        <input type="number" value={bpm} className="form-input" placeholder="140" aria-label="set bpm" aria-describedby="bpm_label" id="bpm_input"
        onChange={(e) => onTempoChange(Number(e.target.value))}/>
        </div>
    </>
    )
}

export default DJControls;