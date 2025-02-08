import { Card, Typography, Form, Input, Button, Space } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function SignIn() {
    const navigate = useNavigate();
    const { signIn } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const result = await signIn(values.email, values.password);
            if (result.success) {
                navigate('/projects');
            }
        } catch (error) {
            toast.error('Failed to sign in: ' + error.message);
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
                        <Title level={2} style={{ marginBottom: '0.5rem' }}>Welcome Back</Title>
                        <Text type="secondary">Sign in to continue to MNFST Studio</Text>
                    </div>

                    <Form
                        layout="vertical"
                        onFinish={handleSubmit}
                        requiredMark={false}
                    >
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
                            rules={[{ required: true, message: 'Please enter your password' }]}
                        >
                            <Input.Password placeholder="Enter your password" size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                size="large"
                            >
                                Sign In
                            </Button>
                        </Form.Item>
                    </Form>

                    <Text style={{ textAlign: 'center' }}>
                        Don't have an account?{' '}
                        <Link to="/register">
                            <Button type="link" style={{ padding: 0 }}>Register</Button>
                        </Link>
                    </Text>
                </Space>
            </Card>
        </div>
    );
} 