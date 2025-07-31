import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Description as CsvIcon,
  TableChart as ExcelIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';

export const ExportButton = ({
  onExport,
  loading = false,
  disabled = false,
  formats = ['csv', 'excel', 'pdf'],
  label = 'Export',
  color = 'primary',
  variant = 'contained',
  size = 'medium'
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format) => {
    handleClose();
    await onExport?.(format);
  };

  const getFormatIcon = (format) => {
    switch (format.toLowerCase()) {
      case 'csv':
        return <CsvIcon />;
      case 'excel':
        return <ExcelIcon />;
      case 'pdf':
        return <PdfIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  const getFormatLabel = (format) => {
    switch (format.toLowerCase()) {
      case 'csv':
        return 'Export as CSV';
      case 'excel':
        return 'Export as Excel';
      case 'pdf':
        return 'Export as PDF';
      default:
        return `Export as ${format.toUpperCase()}`;
    }
  };

  return (
    <>
      <Button
        variant={variant}
        color={color}
        onClick={handleClick}
        disabled={disabled || loading}
        startIcon={
          loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <DownloadIcon />
          )
        }
        size={size}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        {formats.map((format) => (
          <MenuItem
            key={format}
            onClick={() => handleExport(format)}
            disabled={loading}
          >
            <ListItemIcon>{getFormatIcon(format)}</ListItemIcon>
            <ListItemText>{getFormatLabel(format)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};