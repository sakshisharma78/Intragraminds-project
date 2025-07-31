import React from 'react';
import {
  Alert,
  AlertTitle,
  Collapse,
  IconButton,
  Box
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export const ErrorAlert = ({
  error,
  title = 'Error',
  onClose,
  severity = 'error',
  sx = {}
}) => {
  if (!error) return null;

  return (
    <Box sx={{ mb: 2, ...sx }}>
      <Collapse in={!!error}>
        <Alert
          severity={severity}
          action={
            onClose && (
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={onClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )
          }
        >
          <AlertTitle>{title}</AlertTitle>
          {typeof error === 'string' ? error : error.message || 'An error occurred'}
        </Alert>
      </Collapse>
    </Box>
  );
};