import { useAuth } from "@/context/AuthContext";
import { Box, Button, Grid, TextField, Typography, Paper } from "@mui/material";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
  const router = useRouter()
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Grid
      container
      sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Hoşgeldiniz
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Hesabınıza giriş yapın
            </Typography>
          </Box>
          <form onSubmit={handleLogin}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth size="large">
                  Giriş Yap
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" align="center" color="textSecondary">
                  Hesabınız yok mu? <Button onClick={()=>router.push("/register")} variant="text">Kayıt Ol</Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

Login.getLayout = (page: React.ReactElement) => page;

export default Login;
