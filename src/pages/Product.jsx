import { Card, Typography, Button, Space, Row, Col, Form, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Mock data
const mockData = {
    name: "Premium Subscription",
    type: "service",
    description: "Monthly subscription service for premium health tracking features",
    research: {
        quotes: [
            {
                text: "I need a way to track my daily wellness activities in one place",
                source: "Reddit r/fitness",
                tags: ["pain point", "user need"]
            },
            {
                text: "Would pay extra for detailed analytics of my health data",
                source: "Product Hunt",
                tags: ["willingness to pay", "feature request"]
            }
        ],
        insights: [
            "Users want consolidated health tracking",
            "Premium features should focus on data analytics",
            "Integration with existing devices is crucial"
        ]
    },
    marketing: {
        angles: [
            {
                title: "All-in-One Health Dashboard",
                description: "Track every aspect of your health journey in one place",
                targetAudience: "Busy professionals",
                keyBenefit: "Time-saving consolidation"
            },
            {
                title: "Data-Driven Wellness",
                description: "Make informed decisions with advanced health analytics",
                targetAudience: "Health enthusiasts",
                keyBenefit: "Detailed insights"
            }
        ]
    },
    ads: {
        scripts: [
            {
                title: "Dashboard Simplicity",
                content: "Tired of jumping between apps to track your health? Our premium dashboard brings everything together. One app. All your health data. Unlock insights today.",
                platform: "Facebook",
                format: "News Feed"
            },
            {
                title: "Analytics Power",
                content: "Your health data tells a story. Our premium analytics help you understand it. Upgrade now for in-depth health insights.",
                platform: "Instagram",
                format: "Story"
            }
        ]
    }
}

export default function Product() {
    const { projectId, productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const savedProducts = JSON.parse(localStorage.getItem(`products_${projectId}`) || '[]');
        const currentProduct = savedProducts.find(p => p.id.toString() === productId);

        if (!currentProduct) {
            navigate(`/projects/${projectId}`);
            return;
        }

        setProduct(currentProduct);
    }, [projectId, productId, navigate]);

    if (!product) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <Title level={2} style={{ marginBottom: '0.5rem' }}>{product.name}</Title>
                    <Text type="secondary">{product.description}</Text>
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {/* Research Section */}
                <Col xs={24} lg={12}>
                    <Card title={<Title level={4}>Research</Title>}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Add Research Quote
                                </Text>
                                <Form layout="vertical">
                                    <Form.Item>
                                        <TextArea
                                            placeholder="Paste a research quote here..."
                                            rows={4}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button icon={<PlusOutlined />}>
                                            Add Quote
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Research Quotes
                                </Text>
                                <Text type="secondary">No research quotes added yet.</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Marketing Angles */}
                <Col xs={24} lg={12}>
                    <Card title={<Title level={4}>Marketing Angles</Title>}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Add Marketing Angle
                                </Text>
                                <Form layout="vertical">
                                    <Form.Item>
                                        <Input placeholder="Enter a marketing angle..." />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button icon={<PlusOutlined />}>
                                            Add Angle
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Current Angles
                                </Text>
                                <Text type="secondary">No marketing angles added yet.</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Ad Scripts */}
                <Col xs={24} lg={12}>
                    <Card title={<Title level={4}>Ad Scripts</Title>}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Add Ad Script
                                </Text>
                                <Form layout="vertical">
                                    <Form.Item>
                                        <TextArea
                                            placeholder="Write your ad script here..."
                                            rows={4}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button icon={<PlusOutlined />}>
                                            Add Script
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Saved Scripts
                                </Text>
                                <Text type="secondary">No ad scripts added yet.</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>

                {/* Insights */}
                <Col xs={24} lg={12}>
                    <Card title={<Title level={4}>Insights</Title>}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Add Insight
                                </Text>
                                <Form layout="vertical">
                                    <Form.Item>
                                        <TextArea
                                            placeholder="Write your insight here..."
                                            rows={4}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button icon={<PlusOutlined />}>
                                            Add Insight
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                            <div>
                                <Text strong style={{ marginBottom: '0.5rem', display: 'block' }}>
                                    Saved Insights
                                </Text>
                                <Text type="secondary">No insights added yet.</Text>
                            </div>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
} 