import { faShuffle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/ShuffleButton.css";

interface ShuffleButtonProps {
  isShuffled: boolean;
  toggleShuffle: () => void;
}

const ShuffleButton = ({ isShuffled, toggleShuffle }: ShuffleButtonProps) => {
  return (
    <div>
      <button
        className={`shuffle-button ${isShuffled && "shuffling"}`}
        onClick={toggleShuffle}
      >
        <FontAwesomeIcon icon={faShuffle} />
      </button>
    </div>
  );
};
export default ShuffleButton;
