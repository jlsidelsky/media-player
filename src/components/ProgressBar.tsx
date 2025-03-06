import React, { useState, useEffect } from "react";
import { formatTime } from "../utils/formatTime";
import "../styles/ProgressBar.css";
interface ProgressBarProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}
// song duration progress bar
const ProgressBar = ({ audioRef }: ProgressBarProps) => {
  const [progress, setProgress] = useState(0);
  const [tempProgress, setTempProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let animationFrameId: number;

    //  update slider position with song progress
    const updateProgress = () => {
      if (audioRef.current && !isDragging) {
        const currentTime = audioRef.current.currentTime || 0;
        const totalDuration = audioRef.current.duration || 1;
        setProgress((currentTime / totalDuration) * 100);
      }
      animationFrameId = requestAnimationFrame(updateProgress);
    };

    //update song duration
    const updateDuration = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration || 0);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateProgress);
      audioRef.current.addEventListener("loadedmetadata", updateDuration);
      animationFrameId = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateProgress);
        audioRef.current.removeEventListener("loadedmetadata", updateDuration);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioRef, isDragging]);

  // dragging updates temp progress without affecting playback
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setTempProgress(newProgress);
    setIsDragging(true);
  };

  // only update the song progress when the slider is released
  const handleSeekRelease = () => {
    if (audioRef.current) {
      const newTime = (tempProgress / 100) * (audioRef.current.duration || 0);
      audioRef.current.currentTime = newTime;
      setProgress(tempProgress);
    }
    setIsDragging(false);
  };

  return (
    <div className="progress-bar">
      <input
        type="range"
        min="0"
        max="100"
        step="0.1"
        value={isDragging ? tempProgress : progress}
        onChange={handleSeekChange}
        onMouseUp={handleSeekRelease}
        onTouchEnd={handleSeekRelease}
      />
      <div className="progress-bar-times">
        <p className="small">
          {formatTime(
            ((isDragging ? tempProgress : progress) / 100) * duration
          )}
        </p>
        <p className="small">{formatTime(duration)}</p>
      </div>
    </div>
  );
};

export default ProgressBar;
