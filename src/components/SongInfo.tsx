import "../styles/SongInfo.css";

interface SongInfoProps {
  track: { name: string; duration: number };
  playlist: { name: string; artist: string; year: number };
}
// display song name, playlist, year, and artist
const SongInfo = ({ track, playlist }: SongInfoProps) => {
  return (
    <div className="song-info">
      <div className="song-info-name">
        <h2>{track.name}</h2>
        <p>
          {playlist.name} ({playlist.year})
        </p>
      </div>

      <h3 className="song-info-artist">{playlist.artist}</h3>
    </div>
  );
};

export default SongInfo;
