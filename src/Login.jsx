import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Layout } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axiosInstance from './services/axiosInstance';

const { Title, Text } = Typography;
const { Header, Content } = Layout;

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });

  const validateFields = () => {
    const newErrors = { username: '', password: '' };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = 'Please enter your username';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateFields()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post('/api/login', {
        username: username.trim(),
        password: password,
      });

      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('authToken', token);

      // Console log token
      console.log('Token:', token);

      message.success('Login successful!');

      // Call the success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess({ token });
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        // Server responded with an error
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Login failed. Please check your credentials.';
        message.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        message.error('Unable to connect to server. Please try again later.');
      } else {
        // Something else happened
        message.error('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img 
          src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" 
          alt="Indian Flag" 
          style={{ height: '32px', marginRight: '10px' }} 
        />
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          GP Admin Panel
        </Title>
      </Header>
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #062233 0%, #0a3d5c 100%)',
          padding: '24px',
        }}
      >
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            borderRadius: '12px',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" 
              alt="Indian Flag" 
              style={{ height: '48px', marginBottom: '16px' }} 
            />
            <Title level={2} style={{ margin: 0, color: '#062233' }}>
              Admin Login
            </Title>
            <Text type="secondary">
              Sign in to access the admin panel
            </Text>
          </div>

          <Form layout="vertical" onKeyPress={handleKeyPress}>
            <Form.Item
              label="Username"
              validateStatus={errors.username ? 'error' : ''}
              help={errors.username}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#062233' }} />}
                placeholder="Enter your username"
                size="large"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) {
                    setErrors((prev) => ({ ...prev, username: '' }));
                  }
                }}
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              validateStatus={errors.password ? 'error' : ''}
              help={errors.password}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#062233' }} />}
                placeholder="Enter your password"
                size="large"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }
                }}
                style={{ borderRadius: '6px' }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
              <Button
                type="primary"
                size="large"
                block
                loading={loading}
                onClick={handleLogin}
                style={{
                  height: '48px',
                  borderRadius: '6px',
                  background: '#062233',
                  borderColor: '#062233',
                  fontSize: '16px',
                  fontWeight: 500,
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;
