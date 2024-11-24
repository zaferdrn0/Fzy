export const getStatusColor = (status: string) => {
    switch (status) {
      case 'attended':
        return 'success';
      case 'missed':
        return 'error';
      case 'scheduled':
        return 'info';
      default:
        return 'default';
    }
  };