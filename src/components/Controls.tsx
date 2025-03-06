import {
  faPlay,
  faPause,
  faForward,
  faBackward,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Controls.css";
interface ControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSkip: () => void;
  onPrev: () => void;
}
// play/pause skip and previous
const Controls = ({
  isPlaying,
  onPlayPause,
  onSkip,
  onPrev,
}: ControlsProps) => {
  return (
    <div className="controls">
      <button onClick={onPrev}>
        <FontAwesomeIcon icon={faBackward} />
      </button>
      <button onClick={onPlayPause}>
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button onClick={onSkip}>
        <FontAwesomeIcon icon={faForward} />
      </button>
    </div>
  );
};

export default Controls;
