import { Card, Typography, Form, Input, Button, Space, Divider } from 'antd';
import { useState } from 'react';
import useAuthStore from '../stores/authStore';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;

export default function Settings() {
    const { user, updateProfile, updatePassword } = useAuthStore();
    const [profileLoading, setProfileLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [profileForm] = Form.useForm();
    const [passwordForm] = Form.useForm();

    const handleProfileUpdate = async (values) => {
        setProfileLoading(true);
        try {
            await updateProfile(values);
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile: ' + error.message);
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async (values) => {
        setPasswordLoading(true);
        try {
            await updatePassword(values);
            passwordForm.resetFields();
            toast.success('Password updated successfully');
        } catch (error) {
            toast.error('Failed to update password: ' + error.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Title level={2} style={{ marginBottom: '2rem' }}>Settings</Title>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card>
                    <Title level={4}>Profile Information</Title>
                    <Text type="secondary" style={{ marginBottom: '1.5rem', display: 'block' }}>
                        Update your personal information
                    </Text>

                    <Form
                        form={profileForm}
                        layout="vertical"
                        onFinish={handleProfileUpdate}
                        initialValues={{
                            firstName: user?.firstName,
                            lastName: user?.lastName,
                            email: user?.email
                        }}
                    >
                        <Space direction="horizontal" size="middle" style={{ display: 'flex' }}>
                            <Form.Item
                                name="firstName"
                                label="First Name"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: 'Please enter your first name' }]}
                            >
                                <Input size="large" />
                            </Form.Item>

                            <Form.Item
                                name="lastName"
                                label="Last Name"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: 'Please enter your last name' }]}
                            >
                                <Input size="large" />
                            </Form.Item>
                        </Space>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Please enter your email' },
                                { type: 'email', message: 'Please enter a valid email' }
                            ]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={profileLoading}
                            >
                                Update Profile
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>

                <Card>
                    <Title level={4}>Change Password</Title>
                    <Text type="secondary" style={{ marginBottom: '1.5rem', display: 'block' }}>
                        Update your password
                    </Text>

                    <Form
                        form={passwordForm}
                        layout="vertical"
                        onFinish={handlePasswordUpdate}
                    >
                        <Form.Item
                            name="currentPassword"
                            label="Current Password"
                            rules={[{ required: true, message: 'Please enter your current password' }]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>

                        <Form.Item
                            name="newPassword"
                            label="New Password"
                            rules={[
                                { required: true, message: 'Please enter your new password' },
                                { min: 8, message: 'Password must be at least 8 characters' }
                            ]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm New Password"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password size="large" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={passwordLoading}
                            >
                                Update Password
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Space>
        </div>
    );
} 