
import React, { useState } from 'react';
import PlaybackControls from './PlaybackControls';
import VolumeSlider from './VolumeSlider';
import '../css/PlayerBar.css';

const PlayerBar = ({ onPlay, onStop, volume, onVolumeChange }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    onPlay();
    setIsPlaying(true);
  };

  // const handlePauseClick = () => {
  //   onStop();
  //   setIsPlaying(false);
  // };

  return (
    <div className="player-bar-container">

      <div className="right-side">

      </div>


      <div className="playback-controls">
        <PlaybackControls 
          isPlaying={isPlaying} 
          onPlay={handlePlayClick} 
          // onPause={handlePauseClick} 
        />

      </div>

      <div className="extra-controls">
        
        <label htmlFor="volume_range" className="form-label">Vol</label>
        <VolumeSlider
          volume={volume} 
          onVolumeChange={onVolumeChange} 
        />
      </div>
    </div>
  );
};

export default PlayerBar;
