import React, { useState, useRef, useEffect } from "react";
import { songsList } from "../DataComponent/songsListData";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import { MdOutlinePauseCircleFilled, MdPlayCircleFilled } from "react-icons/md";
import { FaShuffle } from "react-icons/fa6";

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const MusicPlayer = () => {
  const [songNumber, setSongNumber] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffleMode, setShuffleMode] = useState(false);
  const audioRef = useRef(null);

  const toggleShuffleMode = () => {
    setShuffleMode(!shuffleMode);
  };

  const previousSong = () => {
    if (shuffleMode) {
      const randomIndex = Math.floor(Math.random() * songsList.length);
      setSongNumber(randomIndex);
    } else {
      setSongNumber((prevSongNumber) =>
        prevSongNumber > 0 ? prevSongNumber - 1 : songsList.length - 1
      );
    }
  };

  const nextSong = () => {
    if (shuffleMode) {
      const randomIndex = Math.floor(Math.random() * songsList.length);
      setSongNumber(randomIndex);
    } else {
      setSongNumber((prevSongNumber) =>
        prevSongNumber < songsList.length - 1 ? prevSongNumber + 1 : 0
      );
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.load();
      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Error attempting to play audio:", error);
        });
      }
    }
  }, [songNumber]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleRangeChange = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error("Error attempting to play audio:", error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="card " style={{width:"15rem ",backgroundColor:"#feffff7a"}}>
      <div className="d-flex justify-content-between  mx-3">
        <h4 className="fs-6 mt-2">Music Player</h4>
        <h6 className="mt-2">
          {songNumber + 1}/{songsList.length}
        </h6>
      </div>
      <div className="card-body d-flex flex-column align-items-center">
        <img
          className="card-img-top"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
          src={songsList[songNumber].img}
          alt="Card-cap"
        />
        <h5 className="card-title text-center">{songsList[songNumber].title}</h5>
      </div>
      <audio
        ref={audioRef}
        className="w-100"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      >
        <source src={songsList[songNumber].song} type="audio/mpeg" />
      </audio>
      <input
        type="range"
        className="form-range-track-box-shadow"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleRangeChange}
      />
      <div className="d-flex justify-content-between mx-3">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className="d-flex justify-content-start mb-3 mt-2">
        <FaShuffle onClick={toggleShuffleMode} className={shuffleMode ? "text-primary mx-4" : "mx-4"} />
        <GrCaretPrevious className="mr-4" onClick={previousSong} />
        {isPlaying ? (
          <MdOutlinePauseCircleFilled className="mx-4" onClick={togglePlayPause} />
        ) : (
          <MdPlayCircleFilled className="mx-4   " onClick={togglePlayPause} />
        )}
        <GrCaretNext className="ml-4" onClick={nextSong} />
      </div>
    </div>
  );
};

export default MusicPlayer;
