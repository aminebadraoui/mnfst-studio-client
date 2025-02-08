import { Card, Typography, Button, Space, List, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const mockAgents = [
    {
        id: 1,
        name: 'Research Assistant',
        description: 'Helps with market research and competitor analysis',
        status: 'active'
    },
    {
        id: 2,
        name: 'Content Writer',
        description: 'Generates marketing copy and ad scripts',
        status: 'active'
    },
    {
        id: 3,
        name: 'Data Analyst',
        description: 'Analyzes market trends and customer data',
        status: 'inactive'
    }
];

export default function Agents() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <Title level={2} style={{ marginBottom: '0.5rem' }}>AI Agents</Title>
                    <Text type="secondary">Manage your AI assistants</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />}>
                    New Agent
                </Button>
            </div>

            <List
                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                dataSource={mockAgents}
                renderItem={agent => (
                    <List.Item>
                        <Card hoverable>
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        style={{
                                            backgroundColor: agent.status === 'active' ? '#52c41a' : '#d9d9d9',
                                            verticalAlign: 'middle'
                                        }}
                                    />
                                }
                                title={agent.name}
                                description={agent.description}
                            />
                            <div style={{ marginTop: '1rem' }}>
                                <Text type="secondary">
                                    Status: <Text strong>{agent.status}</Text>
                                </Text>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
}