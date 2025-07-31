import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Alert,
  Tab,
  Tabs
} from '@mui/material';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { useAuth } from '../hooks/useAuth';

export const Settings = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [userSettings, setUserSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC'
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    apiUrl: 'http://localhost:5000',
    backupFrequency: 'daily'
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleUserSettingChange = (setting) => (event) => {
    setUserSettings((prev) => ({
      ...prev,
      [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleSystemSettingChange = (setting) => (event) => {
    setSystemSettings((prev) => ({
      ...prev,
      [setting]: event.target.type === 'checkbox' ? event.target.checked : event.target.value
    }));
  };

  const handleProfileChange = (field) => (event) => {
    setProfile((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      setError('');
      // Implement settings save API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Settings saved successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      setError('');
      // Implement profile update API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
            <Tab label="User Preferences" />
            <Tab label="Profile" />
            {isAdmin && <Tab label="System" />}
          </Tabs>

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
              {success}
            </Alert>
          )}

          <ErrorAlert error={error} sx={{ mb: 3 }} />

          {activeTab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Notifications
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userSettings.emailNotifications}
                      onChange={handleUserSettingChange('emailNotifications')}
                    />
                  }
                  label="Email Notifications"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Appearance
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={userSettings.darkMode}
                      onChange={handleUserSettingChange('darkMode')}
                    />
                  }
                  label="Dark Mode"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  value={userSettings.language}
                  onChange={handleUserSettingChange('language')}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Timezone"
                  value={userSettings.timezone}
                  onChange={handleUserSettingChange('timezone')}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST</option>
                  <option value="PST">PST</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  Save Preferences
                </Button>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  value={profile.name}
                  onChange={handleProfileChange('name')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange('email')}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Change Password
                </Typography>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  value={profile.currentPassword}
                  onChange={handleProfileChange('currentPassword')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={profile.newPassword}
                  onChange={handleProfileChange('newPassword')}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  value={profile.confirmPassword}
                  onChange={handleProfileChange('confirmPassword')}
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleUpdateProfile}
                  disabled={loading}
                >
                  Update Profile
                </Button>
              </Grid>
            </Grid>
          )}

          {activeTab === 2 && isAdmin && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  System Configuration
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onChange={handleSystemSettingChange('maintenanceMode')}
                    />
                  }
                  label="Maintenance Mode"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={systemSettings.debugMode}
                      onChange={handleSystemSettingChange('debugMode')}
                    />
                  }
                  label="Debug Mode"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="API URL"
                  value={systemSettings.apiUrl}
                  onChange={handleSystemSettingChange('apiUrl')}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Backup Frequency"
                  value={systemSettings.backupFrequency}
                  onChange={handleSystemSettingChange('backupFrequency')}
                  SelectProps={{
                    native: true
                  }}
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveSettings}
                  disabled={loading}
                >
                  Save System Settings
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};