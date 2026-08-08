import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowForwardRounded,
  AutoAwesomeRounded,
  GraphicEqRounded,
  HeadphonesRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Container,
  Skeleton,
  Typography,
  alpha,
} from "@mui/material";
import api from "../utils/api";
import LandingAuthModal from "../components/LandingAuthModal";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { token, loading } = useContext(AuthContext);
  const [artists, setArtists] = useState([]);
  const [artistsLoading, setArtistsLoading] = useState(true);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await api.get("/artist");
        setArtists(response.data || []);
      } catch (error) {
        console.error("Error fetching artists:", error);
      } finally {
        setArtistsLoading(false);
      }
    };

    fetchArtists();
  }, []);

  if (loading) return null;

  return (
    <>
      <Box
        component="section"
        sx={{
          position: "relative",
          minHeight: { xs: 610, md: 680 },
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          borderBottom: "1px solid",
          borderColor: alpha("#FFFFFF", 0.08),
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(90deg, rgba(9,9,11,.98) 0%, rgba(9,9,11,.76) 42%, rgba(9,9,11,.18) 78%), linear-gradient(0deg, #09090b 0%, transparent 52%), url('/TSD-banner.PNG')",
            backgroundSize: "cover",
            backgroundPosition: { xs: "62% center", md: "center 46%" },
            filter: "saturate(.72) contrast(1.06)",
            transform: "scale(1.02)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle at 73% 40%, rgba(213,168,90,.16), transparent 24rem)",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1, pb: { xs: 8, md: 10 } }}>
          <Box sx={{ maxWidth: 780 }}>
            <Chip
              icon={<AutoAwesomeRounded />}
              label="INDEPENDENT SOUND · UNFILTERED STORIES"
              size="small"
              sx={{
                mb: 3,
                color: "primary.light",
                border: "1px solid",
                borderColor: alpha("#D5A85A", 0.32),
                bgcolor: alpha("#09090B", 0.52),
                backdropFilter: "blur(10px)",
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: ".12em",
              }}
            />
            <Typography component="h1" variant="h1" sx={{ maxWidth: 720 }}>
              Music with a <Box component="span" sx={{ color: "primary.main", fontStyle: "italic" }}>pulse.</Box>
              <br />Stories with a soul.
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 550, mt: 3, fontSize: { xs: 16, md: 18 }, lineHeight: 1.7 }}>
              Step into Karrma&apos;s Heart—a home for records made from real moments, honest writing, and the voices behind the sound.
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 4 }}>
              <Button variant="contained" color="primary" endIcon={<ArrowForwardRounded />} href="#artists">
                Meet the artists
              </Button>
              <Button variant="outlined" color="secondary" startIcon={<HeadphonesRounded />} onClick={() => router.push("/library")}>
                Open your library
              </Button>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: { xs: 3, md: 6 }, mt: { xs: 6, md: 8 } }}>
            {[
              [artists.length || "—", "Artists"],
              ["24/7", "Open studio"],
              ["100%", "Independent"],
            ].map(([value, label]) => (
              <Box key={label}>
                <Typography variant="h5" sx={{ color: "text.primary" }}>{value}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      <Container id="artists" maxWidth="xl" sx={{ py: { xs: 7, md: 11 } }}>
        <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 2, mb: 4.5 }}>
          <Box>
            <Typography variant="overline" color="primary.main">THE ROSTER</Typography>
            <Typography variant="h2" mt={0.8}>Voices worth knowing.</Typography>
          </Box>
          <Typography color="text.secondary" sx={{ display: { xs: "none", md: "block" }, maxWidth: 380, textAlign: "right" }}>
            Artists building their own worlds, one track at a time.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          {artistsLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} variant="rounded" height={390} sx={{ borderRadius: 4, bgcolor: alpha("#FFFFFF", 0.05) }} />
              ))
            : artists.map((artist, index) => (
                <Card key={artist._id} sx={{ overflow: "hidden", borderRadius: 4, bgcolor: "#121113" }}>
                  <CardActionArea
                    onClick={() => artist?.slug && router.push(`/artists/${artist.slug}`)}
                    sx={{ position: "relative", display: "block", height: { xs: 390, md: 430 }, "&:hover img": { transform: "scale(1.045)" } }}
                  >
                    <Box
                      component="img"
                      src={artist.image || "/iam.jpeg"}
                      alt={artist.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(.82)", transition: "transform 500ms ease" }}
                    />
                    <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(6,6,8,.96), rgba(6,6,8,.05) 66%)" }} />
                    <Box sx={{ position: "absolute", inset: "auto 0 0", p: { xs: 2.5, md: 3 } }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 2 }}>
                        <Box>
                          <Typography variant="caption" color="primary.main" fontWeight={800} letterSpacing=".13em">
                            ARTIST {String(index + 1).padStart(2, "0")}
                          </Typography>
                          <Typography variant="h4" mt={0.6}>{artist.name}</Typography>
                          <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 390 }}>
                            {artist.bio?.slice(0, 96) || "An independent voice with something real to say."}
                          </Typography>
                        </Box>
                        <Box sx={{ width: 44, height: 44, flex: "0 0 auto", display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "primary.main", color: "#09090b" }}>
                          <ArrowForwardRounded />
                        </Box>
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              ))}
        </Box>

        {!artistsLoading && artists.length === 0 && (
          <Box sx={{ p: { xs: 4, md: 7 }, textAlign: "center", border: "1px dashed", borderColor: alpha("#FFFFFF", 0.14), borderRadius: 4 }}>
            <GraphicEqRounded color="primary" sx={{ fontSize: 34, mb: 1.5 }} />
            <Typography variant="h5">The next voice is on the way.</Typography>
            <Typography color="text.secondary" mt={1}>Check back soon for new artist stories and releases.</Typography>
          </Box>
        )}
      </Container>

      {!token && <LandingAuthModal />}
    </>
  );
}
