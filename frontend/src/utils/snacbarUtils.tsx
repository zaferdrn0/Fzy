export const handleSnackbarCloseFunction = (setOpenSnackbar: (open: boolean) => void) => {
    return (event: Event | React.SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpenSnackbar(false);
    };
  };