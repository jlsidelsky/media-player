import { useState, useRef, useEffect } from "react";
import playlistsData from "../data/playlists.json";
import { Song } from "../utils/songProps";

export const useAudioPlayer = (initialPlaylistIndex: "all" | number) => {
  const [playlistIndex, setPlaylistIndex] = useState<"all" | number>(
    initialPlaylistIndex
  );
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [songQueue, setSongQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Helper: Get all songs for the current playlist selection
  const getAllSongs = (): Song[] => {
    return playlistIndex === "all"
      ? playlistsData.playlists.flatMap((playlist) => playlist.tracks)
      : playlistsData.playlists[playlistIndex].tracks;
  };

  // Build queue for a selected song
  const buildQueueForSong = (selectedSong: Song) => {
    const allSongs = getAllSongs();
    const startIndex = allSongs.findIndex(
      (song) => song.url === selectedSong.url
    );

    if (isShuffled) {
      const queue = allSongs.filter((song) => song.url !== selectedSong.url);
      return queue.sort(() => Math.random() - 0.5);
    } else {
      return allSongs.slice(startIndex + 1);
    }
  };

  // Audio error handler
  const handleAudioError = () => {
    if (!audioRef.current) return;
    console.error(`Error loading track: ${currentTrack?.name}`);
    setErrorMessage(`Skipping unavailable track: ${currentTrack?.name}`);
    skipTrack();
  };

  // Play selected song
  const playSelectedSong = (songUrl: string) => {
    if (!audioRef.current) return;

    if (currentTrack?.url === songUrl) {
      // Toggle play/pause if the song is clicked again.
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    const selectedSong = getAllSongs().find((song) => song.url === songUrl);
    if (!selectedSong) return;

    setCurrentTrack(selectedSong);
    setErrorMessage(null);
    setSongQueue(buildQueueForSong(selectedSong));

    if (audioRef.current) {
      audioRef.current.src = songUrl;
      audioRef.current.load();
      const onCanPlay = () => {
        audioRef.current
          ?.play()
          .then(() => setIsPlaying(true))
          .catch((error) => console.error("Playback failed:", error));
        audioRef.current?.removeEventListener("canplaythrough", onCanPlay);
      };
      audioRef.current.addEventListener("canplaythrough", onCanPlay);
    }
  };

  // Skip track
  const skipTrack = () => {
    if (!audioRef.current) return;
    if (songQueue.length === 0) {
      const allSongs = getAllSongs();
      if (allSongs.length > 0) {
        setCurrentTrack(allSongs[0]);
        audioRef.current.src = allSongs[0].url;
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      const nextSong = songQueue[0];
      setSongQueue((prevQueue) => prevQueue.slice(1));
      setCurrentTrack(nextSong);
      setErrorMessage(null);
      audioRef.current.src = nextSong.url;
      setIsPlaying(true);
    }
  };

  // Previous track
  const prevTrack = () => {
    if (!audioRef.current || !currentTrack) return;
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else {
      const allSongs = getAllSongs();
      const currentIndex = allSongs.findIndex(
        (song) => song.url === currentTrack.url
      );
      if (currentIndex > 0) {
        const prevSong = allSongs[currentIndex - 1];
        setCurrentTrack(prevSong);
        audioRef.current.src = prevSong.url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current || currentTrack === null) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle shuffle
  const toggleShuffle = () => {
    if (!currentTrack) return;
    setIsShuffled((prev) => !prev);
    if (!isShuffled) {
      const allSongs = getAllSongs().filter(
        (song) => song.url !== currentTrack.url
      );
      setSongQueue(allSongs.sort(() => Math.random() - 0.5));
    } else {
      const allSongs = getAllSongs();
      const currentIndex = allSongs.findIndex(
        (song) => song.url === currentTrack.url
      );
      setSongQueue(allSongs.slice(currentIndex + 1));
    }
  };

  // Listen for external events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, []);

  // Auto-play when currentTrack changes, and start next song when you get to the end
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.onended = () => skipTrack();
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((error) => console.error("Auto-play blocked:", error));
    }
  }, [currentTrack]);

  const getCurrentPlaylistInfo = () => {
    if (!currentTrack)
      return { name: "", artist: "", year: new Date().getFullYear() };

    if (playlistIndex === "all") {
      const playlist = playlistsData.playlists.find((pl) =>
        pl.tracks.some((song) => song.url === currentTrack.url)
      );
      return playlist
        ? {
            name: playlist.name,
            artist: playlist.artist,
            year: new Date().getFullYear(),
          }
        : {
            name: "Unknown Playlist",
            artist: "Unknown Artist",
            year: new Date().getFullYear(),
          };
    }

    const selectedPlaylist = playlistsData.playlists[playlistIndex];
    return {
      name: selectedPlaylist.name,
      artist: selectedPlaylist.artist,
      year: new Date().getFullYear(),
    };
  };

  return {
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
  };
};

export default useAudioPlayer;
