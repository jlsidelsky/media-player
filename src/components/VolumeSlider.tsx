import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/VolumeSlider.css";
import { faVolumeHigh, faVolumeOff } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface VolumeSliderProps {
  audioRef: React.RefObject<HTMLAudioElement>;
}

const VolumeSlider = ({ audioRef }: VolumeSliderProps) => {
  const [volume, setVolume] = useState(1);

  // exponential volume scaling because human sound perception is logarithmic
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const linearValue = parseFloat(e.target.value);
    const logValue = Math.pow(linearValue, 2);
    if (audioRef.current) {
      audioRef.current.volume = logValue;
    }
    setVolume(linearValue);
  };

  const muteVolume = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0;
    }
    setVolume(0);
  };
  const maxVolume = () => {
    if (audioRef.current) {
      audioRef.current.volume = 1;
    }
    setVolume(1);
  };

  return (
    <div className="volume-slider">
      <FontAwesomeIcon icon={faVolumeOff} size="lg" onClick={muteVolume} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleVolumeChange}
      />
      <FontAwesomeIcon icon={faVolumeHigh} size="lg" onClick={maxVolume} />
    </div>
  );
};
export default VolumeSlider;
