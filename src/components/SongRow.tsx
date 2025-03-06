import { formatTime } from "../utils/formatTime";
import "../styles/SongRow.css";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
interface songProps {
  name: string;
  duration: number;
  artist: string;
  playlist: string;
}
interface SongRowProps {
  onSongSelect: () => void;
  song: songProps;
  isSelected: boolean;
  index: number;
  isPlaying: boolean;
}
// song row displayed for a given playlist's tracks
const SongRow = ({
  onSongSelect,
  song,
  isSelected,
  index,
  isPlaying,
}: SongRowProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={() => onSongSelect()}
      className={`song-row ${
        isSelected ? "song-row-selected" : "song-row-unselected"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* displays a play/pause button on hover */}
      <p className="song-row-number">
        {isHovered ? (
          isPlaying ? (
            <FontAwesomeIcon icon={faPause} />
          ) : (
            <FontAwesomeIcon icon={faPlay} />
          )
        ) : (
          index + 1
        )}
      </p>
      <p className="song-row-name">{song.name}</p>
      <p className="song-row-artist">{song.artist}</p>
      <p className="song-row-playlist">{song.playlist}</p>
      <p className="song-row-duration">{formatTime(song.duration)}</p>
    </div>
  );
};

export default SongRow;
