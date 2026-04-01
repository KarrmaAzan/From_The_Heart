import { useEffect, useState, useContext } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import { useRouter } from "next/router";
import api from "../utils/api";
import LandingAuthModal from "../components/LandingAuthModal";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const router = useRouter();
  const { token, loading } = useContext(AuthContext);

  const [authenticated, setAuthenticated] = useState(false);
  const [artists, setArtists] = useState([]);
  const [mounted, setMounted] = useState(false);

      useEffect(() => {
  setMounted(true);
}, []);

  useEffect(() => {
    if (!loading) {
      setAuthenticated(!!token);
    }
  }, [token, loading]);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get("/artist");
        setArtists(res.data || []);
      } catch (err) {
        console.error("Error fetching artists:", err);
      }
    };


    fetchArtists();
  }, []);

  if (loading || !mounted) return null;;

  return (
    <>
      <Container sx={{ py: 4, paddingBottom: "140px" }}>
        <Typography variant="h4" color="white" gutterBottom>
          Artists
        </Typography>

       <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(3, 1fr)",
      lg: "repeat(4, 1fr)",
    },
    gap: 3,
  }}
>
  {artists.map((artist) => (
    <Card key={artist._id} sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
      <CardActionArea
        onClick={() => {
          if (!artist?.slug) {
            console.error("Artist missing slug:", artist);
            return;
          }
          router.push(`/artists/${artist.slug}`);
        }}
      >
        <img
          src={artist.image || "/iam.jpeg"}
          alt={artist.name}
          style={{ width: "100%", height: 220, objectFit: "cover" }}
        />
        <CardContent>
          <Typography variant="h6">{artist.name}</Typography>
          <Typography variant="body2" color="gray">
            {artist.bio?.slice(0, 80) || "No bio available."}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  ))}
</Box>
      </Container>

      {!authenticated && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "black",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LandingAuthModal />
        </Box>
      )}
    </>
  );
}