import '../css/PreprocessTextArea.css';

function PreprocessTextArea( {defaultValue, onChange} ) {
    return (
    <>
    <div className="form-container">
         <div className="form-container-top">
            <label htmlFor="proc" className="form-label mb-2">Text to preprocess:</label>
        </div>
        <textarea className="form-control" rows="15" defaultValue={defaultValue} onChange={onChange} id="proc" ></textarea>
        </div>
    </>
    )
}

export default PreprocessTextArea;