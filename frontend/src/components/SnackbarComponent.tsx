import React, { memo } from 'react'
import { Alert, Slide, Snackbar } from '@mui/material'
import { handleSnackbarCloseFunction } from '@/utils/snacbarUtils';

interface SnackbarComponentProps {
  openSnackbar: boolean;
  handleSnackbarClose: any;
  snacbarSeverity: any;
  snackbarMessage: string;
  vertical?: 'top' | 'bottom';
}

const SnackbarComponent = memo(({ openSnackbar, handleSnackbarClose, snacbarSeverity, snackbarMessage, vertical }: SnackbarComponentProps) => {

  const closeSnackbar = handleSnackbarCloseFunction(handleSnackbarClose);

  return (
    <Snackbar
      open={openSnackbar}
      onClose={closeSnackbar}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: vertical ? vertical : 'bottom', horizontal: 'right' }}
      TransitionComponent={(props) => <Slide {...props} direction="left" />}
    >
      <Alert
        variant="filled"
        elevation={3}
        onClose={closeSnackbar}
        severity={snacbarSeverity}
        sx={{
          fontSize: '1rem',
          padding: '6px 24px',
          width: 'auto',
          maxWidth: '100%',
        }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  )
});

export default SnackbarComponent;
