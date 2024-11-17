import React from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Stack
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

interface AddRecordModalProps {
    open: boolean;
    onClose: () => void;
    type: 'service' | 'session' | 'payment';
    customerId: string;
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
};

export const AddRecordModal = ({ open, onClose, type, customerId }: AddRecordModalProps) => {
    const [serviceType, setServiceType] = React.useState<'pilates' | 'physiotherapy' | 'massage'>('pilates');
    const [date, setDate] = React.useState<Date | null>(new Date());

    const renderServiceForm = () => (
        <Stack spacing={2}>
            <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                    value={serviceType}
                    label="Service Type"
                    onChange={(e) => setServiceType(e.target.value as any)}
                >
                    <MenuItem value="pilates">Pilates</MenuItem>
                    <MenuItem value="physiotherapy">Physiotherapy</MenuItem>
                    <MenuItem value="massage">Massage</MenuItem>
                </Select>
            </FormControl>
            {serviceType === 'pilates' && (
                <>
                    <FormControl fullWidth>
                        <InputLabel>Membership Type</InputLabel>
                        <Select label="Membership Type">
                            <MenuItem value="basic">Basic</MenuItem>
                            <MenuItem value="premium">Premium</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Membership Duration (months)"
                        type="number"
                        fullWidth
                    />
                </>
            )}
            {serviceType === 'physiotherapy' && (
                <TextField
                    label="Injury Type"
                    fullWidth
                    multiline
                    rows={2}
                />
            )}
            {serviceType === 'massage' && (
                <TextField
                    label="Massage Type"
                    fullWidth
                />
            )}
            <TextField
                label="Total Fee"
                type="number"
                fullWidth
            />
            <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
            />
        </Stack>
    );

    const renderSessionForm = () => (
        <Stack spacing={2}>
            <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                    value={serviceType}
                    label="Service Type"
                    onChange={(e) => setServiceType(e.target.value as any)}
                >
                    <MenuItem value="pilates">Pilates</MenuItem>
                    <MenuItem value="physiotherapy">Physiotherapy</MenuItem>
                    <MenuItem value="massage">Massage</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status">
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="attended">Attended</MenuItem>
                    <MenuItem value="missed">Missed</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Notes"
                fullWidth
                multiline
                rows={3}
            />
        </Stack>
    );

    const renderPaymentForm = () => (
        <Stack spacing={2}>
            <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                    value={serviceType}
                    label="Service Type"
                    onChange={(e) => setServiceType(e.target.value as any)}
                >
                    <MenuItem value="pilates">Pilates</MenuItem>
                    <MenuItem value="physiotherapy">Physiotherapy</MenuItem>
                    <MenuItem value="massage">Massage</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Amount"
                type="number"
                fullWidth
            />
      
      
        </Stack>
    );

    const getModalContent = () => {
        switch (type) {
            case 'service':
                return renderServiceForm();
            case 'session':
                return renderSessionForm();
            case 'payment':
                return renderPaymentForm();
            default:
                return null;
        }
    };

    const getModalTitle = () => {
        switch (type) {
            case 'service':
                return 'Add New Service';
            case 'session':
                return 'Add New Session/Appointment';
            case 'payment':
                return 'Add New Payment';
            default:
                return '';
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    {getModalTitle()}
                </Typography>
                {getModalContent()}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={onClose}>
                        Save
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

// ServiceTypeFilter.tsx
interface ServiceTypeFilterProps {
    selectedTypes: string[];
    onChange: (types: string[]) => void;
}

export const ServiceTypeFilter = ({ selectedTypes, onChange }: ServiceTypeFilterProps) => {
    return (
        <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={1}>
                {['pilates', 'physiotherapy', 'massage'].map((type) => (
                    <Button
                        key={type}
                        variant={selectedTypes.includes(type) ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => {
                            const newTypes = selectedTypes.includes(type)
                                ? selectedTypes.filter(t => t !== type)
                                : [...selectedTypes, type];
                            onChange(newTypes);
                        }}
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {type}
                    </Button>
                ))}
            </Stack>
        </Box>
    );
};
