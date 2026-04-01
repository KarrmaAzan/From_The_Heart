import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Popper,
  Paper,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemText as MUIListItemText,
  ListItemButton,
} from '@mui/material';
import { Home, Search, LibraryMusic, Person } from '@mui/icons-material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from "../utils/api";

const MobileNavbar = styled(AppBar)`
  position: fixed;
  bottom: 0;
  top: auto;
  background-color: #1E1E1E;
`;

const DesktopNavbar = styled(AppBar)`
  background-color: #1E1E1E;
  padding: 10px 20px;
  box-shadow: none;
`;

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorElSearch, setAnchorElSearch] = useState(null);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleAvatarClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setDrawerOpen(false);
    window.location.reload();
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (val.trim() !== "") {
      try {
        const res = await api.get(`/search?query=${encodeURIComponent(val)}`);
        setSearchResults(res.data || []);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  if (!mounted) return null;

  const desktopContent = (
    <DesktopNavbar position="static">
      <Toolbar
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
      >
        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexShrink: 0, position: 'relative' }}>
          <InputBase
            placeholder="Search music..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={(e) => setAnchorElSearch(e.currentTarget)}
            onBlur={() => {
              setTimeout(() => setAnchorElSearch(null), 200);
            }}
            sx={{
              backgroundColor: '#333',
              padding: '8px 12px',
              borderRadius: '20px',
              color: '#FFF',
              width: '300px',
              transition: '0.3s',
            }}
          />

          {anchorElSearch && (
            <Popper open={Boolean(anchorElSearch)} anchorEl={anchorElSearch} style={{ zIndex: 1400 }}>
              <Paper sx={{ width: '300px', mt: 1 }}>
                <MUIList>
                  {searchResults.map((result) => (
                    <MUIListItem key={result._id || result.title} disablePadding>
                      <ListItemButton
                        onMouseDown={() => {
  const artistSlug =
    result.slug || result.artist?.slug;

  if (!artistSlug) {
    console.error("Missing artist slug in search result:", result);
    return;
  }

  router.push(`/artists/${artistSlug}`);
  setAnchorElSearch(null);
}}
                      >
                        <MUIListItemText
                          primary={result.title}
                          secondary={result.artist?.name || "Unknown Artist"}
                        />
                      </ListItemButton>
                    </MUIListItem>
                  ))}
                </MUIList>
              </Paper>
            </Popper>
          )}

          <Link href="/" passHref>
            <IconButton color="secondary">
              <Home fontSize="large" />
            </IconButton>
          </Link>

          <Link href="/library" passHref>
            <IconButton color="secondary">
              <LibraryMusic fontSize="large" />
            </IconButton>
          </Link>

          {isAuthenticated ? (
            <IconButton color="secondary" onClick={handleAvatarClick}>
              <Avatar>U</Avatar>
            </IconButton>
          ) : (
            <IconButton color="secondary">
              <Person fontSize="large" />
            </IconButton>
          )}
        </Box>
      </Toolbar>

      {isAuthenticated && (
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={handleDrawerClose}
          sx={{
            "& .MuiDrawer-paper": { width: "30%" },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Account Settings
            </Typography>

            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}
    </DesktopNavbar>
  );

  const mobileContent = (
    <MobileNavbar>
      <Toolbar sx={{ justifyContent: 'space-around', alignItems: 'center' }}>
        <Link href="/" passHref>
          <IconButton color="secondary">
            <Home fontSize="large" />
          </IconButton>
        </Link>

        <Link href="/search" passHref>
          <IconButton color="secondary">
            <Search fontSize="large" />
          </IconButton>
        </Link>

        <Link href="/library" passHref>
          <IconButton color="secondary">
            <LibraryMusic fontSize="large" />
          </IconButton>
        </Link>

        {!isAuthenticated && (
          <IconButton color="secondary">
            <Person fontSize="large" />
          </IconButton>
        )}
      </Toolbar>
    </MobileNavbar>
  );

  return isMobile ? mobileContent : desktopContent;
}