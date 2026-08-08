import { useContext, useState } from "react";
import {
  ArrowForwardRounded,
  FavoriteRounded,
  HeadphonesRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const getAuthErrorMessage = (error, fallback) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.code === "ECONNABORTED") {
    return "The music server took too long to respond. Please try again.";
  }
  if (!error.response) {
    return "We couldn't reach the music server. Please check your connection and try again.";
  }
  return fallback;
};

export default function LandingAuthModal({ defaultMode = "login" }) {
  const [isLogin, setIsLogin] = useState(defaultMode !== "register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [adminSecret, setAdminSecret] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data?.token) throw new Error("No token returned");
      login(data);
    } catch (error) {
      const message = getAuthErrorMessage(error, "Invalid email or password.");
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        role,
        adminSecret: role === "admin" ? adminSecret : undefined,
      });
      if (!data?.token) throw new Error("No token returned");
      toast.success("Account created");
      login(data);
    } catch (error) {
      const message = getAuthErrorMessage(error, "Registration failed.");
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      open
      aria-labelledby="auth-modal-title"
      slotProps={{ backdrop: { sx: { backgroundColor: alpha("#050506", 0.9), backdropFilter: "blur(16px)" } } }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: { xs: 12, sm: "50% auto auto 50%" },
          transform: { sm: "translate(-50%, -50%)" },
          width: { sm: "min(960px, calc(100vw - 40px))" },
          maxHeight: { xs: "calc(100vh - 24px)", sm: "min(760px, calc(100vh - 40px))" },
          overflowY: "auto",
          display: { sm: "grid" },
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(360px, .95fr)",
          borderRadius: { xs: 3, sm: 4 },
          bgcolor: "#121113",
          border: "1px solid",
          borderColor: alpha("#FFFFFF", 0.1),
          boxShadow: "0 42px 140px rgba(0,0,0,.72)",
        }}
      >
        <Box
          sx={{
            minHeight: { sm: 640 },
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            p: { sm: 4, md: 5 },
            position: "relative",
            overflow: "hidden",
            backgroundImage:
              "linear-gradient(0deg, rgba(7,7,9,.96), rgba(7,7,9,.12) 68%), linear-gradient(90deg, rgba(7,7,9,.18), transparent), url('/iam.jpeg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <FavoriteRounded color="primary" />
            <Typography variant="overline">KARRMA&apos;S HEART</Typography>
          </Box>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography variant="h2" sx={{ maxWidth: 480 }}>
              Keep the music <Box component="span" color="primary.main" fontStyle="italic">close.</Box>
            </Typography>
            <Typography sx={{ mt: 2, maxWidth: 410, color: alpha("#FFFFFF", 0.7), lineHeight: 1.7 }}>
              Sign in to listen, build your library, and stay connected to every release.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ p: { xs: 3, sm: 4, md: 5 }, alignSelf: "center" }}>
          <Box sx={{ display: { xs: "flex", sm: "none" }, alignItems: "center", gap: 1, mb: 4 }}>
            <FavoriteRounded color="primary" />
            <Typography variant="overline">KARRMA&apos;S HEART</Typography>
          </Box>
          <Typography variant="overline" color="primary.main">{isLogin ? "WELCOME BACK" : "JOIN THE ROOM"}</Typography>
          <Typography id="auth-modal-title" variant="h3" sx={{ mt: 1, mb: 1.2 }}>
            {isLogin ? "Listen where you left off." : "Create your account."}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3.25 }}>
            {isLogin ? "Your music is waiting for you." : "A few details and you're in."}
          </Typography>

          <Box component="form" onSubmit={isLogin ? handleLogin : handleRegister}>
            {!isLogin && (
              <>
                <TextField fullWidth label="Name" value={name} onChange={(event) => setName(event.target.value)} required margin="dense" />
                <TextField select fullWidth label="Account type" value={role} onChange={(event) => setRole(event.target.value)} margin="dense">
                  <MenuItem value="user">Listener</MenuItem>
                  <MenuItem value="admin">Artist / Admin</MenuItem>
                </TextField>
                {role === "admin" && (
                  <TextField fullWidth label="Admin secret key" value={adminSecret} onChange={(event) => setAdminSecret(event.target.value)} required margin="dense" />
                )}
              </>
            )}
            <TextField fullWidth label="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required margin="dense" autoComplete="email" />
            <TextField fullWidth label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required margin="dense" autoComplete={isLogin ? "current-password" : "new-password"} />

            {errorMsg && (
              <Typography role="alert" variant="body2" sx={{ mt: 1.5, color: "#FF9AA4" }}>{errorMsg}</Typography>
            )}

            <Button type="submit" variant="contained" fullWidth disabled={submitting} endIcon={<ArrowForwardRounded />} sx={{ mt: 2.5 }}>
              {submitting ? "One moment…" : isLogin ? "Enter Karrma's Heart" : "Create account"}
            </Button>
          </Box>

          <Button
            variant="text"
            color="secondary"
            fullWidth
            startIcon={<HeadphonesRounded />}
            onClick={() => { setIsLogin((value) => !value); setErrorMsg(""); }}
            sx={{ mt: 1.5, color: "text.secondary" }}
          >
            {isLogin ? "New here? Create an account" : "Already a member? Sign in"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
