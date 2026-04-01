import dynamic from "next/dynamic";
import { Container } from "@mui/material";

const Navbar = dynamic(() => import("./Navbar"), { ssr: false });

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Container sx={{ marginTop: 1 }}>
        {children}
      </Container>
    </>
  );
}