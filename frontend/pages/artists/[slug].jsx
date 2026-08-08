import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AlbumRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  HeadphonesRounded,
  PlayArrowRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  alpha,
} from "@mui/material";
import api from "../../utils/api";
import { PlayerContext } from "../../context/PlayerContext";

function SectionHeading({ eyebrow, title }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography variant="overline" color="primary.main">{eyebrow}</Typography>
      <Typography variant="h3" sx={{ mt: 0.5 }}>{title}</Typography>
    </Box>
  );
}

function TrackList({ tracks, onPlay, showPlays = false }) {
  if (!tracks.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 3 }}>No tracks have been added here yet.</Typography>
    );
  }

  return (
    <List disablePadding sx={{ borderTop: "1px solid", borderColor: "divider" }}>
      {tracks.map((track, index) => (
        <ListItemButton
          key={track._id}
          onClick={() => onPlay(track)}
          sx={{
            minHeight: 72,
            px: { xs: 1, md: 2 },
            borderBottom: "1px solid",
            borderColor: "divider",
            borderRadius: 0,
            transition: "background-color 160ms ease, padding 160ms ease",
            "&:hover": { bgcolor: alpha("#FFFFFF", 0.045), px: { md: 2.5 } },
            "&:hover .play-mark": { bgcolor: "primary.main", color: "#09090b" },
          }}
        >
          <Typography sx={{ width: 36, color: "text.secondary", fontVariantNumeric: "tabular-nums" }}>
            {String(index + 1).padStart(2, "0")}
          </Typography>
          <Box className="play-mark" sx={{ width: 36, height: 36, mr: 1.5, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: alpha("#FFFFFF", 0.06), color: "text.secondary", transition: "160ms ease" }}>
            <PlayArrowRounded fontSize="small" />
          </Box>
          <ListItemText
            primary={track.title}
            secondary={showPlays ? `${track.playCount || 0} plays` : track.releaseDate ? new Date(track.releaseDate).toLocaleDateString() : "From the catalog"}
            primaryTypographyProps={{ fontWeight: 750 }}
            secondaryTypographyProps={{ color: "text.secondary", mt: 0.3 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
            PLAY TRACK
          </Typography>
        </ListItemButton>
      ))}
    </List>
  );
}

export default function ArtistPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { playTrack } = useContext(PlayerContext);
  const [artist, setArtist] = useState(null);
  const [topSongs, setTopSongs] = useState([]);
  const [allSongs, setAllSongs] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [showFullDiscography, setShowFullDiscography] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchArtistData = async () => {
      try {
        const [artistResponse, albumsResponse] = await Promise.all([
          api.get(`/artist/${slug}`),
          api.get(`/artist/${slug}/albums`),
        ]);
        setArtist(artistResponse.data.artist);
        setTopSongs(artistResponse.data.topSongs || []);
        setAllSongs(artistResponse.data.allSongs || []);
        setAlbums(albumsResponse.data || []);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtistData();
  }, [slug]);

  if (loading) {
    return <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}><CircularProgress size={34} /></Box>;
  }

  if (!artist) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h3">Artist not found.</Typography>
        <Typography color="text.secondary" mt={1.5}>This page may have moved or the artist is not available yet.</Typography>
        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => router.push("/")}>Back to discover</Button>
      </Container>
    );
  }

  const visibleSongs = showFullDiscography ? allSongs : allSongs.slice(0, 5);
  const playTopTrack = (track) => playTrack(track, topSongs, { type: "artist-top-songs", artistSlug: slug });
  const playDiscographyTrack = (track) => playTrack(track, allSongs, { type: "artist-discography", artistSlug: slug });

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "relative",
          minHeight: { xs: 510, md: 590 },
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          backgroundImage: `linear-gradient(90deg, rgba(9,9,11,.97), rgba(9,9,11,.62) 48%, rgba(9,9,11,.18)), linear-gradient(0deg, #09090b, transparent 65%), url('/Soul-Dweller.JPG')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 30%, rgba(213,168,90,.13), transparent 22rem)" }} />
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pb: { xs: 6, md: 8 } }}>
          <Box sx={{ display: { md: "grid" }, gridTemplateColumns: "250px minmax(0, 1fr)", alignItems: "end", gap: 4 }}>
            <Box
              component="img"
              src={artist.image || "/iam.jpeg"}
              alt={artist.name}
              sx={{ width: { xs: 150, md: 240 }, height: { xs: 150, md: 240 }, objectFit: "cover", borderRadius: { xs: "50%", md: 4 }, border: "1px solid", borderColor: alpha("#FFFFFF", 0.18), boxShadow: "0 28px 80px rgba(0,0,0,.52)", mb: { xs: 3, md: 0 } }}
            />
            <Box>
              <Chip icon={<HeadphonesRounded />} label="FEATURED ARTIST" size="small" sx={{ mb: 2, bgcolor: alpha("#D5A85A", 0.12), color: "primary.light", fontWeight: 800, letterSpacing: ".11em" }} />
              <Typography component="h1" variant="h1" sx={{ fontSize: "clamp(3.5rem, 8vw, 7rem)" }}>{artist.name}</Typography>
              <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 700, fontSize: { md: 17 }, lineHeight: 1.7 }}>
                {artist.bio || "An independent artist telling the truth in their own frequency."}
              </Typography>
              {topSongs[0] && (
                <Button variant="contained" startIcon={<PlayArrowRounded />} onClick={() => playTopTrack(topSongs[0])} sx={{ mt: 3.5 }}>
                  Play top track
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.35fr) minmax(300px, .65fr)" }, gap: { xs: 7, lg: 8 } }}>
          <Box>
            <Box component="section">
              <SectionHeading eyebrow="MOST PLAYED" title="Start here." />
              <TrackList tracks={topSongs} onPlay={playTopTrack} showPlays />
            </Box>

            <Box component="section" sx={{ mt: { xs: 7, md: 9 } }}>
              <SectionHeading eyebrow="THE CATALOG" title="Discography." />
              <TrackList tracks={visibleSongs} onPlay={playDiscographyTrack} />
              {allSongs.length > 5 && (
                <Button
                  variant="outlined"
                  color="secondary"
                  endIcon={showFullDiscography ? <ExpandLessRounded /> : <ExpandMoreRounded />}
                  onClick={() => setShowFullDiscography((value) => !value)}
                  sx={{ mt: 2.5 }}
                >
                  {showFullDiscography ? "Show less" : `View all ${allSongs.length} tracks`}
                </Button>
              )}
            </Box>
          </Box>

          <Box component="aside">
            <SectionHeading eyebrow="FULL PROJECTS" title="Albums." />
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(3, minmax(0, 1fr))", lg: "1fr" }, gap: 2 }}>
              {albums.map((album) => (
                <Box
                  key={album._id}
                  onClick={() => router.push(`/albums/${album._id}`)}
                  role="link"
                  tabIndex={0}
                  onKeyDown={(event) => event.key === "Enter" && router.push(`/albums/${album._id}`)}
                  sx={{ display: { lg: "grid" }, gridTemplateColumns: { lg: "104px 1fr" }, alignItems: "center", gap: { lg: 2 }, p: { lg: 1 }, cursor: "pointer", borderRadius: 3, transition: "160ms ease", "&:hover": { bgcolor: alpha("#FFFFFF", 0.045), transform: "translateY(-2px)" } }}
                >
                  <Box component="img" src={album.coverImage || "/iam.jpeg"} alt={album.title} onError={(event) => { event.currentTarget.src = "/iam.jpeg"; }} sx={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 2.5, mb: { xs: 1.2, lg: 0 } }} />
                  <Box>
                    <Typography fontWeight={750}>{album.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{album.releaseDate ? new Date(album.releaseDate).getFullYear() : "Album"}</Typography>
                  </Box>
                </Box>
              ))}
              {!albums.length && (
                <Box sx={{ p: 3, border: "1px dashed", borderColor: "divider", borderRadius: 3, textAlign: "center" }}>
                  <AlbumRounded color="primary" />
                  <Typography color="text.secondary" mt={1}>No albums released yet.</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
}
