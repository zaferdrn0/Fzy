import React, { useState } from 'react';
import { TextField, Button, FormControl, FormLabel, Checkbox, FormControlLabel, Grid } from '@mui/material';
import { fetchBackendPOST } from '@/utils/backendFetch';

// TypeScript interface for form data
interface IFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: number;
  weight: number;
  type: string[]; // Changed to an array for multiple selections
}

const RegisterForm = () => {
  // Form state
  const [formData, setFormData] = useState<IFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: 0,
    weight: 0,
    type: [] // Array for multiple type selections
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle checkboxes for type (Physiotherapist or Pilates)
  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData(prevState => {
      const updatedTypes = checked
        ? [...prevState.type, value] // Add if checked
        : prevState.type.filter(type => type !== value); // Remove if unchecked

      return {
        ...prevState,
        type: updatedTypes
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetchBackendPOST('/customer/add', formData);
      if (response.ok) {  
        const data = await response.json();
        console.log('Customer registered:', data);
      } else {
        console.error('Failed to register customer:', response.statusText);
      }
    } catch (error) {
      console.error('Error registering customer:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        {/* Name Fields */}
        <Grid item xs={6}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
          />
        </Grid>

        {/* Phone */}
        <Grid item xs={12}>
          <TextField
            label="Phone"
            variant="outlined"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </Grid>

        {/* Age */}
        <Grid item xs={6}>
          <TextField
            label="Age"
            variant="outlined"
            fullWidth
            name="age"
            value={formData.age}
            onChange={handleChange}
            type="number"
            required
          />
        </Grid>

        {/* Weight */}
        <Grid item xs={6}>
          <TextField
            label="Weight"
            variant="outlined"
            fullWidth
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            type="number"
            required
          />
        </Grid>

        {/* Type Selection (Physiotherapist or Pilates) */}
        <Grid item xs={12}>
          <FormControl component="fieldset" required>
            <FormLabel component="legend">Service Type</FormLabel>
            <FormControlLabel
              control={<Checkbox value="physiotherapist" checked={formData.type.includes("physiotherapist")} onChange={handleTypeChange} />}
              label="Physiotherapist"
            />
            <FormControlLabel
              control={<Checkbox value="pilates" checked={formData.type.includes("pilates")} onChange={handleTypeChange} />}
              label="Pilates"
            />
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default RegisterForm;
