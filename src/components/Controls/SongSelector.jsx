
import { useState, useEffect } from "react";
import { Coastline } from "../../Coastline";
import { stranger_tune } from "../../tunes";
import { hypnotic_electro } from "../../hypnotic_electro.js";
import '../../css/SongSelector.css';


const SONG_LIBRARY = [
  {
    id: 'stranger_tune_id',
    title: 'Stranger Tune',
    artist: 'Algorave Dave Remix',
    genre: 'Synth-Pop / Live Code',
    description: 'Features heavy supersaw basslines and complex drum structures.',
    code: stranger_tune // The actual code string from the file
  },
  {
    id: 'coastline_id',
    title: 'Coastline',
    artist: 'eddyflux',
    genre: 'Melodic / Atmospheric',
    description: 'A smooth, texture-heavy composition reminiscent of ocean waves.',
    code: Coastline
  },
  {
    id: 'hypnotic_electro_id', // note the song didn't have a name so i just came up with this
    title: 'hypnoticelectro',
    artist: 'Anonymous',
    genre: 'Hypnotic / Driving',
    description: 'A fast paced driving hypnotic electro-ambient groove',
    code: hypnotic_electro

  }
];

export default function SongSelector({ currentSong, onSongChange }) {
  // Determine which song is active by comparing the code strings
  const activeSongObj = SONG_LIBRARY.find(song => song.code === currentSong);
  const activeId = activeSongObj ? activeSongObj.id : null;

  // State to control which accordion panel is expanded
  const [openItemId, setOpenItemId] = useState(activeId);

  // If the currentSong prop changes externally accordion updates
  useEffect(() => {
    if (activeId) {
      setOpenItemId(activeId);
    }
  }, [activeId]);

  return (
    <div className="form-control">
    <div className="card-custom p-3 mb-3">
        <h2 className="form-label">Select Song</h2>
        <div className="row gx-2 gy-5"></div>
            <div className="song-selector-theme container my-3" style={{ maxWidth: '500px' }}>

            
            <div className="accordion" id="songAccordion">
                {SONG_LIBRARY.map((song) => {
                const isSelected = currentSong === song.code;
                const isOpen = openItemId === song.id;

                return (
                    <div 
                    key={song.id} 
                    className="accordion-item"
                    >
                    <h2 className="accordion-header">
                        <button
                        className={`accordion-button ${!isOpen ? 'collapsed' : ''}`}
                        type="button"
                        onClick={() => setOpenItemId(isOpen ? null : song.id)}
                        >
                        <strong>{song.title}</strong>
                        </button>
                    </h2>

                    <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>

                        <div className="accordion-body">
                        <p className="small mb-3">{song.description}</p>
                        
                        <button
                            className="btn btn-sm btn-strudel w-100"
                            onClick={() => onSongChange(song.code)} //ong
                            disabled={isSelected}
                        >
                            {isSelected ? 'CURRENTLY PLAYING' : 'LOAD TRACK'}
                        </button>
                        </div>
                    </div>
                    </div>
                );
                })}
            </div>
            </div>
        </div>
    </div>
            
  );
}