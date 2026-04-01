import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import api from "../utils/api";

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        const res = await api.get(`/search?query=${encodeURIComponent(query)}`);
        setResults(res.data || []);
      } catch (err) {
        console.error("Search error:", err.response?.data || err.message);
      }
    };

    fetchResults();
  }, [query]);

  const handleResultClick = (item) => {
    const artistSlug = item.slug || item.artist?.slug;

    if (!artistSlug) {
      console.error("Missing artist slug in search result:", item);
      return;
    }

    router.push(`/artists/${artistSlug}`);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" color="white" gutterBottom>
        Search Results
      </Typography>

      <Typography color="gray" sx={{ mb: 2 }}>
        Query: {query}
      </Typography>

      <List>
        {results.map((item) => (
          <ListItem key={item._id} disablePadding>
            <ListItemButton onClick={() => handleResultClick(item)}>
              <ListItemText
                primary={item.title || item.name}
                secondary={item.artist?.name || ""}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
}