import playlistsData from "./data/playlists.json";
import SongSelector from "./components/SongSelector";
import ProgressBar from "./components/ProgressBar";
import SongInfo from "./components/SongInfo";
import "./styles/App.css";
import PlaylistSelector from "./components/PlaylistSelector";
import useAudioPlayer from "./hooks/useAudioPlayer";
import Settings from "./components/Settings";

const App = () => {
  const {
    playlistIndex,
    setPlaylistIndex,
    currentTrack,
    isPlaying,
    isShuffled,
    errorMessage,
    audioRef,
    playSelectedSong,
    togglePlayPause,
    skipTrack,
    prevTrack,
    toggleShuffle,
    handleAudioError,
    getCurrentPlaylistInfo,
  } = useAudioPlayer("all");

  // Function to get current playlist info for SongInfo
  return (
    <div className="app">
      <PlaylistSelector
        playlistIndex={playlistIndex}
        onChangePlaylist={setPlaylistIndex}
      />

      <SongSelector
        playlists={playlistsData.playlists}
        currentPlaylistIndex={playlistIndex}
        onSongSelect={playSelectedSong}
        currentTrackURL={currentTrack ? currentTrack.url : ""}
        isPlaying={isPlaying}
      />

      <div id="bottom">
        {currentTrack && (
          <SongInfo track={currentTrack} playlist={getCurrentPlaylistInfo()} />
        )}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <audio
          ref={audioRef}
          src={currentTrack?.url}
          onError={handleAudioError}
        />
        <ProgressBar audioRef={audioRef} />
        <Settings
          isShuffled={isShuffled}
          toggleShuffle={toggleShuffle}
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
          audioRef={audioRef}
          skipTrack={skipTrack}
          prevTrack={prevTrack}
        />
      </div>
    </div>
  );
};

export default App;
