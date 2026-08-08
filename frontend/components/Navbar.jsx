import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  FavoriteRounded,
  HomeRounded,
  LibraryMusicRounded,
  LogoutRounded,
  PersonRounded,
  SearchRounded,
} from "@mui/icons-material";
import api from "../utils/api";

const navItems = [
  { href: "/", label: "Discover", icon: HomeRounded },
  { href: "/search", label: "Search", icon: SearchRounded },
  { href: "/library", label: "Library", icon: LibraryMusicRounded },
];

function Brand() {
  return (
    <Link href="/" aria-label="Karrma's Heart home">
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: "fit-content" }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            color: "primary.main",
            border: "1px solid",
            borderColor: alpha("#D5A85A", 0.45),
            background: "radial-gradient(circle at 30% 25%, rgba(213,168,90,.22), rgba(255,255,255,.02))",
          }}
        >
          <FavoriteRounded sx={{ fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "Georgia, serif", fontSize: 17, lineHeight: 1, letterSpacing: ".04em" }}>
            KARRMA&apos;S
          </Typography>
          <Typography variant="overline" color="primary.main" sx={{ display: "block", fontSize: 9, lineHeight: 1.4 }}>
            HEART
          </Typography>
        </Box>
      </Box>
    </Link>
  );
}

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => typeof window !== "undefined" && Boolean(localStorage.getItem("token")),
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorElSearch, setAnchorElSearch] = useState(null);

  useEffect(() => {
    if (!searchQuery.trim()) return undefined;

    const timeout = setTimeout(async () => {
      try {
        const response = await api.get(`/search?query=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const desktopLinks = useMemo(() => navItems.filter((item) => item.href !== "/search"), []);

  const openResult = (result) => {
    const artistSlug = result.slug || result.artist?.slug;
    if (!artistSlug) return;
    router.push(`/artists/${artistSlug}`);
    setSearchQuery("");
    setAnchorElSearch(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setDrawerOpen(false);
    router.push("/");
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: 1200,
          color: "text.primary",
          backgroundColor: alpha("#09090B", 0.78),
          backdropFilter: "blur(22px)",
          borderBottom: "1px solid",
          borderColor: alpha("#FFFFFF", 0.075),
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            width: "min(100% - 32px, 1440px)",
            minHeight: { xs: 68, md: 76 },
            mx: "auto",
            display: "grid",
            gridTemplateColumns: { xs: "1fr auto", md: "1fr auto 1fr" },
            gap: 2,
          }}
        >
          <Brand />

          {!isMobile && (
            <Box component="nav" aria-label="Primary navigation" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {desktopLinks.map(({ href, label, icon: Icon }) => {
                const active = router.pathname === href;
                return (
                  <Link href={href} key={href}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        px: 1.8,
                        py: 1,
                        borderRadius: 999,
                        color: active ? "text.primary" : "text.secondary",
                        bgcolor: active ? alpha("#FFFFFF", 0.07) : "transparent",
                        transition: "160ms ease",
                        "&:hover": { color: "text.primary", bgcolor: alpha("#FFFFFF", 0.05) },
                      }}
                    >
                      <Icon sx={{ fontSize: 18, color: active ? "primary.main" : "inherit" }} />
                      <Typography variant="body2" fontWeight={700}>{label}</Typography>
                    </Box>
                  </Link>
                );
              })}
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
            {!isMobile && (
              <Box sx={{ position: "relative" }}>
                <Paper
                  component="label"
                  elevation={0}
                  sx={{
                    width: { md: 230, lg: 290 },
                    height: 42,
                    px: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: 999,
                    bgcolor: alpha("#FFFFFF", 0.055),
                    border: "1px solid",
                    borderColor: anchorElSearch ? alpha("#D5A85A", 0.5) : alpha("#FFFFFF", 0.08),
                  }}
                >
                  <SearchRounded sx={{ color: "text.secondary", fontSize: 20 }} />
                  <InputBase
                    placeholder="Search artists or tracks"
                    value={searchQuery}
                    onChange={(event) => {
                      const value = event.target.value;
                      setSearchQuery(value);
                      if (!value.trim()) setSearchResults([]);
                    }}
                    onFocus={(event) => setAnchorElSearch(event.currentTarget)}
                    onBlur={() => setTimeout(() => setAnchorElSearch(null), 180)}
                    inputProps={{ "aria-label": "Search artists or tracks" }}
                    sx={{ flex: 1, fontSize: 14 }}
                  />
                </Paper>
                <Popper open={Boolean(anchorElSearch && searchQuery)} anchorEl={anchorElSearch} placement="bottom-end" sx={{ zIndex: 1400 }}>
                  <Paper
                    sx={{
                      width: { md: 300, lg: 340 },
                      mt: 1.25,
                      p: 1,
                      bgcolor: alpha("#171517", 0.96),
                      border: "1px solid",
                      borderColor: alpha("#FFFFFF", 0.1),
                      boxShadow: "0 22px 70px rgba(0,0,0,.48)",
                    }}
                  >
                    {searchResults.length ? (
                      <List disablePadding>
                        {searchResults.slice(0, 6).map((result) => (
                          <ListItemButton key={result._id || result.title} onMouseDown={() => openResult(result)} sx={{ borderRadius: 2 }}>
                            <ListItemText
                              primary={result.title || result.name}
                              secondary={result.artist?.name || "Artist"}
                              primaryTypographyProps={{ fontWeight: 700 }}
                            />
                          </ListItemButton>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                        No matches yet.
                      </Typography>
                    )}
                  </Paper>
                </Popper>
              </Box>
            )}

            <Tooltip title={isAuthenticated ? "Account" : "Sign in"}>
              <IconButton
                aria-label={isAuthenticated ? "Open account menu" : "Sign in"}
                onClick={() => setDrawerOpen(true)}
                sx={{
                  width: 42,
                  height: 42,
                  border: "1px solid",
                  borderColor: alpha("#FFFFFF", 0.1),
                  bgcolor: alpha("#FFFFFF", 0.04),
                }}
              >
                {isAuthenticated ? (
                  <Avatar src="/iam.jpeg" alt="Account" sx={{ width: 32, height: 32 }} />
                ) : (
                  <PersonRounded sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Paper
          component="nav"
          aria-label="Mobile navigation"
          elevation={0}
          sx={{
            position: "fixed",
            zIndex: 1250,
            left: 10,
            right: 10,
            bottom: 10,
            height: 66,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            alignItems: "center",
            borderRadius: 4,
            bgcolor: alpha("#171517", 0.93),
            backdropFilter: "blur(24px)",
            border: "1px solid",
            borderColor: alpha("#FFFFFF", 0.1),
            boxShadow: "0 16px 50px rgba(0,0,0,.48)",
          }}
        >
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <Link href={href} key={href} aria-label={label}>
                <Box sx={{ display: "grid", placeItems: "center", gap: 0.25, color: active ? "primary.main" : "text.secondary" }}>
                  <Icon sx={{ fontSize: 23 }} />
                  <Typography sx={{ fontSize: 10, fontWeight: 800 }}>{label}</Typography>
                </Box>
              </Link>
            );
          })}
        </Paper>
      )}

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "84vw", sm: 360 },
            p: 3,
            bgcolor: "#121113",
            borderLeft: "1px solid",
            borderColor: alpha("#FFFFFF", 0.08),
          },
        }}
      >
        <Box sx={{ pt: 5, pb: 3, borderBottom: "1px solid", borderColor: "divider" }}>
          <Avatar src="/iam.jpeg" alt="Account" sx={{ width: 64, height: 64, mb: 2, border: "2px solid", borderColor: "primary.main" }} />
          <Typography variant="h5">Your listening room</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.75}>
            Music, memory, and everything in between.
          </Typography>
        </Box>
        <List sx={{ mt: 2 }}>
          {isAuthenticated ? (
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2.5 }}>
              <LogoutRounded sx={{ mr: 1.5, color: "primary.main" }} />
              <ListItemText primary="Log out" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => setDrawerOpen(false)} sx={{ borderRadius: 2.5 }}>
              <PersonRounded sx={{ mr: 1.5, color: "primary.main" }} />
              <ListItemText primary="Sign in from the home screen" primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  );
}
