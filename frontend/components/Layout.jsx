import dynamic from "next/dynamic";
import { Box } from "@mui/material";

const Navbar = dynamic(() => import("./Navbar"), { ssr: false });

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Navbar />
      <Box
        component="main"
        sx={{
          width: "100%",
          pb: { xs: "176px", md: "132px" },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
