import { Card, Typography, Form, Input, Button, Space } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await register(values);
            navigate('/projects');
            toast.success('Registration successful!');
        } catch (error) {
            toast.error('Failed to register: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            padding: '2rem'
        }}>
            <Card style={{ width: '100%', maxWidth: '400px' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ marginBottom: '0.5rem' }}>Create Account</Title>
                        <Text type="secondary">Sign up for MNFST Studio</Text>
                    </div>

                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="firstName"
                            label="First Name"
                            rules={[{ required: true, message: 'Please enter your first name' }]}
                        >
                            <Input placeholder="Enter your first name" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="lastName"
                            label="Last Name"
                            rules={[{ required: true, message: 'Please enter your last name' }]}
                        >
                            <Input placeholder="Enter your last name" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input placeholder="Enter your email" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: 'Please enter your password' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                        >
                            <Input.Password placeholder="Enter your password" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={['password']}
                            rules={[
                                { required: true, message: 'Please confirm your password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirm your password" size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                Create Account
                            </Button>
                        </Form.Item>
                    </Form>

                    <Text style={{ textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link to="/signin">
                            <Button type="link" style={{ padding: 0 }}>Sign In</Button>
                        </Link>
                    </Text>
                </Space>
            </Card>
        </div>
    );
} 