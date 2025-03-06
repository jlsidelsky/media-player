import { useEffect, useState } from "react";
import Controls from "./Controls";
import ShuffleButton from "./ShuffleButton";
import VolumeSlider from "./VolumeSlider";
import "../styles/Settings.css";

interface SettingsProps {
  isShuffled: boolean;
  toggleShuffle: () => void;
  isPlaying: boolean;
  skipTrack: () => void;
  prevTrack: () => void;
  togglePlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}
const Settings = ({
  isShuffled,
  toggleShuffle,
  isPlaying,
  skipTrack,
  prevTrack,
  audioRef,
  togglePlayPause,
}: SettingsProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 600px)");
    setIsMobile(mediaQuery.matches);
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleMediaQueryChange);
    } else {
      //for old browsers
      mediaQuery.addListener(handleMediaQueryChange);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleMediaQueryChange);
      } else {
        //for old browsers
        mediaQuery.removeListener(handleMediaQueryChange);
      }
    };
  }, []);
  return (
    <div id={`settings-${isMobile ? "mobile" : "desktop"}`}>
      {isMobile ? (
        <>
          <Controls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onSkip={skipTrack}
            onPrev={prevTrack}
          />
          <div id="setting-bottom">
            <ShuffleButton
              isShuffled={isShuffled}
              toggleShuffle={toggleShuffle}
            />
            <VolumeSlider audioRef={audioRef} />{" "}
          </div>
        </>
      ) : (
        <>
          <ShuffleButton
            isShuffled={isShuffled}
            toggleShuffle={toggleShuffle}
          />
          <Controls
            isPlaying={isPlaying}
            onPlayPause={togglePlayPause}
            onSkip={skipTrack}
            onPrev={prevTrack}
          />
          <VolumeSlider audioRef={audioRef} />{" "}
        </>
      )}
    </div>
  );
};
export default Settings;
