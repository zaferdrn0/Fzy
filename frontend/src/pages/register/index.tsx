import { fetchBackendPOST } from '@/utils/backendFetch';
import { Button, Grid, TextField, Typography, Paper, Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const Register = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const UserRegister = async () => {
    const userData = {
      firstName,
      lastName,
      email,
      password,
    };

    try {
      const register = await fetchBackendPOST('/user/register', userData);
      if (register.ok) {
        alert('Successfully registered');
        router.push('/customers');
      } else {
        setError('Failed to register. Please check your details and try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <Grid
      container
      sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} sm={8} md={4}>
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Kayıt Ol
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Hesabınızı oluşturun
            </Typography>
          </Box>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: 'center', mb: 2 }}
            >
              {error}
            </Typography>
          )}
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Ad"
                type="text"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Soyad"
                type="text"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Şifre"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={UserRegister}
              >
                Kayıt Ol
              </Button>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="body2" align="center" color="textSecondary">
                  Hesabınız var mı? <Button onClick={()=>router.push("/login")} variant="text">Giriş Yap</Button>
                </Typography>
              </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

Register.getLayout = (page: React.ReactElement) => page;

export default Register;
