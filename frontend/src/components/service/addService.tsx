import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Modal,
  Fade,
  MenuItem,
} from '@mui/material';

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    serviceType: '',
    membershipType: '',
    membershipDuration: '',
    totalFee: '',
    trainerNotes: '',
    medicalHistory: '',
    injuryType: '',
    doctorNotes: '',
    massageType: '',
    preferences: '',
    membershipStartDate: new Date().toISOString().slice(0, 10), // Varsayılan olarak bugünün tarihi
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      serviceType: '',
      membershipType: '',
      membershipDuration: '',
      totalFee: '',
      trainerNotes: '',
      medicalHistory: '',
      injuryType: '',
      doctorNotes: '',
      massageType: '',
      preferences: '',
      membershipStartDate: new Date().toISOString().slice(0, 10), // Sıfırlandığında bugünkü tarih atanır
    });
    onClose();
  };

  const renderAdditionalFields = () => {
    switch (formData.serviceType) {
      case 'physiotherapy':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Medical History"
                name="medicalHistory"
                value={formData.medicalHistory}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Injury Type"
                name="injuryType"
                value={formData.injuryType}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Doctor Notes"
                name="doctorNotes"
                value={formData.doctorNotes}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </>
        );
      case 'massage':
        return (
          <>
            <Grid item xs={12}>
              <TextField
                label="Massage Type"
                name="massageType"
                value={formData.massageType}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Preferences"
                name="preferences"
                value={formData.preferences}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            padding: 4,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Add New Service
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Service Type"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="pilates">Pilates</MenuItem>
                  <MenuItem value="physiotherapy">Physiotherapy</MenuItem>
                  <MenuItem value="massage">Massage</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Membership Type (Optional)"
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Membership Duration (Days) (Optional)"
                  name="membershipDuration"
                  type="number"
                  value={formData.membershipDuration}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total Fee (Optional)"
                  name="totalFee"
                  type="number"
                  value={formData.totalFee}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Membership Start Date"
                  name="membershipStartDate"
                  type="date"
                  value={formData.membershipStartDate}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Trainer Notes"
                  name="trainerNotes"
                  value={formData.trainerNotes}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              {renderAdditionalFields()}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={onClose} sx={{ mr: 2 }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Add Service
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default AddServiceModal;
