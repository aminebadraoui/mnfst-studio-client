import { Card, Typography, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div style={{
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
            minHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Card style={{ width: '100%', textAlign: 'center' }}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <Title level={2}>Welcome to MNFST Studio</Title>
                    <Text type="secondary" style={{ fontSize: '16px' }}>
                        Get started by creating your first project. You can create multiple projects
                        to organize your marketing research and content creation.
                    </Text>

                    <div style={{ marginTop: '2rem' }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/projects')}
                        >
                            Create Your First Project
                        </Button>
                    </div>
                </Space>
            </Card>
        </div>
    );
} 