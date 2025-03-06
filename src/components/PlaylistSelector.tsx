import playlistsData from "../data/playlists.json";
import "../styles/PlaylistSelector.css";
import PlaylistDropdown from "./PlaylistDropdown";

interface PlaylistSelectorProps {
  playlistIndex: "all" | number;
  onChangePlaylist: (index: "all" | number) => void;
}
// choose from all playlists, "deep house", or "neither and both"
const PlaylistSelector = ({
  playlistIndex,
  onChangePlaylist,
}: PlaylistSelectorProps) => {
  return (
    <div className="playlist-selector">
      <h1>Audio Player</h1>
      <PlaylistDropdown
        playlistIndex={playlistIndex}
        onChangePlaylist={onChangePlaylist}
      />
      <div className="playlist-selector-buttons">
        <button
          className={playlistIndex === "all" ? "active" : ""}
          onClick={() => onChangePlaylist("all")}
        >
          <h3> All Songs</h3>
        </button>
        {playlistsData.playlists.map((playlist, index) => (
          <button
            key={index}
            className={playlistIndex === index ? "active" : ""}
            onClick={() => onChangePlaylist(index)}
          >
            <h3>{playlist.name}</h3>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSelector;
