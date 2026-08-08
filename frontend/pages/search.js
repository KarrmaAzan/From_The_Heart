import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowForwardRounded,
  MusicNoteRounded,
  SearchRounded,
} from "@mui/icons-material";
import {
  Box,
  Container,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  alpha,
} from "@mui/material";
import api from "../utils/api";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) return undefined;

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(response.data || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setSearched(true);
      }
    }, 280);

    return () => clearTimeout(timeout);
  }, [query]);

  const openResult = (item) => {
    const artistSlug = item.slug || item.artist?.slug;
    if (artistSlug) router.push(`/artists/${artistSlug}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="overline" color="primary.main">EXPLORE THE CATALOG</Typography>
      <Typography component="h1" variant="h1" sx={{ mt: 1, fontSize: "clamp(3.3rem, 8vw, 7rem)" }}>
        Follow the <Box component="span" color="primary.main" fontStyle="italic">sound.</Box>
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 560, mt: 2, fontSize: { md: 17 } }}>
        Search by artist, track, or whatever lyric is still living in your head.
      </Typography>

      <Paper
        component="label"
        elevation={0}
        sx={{
          mt: { xs: 4, md: 6 },
          height: { xs: 64, md: 78 },
          px: { xs: 2, md: 3 },
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderRadius: 999,
          bgcolor: alpha("#FFFFFF", 0.045),
          border: "1px solid",
          borderColor: alpha("#D5A85A", 0.28),
        }}
      >
        <SearchRounded color="primary" sx={{ fontSize: { xs: 26, md: 30 } }} />
        <InputBase
          autoFocus
          value={query}
          onChange={(event) => {
            const value = event.target.value;
            setQuery(value);
            if (!value.trim()) {
              setResults([]);
              setSearched(false);
            }
          }}
          placeholder="Search artists or tracks"
          inputProps={{ "aria-label": "Search artists or tracks" }}
          sx={{ flex: 1, fontSize: { xs: 16, md: 20 } }}
        />
      </Paper>

      <Box sx={{ mt: 5 }}>
        {results.length > 0 && (
          <>
            <Typography variant="overline" color="text.secondary">{results.length} RESULTS</Typography>
            <List disablePadding sx={{ mt: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
              {results.map((item, index) => (
                <ListItemButton key={item._id || `${item.title}-${index}`} onClick={() => openResult(item)} sx={{ minHeight: 78, borderBottom: "1px solid", borderColor: "divider", px: 1, "&:hover": { bgcolor: alpha("#FFFFFF", 0.045) } }}>
                  <Box sx={{ width: 44, height: 44, mr: 2, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: alpha("#D5A85A", 0.1), color: "primary.main" }}>
                    <MusicNoteRounded />
                  </Box>
                  <ListItemText primary={item.title || item.name} secondary={item.artist?.name || "Artist"} primaryTypographyProps={{ fontWeight: 750 }} secondaryTypographyProps={{ color: "text.secondary" }} />
                  <ArrowForwardRounded sx={{ color: "text.secondary" }} />
                </ListItemButton>
              ))}
            </List>
          </>
        )}

        {searched && !results.length && (
          <Box sx={{ py: 8, textAlign: "center", borderTop: "1px solid", borderColor: "divider" }}>
            <Typography variant="h4">No signal yet.</Typography>
            <Typography color="text.secondary" mt={1}>Try a different artist or track name.</Typography>
          </Box>
        )}

        {!query && (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">Start typing and we&apos;ll tune in.</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
