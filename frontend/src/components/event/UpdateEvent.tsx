import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from '@mui/material';
import { Event } from '@/models/dataType';

interface UpdateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
  event: Record<string, any>;
}

const UpdateEvent: React.FC<UpdateEventModalProps> = ({ open, onClose, onSubmit, event }) => {
  const [formData, setFormData] = useState(event);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = () => {
    onSubmit(formData);
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Event</DialogTitle>
      <DialogContent>
        {/* Date Field */}
        <TextField
          margin="dense"
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
        />
        {/* Status Field */}
        <TextField
          margin="dense"
          label="Status"
          select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          fullWidth
        >
          <MenuItem value="attended">Attended</MenuItem>
          <MenuItem value="missed">Missed</MenuItem>
          <MenuItem value="scheduled">Scheduled</MenuItem>
        </TextField>
        {/* Notes Field */}
        <TextField
          margin="dense"
          label="Notes"
          type="text"
          name="notes"
          value={formData.notes}
          onChange={handleInputChange}
          fullWidth
          multiline
          rows={4}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateEvent;
