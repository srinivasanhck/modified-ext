import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface SnackbarProps {
  open: boolean;
  handleClose: () => void;
  message: string;
  severity: any;
//   severity: "error" | "warning" | "info" | "success";
}

const CustomizedSnackbar: React.FC<SnackbarProps> = ({ open, handleClose, message, severity }) => {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '90%'}} >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default CustomizedSnackbar;