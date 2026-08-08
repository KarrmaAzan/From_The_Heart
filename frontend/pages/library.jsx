import { useRouter } from "next/router";
import {
  ArrowForwardRounded,
  FavoriteRounded,
  HistoryRounded,
  LibraryMusicRounded,
} from "@mui/icons-material";
import { Box, Button, Container, Typography, alpha } from "@mui/material";

const collections = [
  {
    title: "Liked tracks",
    description: "The songs you never want to lose.",
    icon: FavoriteRounded,
    accent: "#B45A63",
  },
  {
    title: "Recently played",
    description: "Find your way back to the last sound.",
    icon: HistoryRounded,
    accent: "#D5A85A",
  },
  {
    title: "Your playlists",
    description: "Mixes made for every version of you.",
    icon: LibraryMusicRounded,
    accent: "#758B78",
  },
];

export default function Library() {
  const router = useRouter();

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 360, md: 420 },
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          p: { xs: 3, sm: 5, md: 7 },
          borderRadius: 5,
          backgroundImage: "linear-gradient(90deg, rgba(8,8,10,.98), rgba(8,8,10,.52)), url('/iam.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          border: "1px solid",
          borderColor: alpha("#FFFFFF", 0.09),
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1, maxWidth: 690 }}>
          <Typography variant="overline" color="primary.main">YOUR COLLECTION</Typography>
          <Typography component="h1" variant="h1" sx={{ mt: 1, fontSize: "clamp(3.1rem, 7vw, 6.6rem)" }}>
            Your sound,<br />kept <Box component="span" color="primary.main" fontStyle="italic">close.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 520, mt: 2.5, fontSize: { md: 17 }, lineHeight: 1.7 }}>
            Every favorite, repeat, and late-night discovery belongs here.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5, mt: 3 }}>
        {collections.map(({ title, description, icon: Icon, accent }) => (
          <Box
            key={title}
            sx={{
              minHeight: 230,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: 3,
              borderRadius: 4,
              bgcolor: "#141315",
              border: "1px solid",
              borderColor: alpha("#FFFFFF", 0.08),
              transition: "transform 180ms ease, border-color 180ms ease",
              "&:hover": { transform: "translateY(-4px)", borderColor: alpha(accent, 0.5) },
            }}
          >
            <Box sx={{ width: 52, height: 52, display: "grid", placeItems: "center", borderRadius: "50%", color: accent, bgcolor: alpha(accent, 0.12) }}>
              <Icon />
            </Box>
            <Box>
              <Typography variant="h5">{title}</Typography>
              <Typography color="text.secondary" mt={0.8}>{description}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: { xs: 6, md: 8 }, py: { xs: 5, md: 7 }, px: 3, textAlign: "center", borderTop: "1px solid", borderColor: "divider" }}>
        <Typography variant="h3">Ready to find another favorite?</Typography>
        <Typography color="text.secondary" mt={1.5}>Head back to the roster and follow the sound.</Typography>
        <Button variant="contained" endIcon={<ArrowForwardRounded />} onClick={() => router.push("/")} sx={{ mt: 3 }}>Browse artists</Button>
      </Box>
    </Container>
  );
}
