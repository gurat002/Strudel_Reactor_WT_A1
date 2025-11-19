import '../css/Visualiser.css';


function Visualiser( ) {
    return (
    <>
        <div className="row g-0 p-0"> 
            <div className="visualiser mb-3 ">
                <div className="visualiser-card">
                    <div className="form-control">
                        <h2 className="form-label">Visualiser</h2>
                        <canvas id="roll"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default Visualiser;