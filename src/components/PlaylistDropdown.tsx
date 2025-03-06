import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import playlistsData from "../data/playlists.json";
import "../styles/PlaylistDropdown.css";

interface PlaylistDropdownProps {
  playlistIndex: "all" | number;
  onChangePlaylist: (index: "all" | number) => void;
}

const PlaylistDropdown = ({
  playlistIndex,
  onChangePlaylist,
}: PlaylistDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (value: "all" | number) => {
    onChangePlaylist(value);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDisplayValue = () => {
    if (playlistIndex === "all") return "All Songs";
    return playlistsData.playlists[playlistIndex]?.name || "Select";
  };

  return (
    <div className="playlist-dropdown-wrapper" ref={dropdownRef}>
      <div className="playlist-dropdown-header" onClick={toggleDropdown}>
        <p>{getDisplayValue()}</p>
        <span className="playlist-dropdown-arrow">
          <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </span>
      </div>
      {isOpen && (
        <ul className="playlist-dropdown-list">
          <li
            className={playlistIndex === "all" ? "active" : ""}
            onClick={() => handleOptionClick("all")}
          >
            All Songs
          </li>
          {playlistsData.playlists.map((playlist, index) => (
            <li
              key={index}
              onClick={() => handleOptionClick(index)}
              className={playlistIndex === index ? "active" : ""}
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlaylistDropdown;
