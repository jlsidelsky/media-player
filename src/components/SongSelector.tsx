import { useEffect, useRef } from "react";
import playlistsData from "../data/playlists.json";
import "../styles/SongSelector.css";
import SongRow from "./SongRow";

interface SongSelectorProps {
  playlists: typeof playlistsData.playlists;
  currentPlaylistIndex: "all" | number;
  onSongSelect: (songUrl: string, songName: string) => void;
  currentTrackURL: string;
  isPlaying: boolean;
}

const SongSelector = ({
  playlists,
  currentPlaylistIndex,
  onSongSelect,
  currentTrackURL,
  isPlaying,
}: SongSelectorProps) => {
  const songListRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when playlist changes
  useEffect(() => {
    if (songListRef.current) {
      songListRef.current.scrollTop = 0;
    }
  }, [currentPlaylistIndex]);

  // get songs with playlist info based on selected playlist
  const getSongs = () => {
    return currentPlaylistIndex === "all"
      ? playlists.flatMap((playlist) =>
          playlist.tracks.map((song) => ({
            name: song.name,
            url: song.url,
            duration: song.duration,
            artist: playlist.artist,
            playlist: playlist.name,
          }))
        )
      : playlists[currentPlaylistIndex].tracks.map((song) => ({
          name: song.name,
          url: song.url,
          duration: song.duration,
          artist: playlists[currentPlaylistIndex].artist,
          playlist: playlists[currentPlaylistIndex].name,
        }));
  };
  return (
    <div className="song-selector-outer song-selector">
      <div className="song-selector-inner song-selector">
        <div className="song-list-header">
          <p id="song-list-header-name">Song</p>
          <p id="song-list-header-artist">Artist</p>
          <p id="song-list-header-playlist">Playlist</p>
          <p id="song-list-header-duration">Time</p>
        </div>

        <div className="song-list" ref={songListRef}>
          {getSongs().map((song, index) => (
            <SongRow
              key={index}
              onSongSelect={() => onSongSelect(song.url, song.name)}
              song={song}
              index={index}
              isSelected={song.url === currentTrackURL}
              isPlaying={isPlaying && song.url === currentTrackURL}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongSelector;
