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
    setFormData({ serviceType: '', membershipType: '', membershipDuration: '', totalFee: '', trainerNotes: '' }); 
    onClose(); 
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
    >
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
                  label="Membership Type"
                  name="membershipType"
                  value={formData.membershipType}
                  onChange={handleChange}
                  fullWidth
                  required
                >
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="premium">Premium</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Membership Duration (Days)"
                  name="membershipDuration"
                  type="number"
                  value={formData.membershipDuration}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total Fee"
                  name="totalFee"
                  type="number"
                  value={formData.totalFee}
                  onChange={handleChange}
                  fullWidth
                  required
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
