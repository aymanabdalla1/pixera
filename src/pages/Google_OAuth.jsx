import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import GoogleIcon from '@mui/icons-material/Google';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Cookies from 'js-cookie';
import { Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function Google_OAuth() {
  const logo = { id: 6, url: '/data/photos/pixera_logo.png', alt: 'Photo 5' };
  const google_logo = { url: '/data/photos/google_logo.png' };
  const [selectedRole, setSelectedRole] = React.useState('');
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    username: '',
    role: '',
    photographertype: '',
  });

  const [countryError, setCountryError] = React.useState('');
  const [cityError, setCityError] = React.useState('');
  const [usernameError, setUsernameError] = React.useState('');

  const [roleTags, setRoleTags] = React.useState([]);
  const [roleTagInput, setRoleTagInput] = React.useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCountryChange = (event) => {
    setCountryError('');
    handleInputChange(event);
  };

  const handleCityChange = (event) => {
    setCityError('');
    handleInputChange(event);
  };

  const handleUsernameChange = (event) => {
    setUsernameError('');
    handleInputChange(event);
  };

  const handleRoleTagInputChange = (e) => {
    setRoleTagInput(e.target.value);
  };

  const handleRoleTagInputKeyPress = (e) => {
    if (e.key === 'Enter' && roleTagInput.trim() !== '') {
      setRoleTags([...roleTags, roleTagInput.trim()]);
      setRoleTagInput('');
    }
  };

  const addRoleTag = () => {
    if (roleTagInput.trim() !== '') {
      setRoleTags([...roleTags, roleTagInput.trim()]);
      setRoleTagInput('');
    }
  };

  const removeRoleTag = (tagToRemove) => {
    const updatedRoleTags = roleTags.filter((tag) => tag !== tagToRemove);
    setRoleTags(updatedRoleTags);
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.country &&
      formData.city &&
      formData.username &&
      selectedRole &&
      roleTags
    );
  };

  const signup = async () => {
    const token = Cookies.get('token')
    try {
      const response = await fetch(`/google_oauth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole,
          roleTags: roleTags, // Include the role tags
        }),
      });

      if (response.ok) {
        const Token = response.headers.get('Authorization');
        const newToken = Token.split(' ')[1]
        Cookies.remove('token')
        Cookies.set('token', newToken, { expires: 1 / 24 }); // Expires in 1 hour
        window.location.href = '/home'
      } else {
        console.error('Failed to save edited data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      console.error('Some fields are missing.');
      return;
    }

    if (formData.country && formData.city && formData.username) {
      signup();
    } else {
      if (!formData.country) {
        setCountryError('Please provide a country.');
      }
      if (!formData.city) {
        setCityError('Please provide a city.');
      }
      if (!formData.username) {
        setUsernameError('Please provide a username.');
      }
    }
  };

  const isSignUpButtonDisabled = !isFormValid();

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={logo.url} alt="" width="140px" height="140px" />
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="username"
                  label="Username"
                  id="username"
                  value={formData.username}
                  onChange={handleUsernameChange}
                  error={Boolean(usernameError)}
                  helperText={usernameError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="country"
                  label="Country"
                  id="country"
                  value={formData.country}
                  onChange={handleCountryChange}
                  error={Boolean(countryError)}
                  helperText={countryError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="city"
                  label="City"
                  id="city"
                  value={formData.city}
                  onChange={handleCityChange}
                  error={Boolean(cityError)}
                  helperText={cityError}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="roleTag"
                  label="What kind of photographer are you?"
                  id="roleTag"
                  value={roleTagInput}
                  onChange={handleRoleTagInputChange}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleRoleTagInputKeyPress(e);
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <span onClick={addRoleTag} style={{ cursor: 'pointer' }}>
                        #
                      </span>
                    ),
                  }}
                />
              </Grid>
              {roleTags.map((tag) => (
                <Grid item key={tag} xs={3}>
                  <Paper
                    variant="outlined"
                    square
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '4px 8px',
                    }}
                  >
                    {tag}
                    <span
                      onClick={() => removeRoleTag(tag)}
                      style={{ cursor: 'pointer' }}
                    >
                      <CloseIcon />
                    </span>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <RadioGroup
                  aria-label="role"
                  name="role"
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                >
                  <FormControlLabel
                    value="Customer"
                    control={<Radio />}
                    label="Customer"
                  />
                  <FormControlLabel
                    value="Photographer"
                    control={<Radio />}
                    label="Photographer"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: 'black' }}
              disabled={isSignUpButtonDisabled}
              onClick={handleSubmit}
            >
              Sign Up
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Google_OAuth;
