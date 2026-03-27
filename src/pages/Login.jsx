import { useState } from 'react';
import { Box, Card, Typography, TextField, Button, InputAdornment } from '@mui/material';
import { Package, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function Login() {
  // fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // do login
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate('/');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 440, animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ display: 'inline-flex', background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)', color: 'white', p: 1.5, borderRadius: 3, mb: 2, boxShadow: '0 10px 30px rgba(79, 70, 229, 0.3)' }}>
            <Package size={32} />
          </Box>
          <Typography variant="h3" fontWeight="900" letterSpacing="-0.02em" color="text.primary">
            StockUI
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Sign in to manage your inventory
          </Typography>
        </Box>

        <Card sx={{ p: 4 }}>
          {/* Form */}
          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={18} color="#94a3b8" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                size="large" 
                fullWidth
                sx={{ 
                  py: 1.5, 
                  mt: 1, 
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' 
                }}
              >
                Sign In
              </Button>
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
              Hint: Use any email and password to enter.
            </Typography>
          </form>
        </Card>
      </Box>
    </Box>
  );
}
