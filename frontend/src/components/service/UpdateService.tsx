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

interface UpdateServiceModalProps {
  open: boolean;
  service: Record<string, any>;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
}

const UpdateServiceModal: React.FC<UpdateServiceModalProps> = ({ open, service, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(service);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Paper
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            padding: 4,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Update Service
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Service Type"
                  value={formData.serviceType}
                  disabled
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Membership Type"
                  name="membershipType"
                  value={formData.membershipType || ''}
                  onChange={handleChange}
                  fullWidth
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
                  value={formData.membershipDuration || ''}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Membership Start Date"
                  name="membershipStartDate"
                  type="date"
                  value={
                    formData.membershipStartDate
                      ? new Date(formData.membershipStartDate).toISOString().slice(0, 10)
                      : ''
                  }
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Total Fee"
                  name="totalFee"
                  value={formData.totalFee}
                  onChange={handleChange}
                  type="number"
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
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={onClose} sx={{ mr: 2 }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Update Service
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

export default UpdateServiceModal;
