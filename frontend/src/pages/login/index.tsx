import { useAuth } from "@/context/AuthContext";
import { Button, Grid, TextField } from "@mui/material";
import { FormEvent, useState } from "react";

const Login = () => {
  const [email, setEmail] = useState<string>(""); 
  const [password, setPassword] = useState<string>("");
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
    <form onSubmit={handleLogin}>
      <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center">
        <Grid item lg={12}>
          <TextField
            type="email"
            label="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth 
          />
        </Grid>
        <Grid item lg={12}>
          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth 
          />
        </Grid>
        <Grid item lg={12}>
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default Login;
