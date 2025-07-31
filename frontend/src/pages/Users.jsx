import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { DataTable } from '../components/ui/DataTable';
import { FilterBar } from '../components/ui/FilterBar';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { useAuth } from '../hooks/useAuth';

export const Users = () => {
  const { isAdmin } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data - replace with actual API calls
  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-01-01T10:00:00Z'
    }
    // Add more mock users
  ];

  const handleDeleteUser = async () => {
    try {
      setLoading(true);
      // Implement delete user API call
      console.log('Deleting user:', selectedUser);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { id: 'role', label: 'Role', minWidth: 100 },
    { id: 'status', label: 'Status', minWidth: 100 },
    {
      id: 'lastLogin',
      label: 'Last Login',
      minWidth: 170,
      format: (value) =>
        value ? new Date(value).toLocaleString() : 'Never'
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      sortable: false,
      format: (value, row) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Edit User">
            <IconButton
              size="small"
              onClick={() => console.log('Edit user:', row)}
              disabled={!isAdmin}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                setSelectedUser(row);
                setDeleteDialogOpen(true);
              }}
              disabled={!isAdmin}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            User Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage system users and their permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={!isAdmin}
          onClick={() => console.log('Add new user')}
        >
          Add User
        </Button>
      </Box>

      <ErrorAlert error={error} sx={{ mb: 3 }} />

      <Card>
        <CardContent>
          <FilterBar
            filters={{}}
            onFilterChange={() => {}}
            onClearFilters={() => {}}
            loading={loading}
          />

          <DataTable
            columns={columns}
            data={users}
            loading={loading}
            error={error}
            page={0}
            rowsPerPage={10}
            totalRows={users.length}
            onPageChange={() => {}}
            onRowsPerPageChange={() => {}}
          />
        </CardContent>
      </Card>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDeleteUser}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        loading={loading}
        severity="error"
      />
    </Box>
  );
};

export default Users;