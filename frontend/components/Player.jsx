import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Slider,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import {
  GraphicEqRounded,
  PauseRounded,
  PlayArrowRounded,
  RepeatOneRounded,
  RepeatRounded,
  ShuffleRounded,
  SkipNextRounded,
  SkipPreviousRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
import { PlayerContext } from "../context/PlayerContext";
import api from "../utils/api";

const controlButtonSx = {
  color: "text.secondary",
  "&:hover": { color: "text.primary", bgcolor: alpha("#FFFFFF", 0.07) },
};

export default function Player() {
  const { currentTrack, setCurrentTrack, queue } = useContext(PlayerContext);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeatMode, setRepeatMode] = useState(0);
  const [shuffling, setShuffling] = useState(false);
  const [hasCounted, setHasCounted] = useState(false);
  const audioRef = useRef(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  const streamBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://fromtheheart-production-e892.up.railway.app";

  const playNext = () => {
    if (!queue?.length || !currentTrack) return;
    const currentIndex = queue.findIndex((track) => track._id === currentTrack._id);
    if (shuffling) {
      setCurrentTrack(queue[Math.floor(Math.random() * queue.length)]);
      return;
    }
    if (currentIndex === -1) {
      setCurrentTrack(queue[0]);
      return;
    }
    const nextIndex = repeatMode === 2
      ? (currentIndex + 1) % queue.length
      : Math.min(currentIndex + 1, queue.length - 1);
    if (nextIndex === currentIndex && repeatMode !== 2) {
      setPlaying(false);
      return;
    }
    setCurrentTrack(queue[nextIndex]);
  };

  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    const isCloudinary = currentTrack.fileUrl?.includes("res.cloudinary.com");
    audioRef.current.src = isCloudinary
      ? currentTrack.fileUrl
      : `${streamBaseUrl}/api/v1/music/stream/${currentTrack._id}`;
    audioRef.current.load();
    audioRef.current.play().catch((error) => console.error("Playback failed:", error));
    setPlaying(true);
    setHasCounted(false);
  }, [currentTrack, streamBaseUrl]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
      if (audio.currentTime >= 10 && !hasCounted && currentTrack?._id) {
        api.patch(`/music/increment-playcount/${currentTrack._id}`).catch((error) => {
          console.error("Error incrementing play count:", error);
        });
        setHasCounted(true);
      }
    };

    const handleEnded = () => {
      if (repeatMode === 1) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateProgress);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateProgress);
      audio.removeEventListener("ended", handleEnded);
    };
  });

  const formatTime = (time) => {
    if (!Number.isFinite(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    if (!currentTrack || !audioRef.current) return;
    if (playing) audioRef.current.pause();
    else audioRef.current.play();
    setPlaying((value) => !value);
  };

  const playPrevious = () => {
    if (!queue?.length || !currentTrack) return;
    const currentIndex = queue.findIndex((track) => track._id === currentTrack._id);
    setCurrentTrack(queue[Math.max(0, currentIndex - 1)] || queue[0]);
  };

  const coverSrc = currentTrack?.album?.coverImage || currentTrack?.albumCover || "/iam.jpeg";
  const artistName =
    currentTrack?.artist?.name ||
    currentTrack?.artistName ||
    (typeof currentTrack?.artist === "string" ? currentTrack.artist : "Artist unknown");

  const seek = (_, value) => {
    if (audioRef.current) audioRef.current.currentTime = value;
  };

  return (
    <Box
      component="aside"
      aria-label="Music player"
      sx={{
        position: "fixed",
        zIndex: 1240,
        left: { xs: 10, md: "50%" },
        right: { xs: 10, md: "auto" },
        bottom: { xs: 84, md: 16 },
        transform: { md: "translateX(-50%)" },
        width: { md: "min(1080px, calc(100vw - 40px))" },
        minHeight: { xs: 68, md: 88 },
        px: { xs: 1, md: 1.5 },
        py: { xs: 0.75, md: 1 },
        display: "grid",
        gridTemplateColumns: { xs: "1fr auto", md: "minmax(220px, 1fr) minmax(360px, 1.35fr) minmax(170px, 1fr)" },
        alignItems: "center",
        gap: { xs: 1, md: 2 },
        borderRadius: { xs: 3, md: 4 },
        bgcolor: alpha("#171517", 0.94),
        backdropFilter: "blur(26px)",
        border: "1px solid",
        borderColor: alpha("#FFFFFF", 0.11),
        boxShadow: "0 22px 70px rgba(0,0,0,.58)",
      }}
    >
      <audio ref={audioRef} />

      <Box sx={{ minWidth: 0, display: "flex", alignItems: "center", gap: 1.25 }}>
        <Box
          sx={{
            width: { xs: 50, md: 62 },
            height: { xs: 50, md: 62 },
            flex: "0 0 auto",
            borderRadius: 2.2,
            overflow: "hidden",
            bgcolor: alpha("#FFFFFF", 0.05),
            display: "grid",
            placeItems: "center",
          }}
        >
          {currentTrack ? (
            <Box component="img" src={coverSrc} alt="" sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <GraphicEqRounded sx={{ color: "primary.main" }} />
          )}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography fontWeight={750} noWrap sx={{ fontSize: { xs: 13, md: 15 } }}>
            {currentTrack?.title || "Choose something to play"}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {currentTrack ? artistName : "Your next favorite track is waiting"}
          </Typography>
        </Box>
      </Box>

      {isMobile ? (
        <>
          <IconButton aria-label={playing ? "Pause" : "Play"} onClick={togglePlay} disabled={!currentTrack} sx={{ width: 46, height: 46, bgcolor: "primary.main", color: "#09090b", "&:hover": { bgcolor: "primary.light" } }}>
            {playing ? <PauseRounded /> : <PlayArrowRounded />}
          </IconButton>
          <Slider
            value={currentTime}
            min={0}
            max={duration || 1}
            onChange={seek}
            aria-label="Track progress"
            sx={{ position: "absolute", inset: "auto 12px 1px", width: "calc(100% - 24px)", p: 0, "& .MuiSlider-thumb": { display: "none" }, "& .MuiSlider-rail": { opacity: 0.25 } }}
          />
        </>
      ) : (
        <>
          <Box>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 0.6 }}>
              <Tooltip title="Shuffle">
                <IconButton aria-label="Shuffle" onClick={() => setShuffling((value) => !value)} sx={{ ...controlButtonSx, color: shuffling ? "primary.main" : "text.secondary" }}>
                  <ShuffleRounded fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton aria-label="Previous track" onClick={playPrevious} sx={controlButtonSx}><SkipPreviousRounded /></IconButton>
              <IconButton aria-label={playing ? "Pause" : "Play"} onClick={togglePlay} disabled={!currentTrack} sx={{ width: 44, height: 44, mx: 0.3, bgcolor: "primary.main", color: "#09090b", "&:hover": { bgcolor: "primary.light", transform: "scale(1.04)" } }}>
                {playing ? <PauseRounded /> : <PlayArrowRounded />}
              </IconButton>
              <IconButton aria-label="Next track" onClick={playNext} sx={controlButtonSx}><SkipNextRounded /></IconButton>
              <Tooltip title={repeatMode === 1 ? "Repeat one" : repeatMode === 2 ? "Repeat all" : "Repeat off"}>
                <IconButton aria-label="Change repeat mode" onClick={() => setRepeatMode((value) => (value + 1) % 3)} sx={{ ...controlButtonSx, color: repeatMode ? "primary.main" : "text.secondary" }}>
                  {repeatMode === 1 ? <RepeatOneRounded fontSize="small" /> : <RepeatRounded fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "34px 1fr 34px", alignItems: "center", gap: 1 }}>
              <Typography variant="caption" color="text.secondary">{formatTime(currentTime)}</Typography>
              <Slider value={currentTime} min={0} max={duration || 1} onChange={seek} size="small" aria-label="Track progress" sx={{ "& .MuiSlider-thumb": { width: 10, height: 10 }, "& .MuiSlider-rail": { opacity: 0.25 } }} />
              <Typography variant="caption" color="text.secondary" textAlign="right">{formatTime(duration)}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
            <VolumeUpRounded sx={{ fontSize: 19, color: "text.secondary" }} />
            <Slider value={volume} onChange={(_, value) => setVolume(value)} aria-label="Volume" sx={{ width: 92, "& .MuiSlider-thumb": { width: 10, height: 10 }, "& .MuiSlider-rail": { opacity: 0.25 } }} />
          </Box>
        </>
      )}
    </Box>
  );
}
