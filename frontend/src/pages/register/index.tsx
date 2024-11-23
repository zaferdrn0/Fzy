import { fetchBackendPOST } from '@/utils/backendFetch'
import { Button, Grid, TextField } from '@mui/material'
import React, { useState } from 'react'

const Register = () => {
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const UserRegister = async () => {

    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    }

    const register = await fetchBackendPOST("/user/register", userData)
    if (register.ok) {
      const data = await register.json()
      console.log(data)
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="First Name"
          type="text"
          fullWidth
          onChange={(e) => setFirstName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Last Name"
          type="text"
          fullWidth
          onChange={(e) => setLastName(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={UserRegister}>
          Register
        </Button>
      </Grid>
    </Grid>
  )
}
Register.getLayout = (page: React.ReactElement) => page;

export default Register
