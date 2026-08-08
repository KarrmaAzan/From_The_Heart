import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AccessTimeRounded,
  ArrowBackRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  alpha,
} from "@mui/material";
import api from "../../utils/api";
import { PlayerContext } from "../../context/PlayerContext";

export default function AlbumDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { playTrack } = useContext(PlayerContext);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAlbum = async () => {
      try {
        const response = await api.get(`/albums/${id}`);
        setAlbum(response.data);
      } catch (error) {
        console.error("Error loading album:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  if (loading) {
    return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress size={34} /></Box>;
  }

  if (!album) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3">Album not found.</Typography>
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => router.back()}>Go back</Button>
      </Container>
    );
  }

  const songs = album.songs || [];
  const playSong = (song) => playTrack(song, songs, { type: "album", albumId: album._id });

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid",
          borderColor: "divider",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -40,
            backgroundImage: `linear-gradient(rgba(9,9,11,.62), #09090b 90%), url('${album.coverImage || "/iam.jpeg"}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(44px) saturate(.65)",
            opacity: 0.65,
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, py: { xs: 4, md: 8 } }}>
          <IconButton aria-label="Go back" onClick={() => router.back()} sx={{ mb: { xs: 3, md: 5 }, bgcolor: alpha("#FFFFFF", 0.06), border: "1px solid", borderColor: "divider" }}>
            <ArrowBackRounded />
          </IconButton>
          <Box sx={{ display: { sm: "grid" }, gridTemplateColumns: { sm: "220px 1fr", md: "300px 1fr" }, gap: { sm: 4, md: 6 }, alignItems: "end" }}>
            <Box component="img" src={album.coverImage || "/iam.jpeg"} alt={album.title} sx={{ width: { xs: 190, sm: 220, md: 300 }, aspectRatio: "1", objectFit: "cover", borderRadius: 4, boxShadow: "0 30px 90px rgba(0,0,0,.55)", border: "1px solid", borderColor: alpha("#FFFFFF", 0.13), mb: { xs: 3, sm: 0 } }} />
            <Box>
              <Typography variant="overline" color="primary.main">ALBUM</Typography>
              <Typography component="h1" variant="h1" sx={{ mt: 0.8, fontSize: "clamp(3rem, 7vw, 6.6rem)" }}>{album.title}</Typography>
              <Typography color="text.secondary" sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {album.artist?.name && <Box component="span" color="text.primary" fontWeight={750}>{album.artist.name}</Box>}
                {album.releaseDate && <Box component="span">· {new Date(album.releaseDate).getFullYear()}</Box>}
                <Box component="span">· {songs.length} {songs.length === 1 ? "track" : "tracks"}</Box>
              </Typography>
              {songs[0] && (
                <Button variant="contained" startIcon={<PlayArrowRounded />} onClick={() => playSong(songs[0])} sx={{ mt: 3.5 }}>
                  Play album
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "end", mb: 3 }}>
          <Box>
            <Typography variant="overline" color="primary.main">SIDE A — ONWARD</Typography>
            <Typography variant="h3" mt={0.6}>Tracklist.</Typography>
          </Box>
          <AccessTimeRounded sx={{ color: "text.secondary", fontSize: 19, mb: 0.6 }} />
        </Box>
        <List disablePadding sx={{ borderTop: "1px solid", borderColor: "divider" }}>
          {songs.map((song, index) => (
            <ListItemButton
              key={song._id}
              onClick={() => playSong(song)}
              sx={{ minHeight: 76, px: { xs: 1, sm: 2 }, borderBottom: "1px solid", borderColor: "divider", "&:hover": { bgcolor: alpha("#FFFFFF", 0.045) }, "&:hover .album-play": { bgcolor: "primary.main", color: "#09090b" } }}
            >
              <Typography color="text.secondary" sx={{ width: 38 }}>{String(index + 1).padStart(2, "0")}</Typography>
              <Box className="album-play" sx={{ width: 38, height: 38, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: alpha("#FFFFFF", 0.06), color: "text.secondary", mr: 1.5, transition: "160ms ease" }}>
                <PlayArrowRounded fontSize="small" />
              </Box>
              <ListItemText primary={song.title} secondary={album.artist?.name || "Karrma's Heart"} primaryTypographyProps={{ fontWeight: 750 }} secondaryTypographyProps={{ color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">{song.duration || "—"}</Typography>
            </ListItemButton>
          ))}
        </List>
        {!songs.length && (
          <Box sx={{ p: 5, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
            <Typography variant="h5">The tracklist is coming soon.</Typography>
            <Typography color="text.secondary" mt={1}>This album does not have any published songs yet.</Typography>
          </Box>
        )}
      </Container>
    </>
  );
}
