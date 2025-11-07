function MidiPad( {} ) {
    return (
    <>
        <div className="form-control">
            <div className="card-custom p-3 mb-3">
                <h2 className="form-label">Instrument Mutes</h2>
                <div className="row gx-2 gy-5">
                    <div className="col-3"><button className="instrument-btn">Bassline</button></div>
                    <div className="col-3"><button className="instrument-btn">Main Arp</button></div>
                    <div className="col-3"><button className="instrument-btn">...</button></div>
                    <div className="col-3"><button className="instrument-btn">...</button></div>
                    <div className="col-3"><button className="instrument-btn">Kick</button></div>
                    <div className="col-3"><button className="instrument-btn">HiHat</button></div>
                    <div className="col-3"><button className="instrument-btn">Clap</button></div>
                    <div className="col-3"><button className="instrument-btn">Other</button></div>
                </div>
            </div>

        </div>
    </>
    )
}

export default MidiPad;