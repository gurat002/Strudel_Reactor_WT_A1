import PreprocessTextArea from './PreprocessTextArea'


function CodeInputOutputCard( {songText, setSongText} ) {
    return (
    <>
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
        
    </>
    )
}

export default CodeInputOutputCard;