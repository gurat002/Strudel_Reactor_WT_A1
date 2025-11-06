
const DJControls = ({ bpm, onTempoChange }) => {

    return (
    <>
        <div className="input-group mb-3">
        <span className="input-group-text" id="basic-addon1">setBPM</span>
        <input type="number" value={bpm} className="form-control" placeholder="140" aria-label="set bpm" aria-describedby="bpm_label" id="bpm_input"
        onChange={(e) => onTempoChange(Number(e.target.value))}/>
        </div>

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

export default DJControls;