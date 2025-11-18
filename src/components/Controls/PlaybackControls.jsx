function PlaybackControls( {globalEditor} ) {
    return (
    <>
        <div className="btn-group" role="group">
            <button id="play" className="btn btn-outline-primary" onClick={() => globalEditor.evaluate()}>Play</button>
            <button id="stop" className="btn btn-outline-primary" onClick={() => globalEditor.stop()}>Stop</button>
        </div>
    </>
    )
}

export default PlaybackControls;