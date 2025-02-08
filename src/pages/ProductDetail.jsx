import { Card, Typography, Button, Space, Spin, Form, Input, Modal, Tabs, List, Avatar, Tag, Collapse, Divider, Empty, Progress, Steps, Alert, Radio, Select, Drawer } from 'antd';
import { EditOutlined, DeleteOutlined, RobotOutlined, LoadingOutlined, SearchOutlined, LineChartOutlined, TeamOutlined, ShoppingOutlined, FileTextOutlined, UserOutlined, DatabaseOutlined, BulbOutlined, RedditOutlined, YoutubeOutlined, AimOutlined, ApiOutlined, PlusOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import React from 'react';
import useProjectStore from '../stores/projectStore';
import useProductStore from '../stores/productStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { Panel } = Collapse;
const { Step } = Steps;

const PyramidLevel = ({ height, backgroundColor, children, isActive, onClick, level }) => (
    <div
        data-level={level}
        style={{
            width: '100%',
            height: height,
            backgroundColor: isActive ? backgroundColor : '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            borderRadius: '8px',
            marginBottom: '20px',
            padding: '16px',
            opacity: isActive ? 1 : 0.9,
            transform: isActive ? 'scale(1.02)' : 'scale(1)',
            boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
            border: '1px solid rgba(255,255,255,0.1)',
        }}
        onClick={onClick}
    >
        {/* Always show animation lines */}
        <div
            className="flowLine"
            style={{
                background: backgroundColor
            }}
        />

        <div
            className="connectionLine"
            style={{
                background: `linear-gradient(to right, transparent, ${backgroundColor}, transparent)`
            }}
        />

        <div style={{
            color: isActive ? '#fff' : '#7209DB',
            textAlign: 'center',
            opacity: isActive ? 1 : 0.75
        }}>
            {React.Children.map(children, child => {
                if (!React.isValidElement(child)) return child;

                if (child.type === 'div' && child.props.style?.color === '#fff') {
                    return React.cloneElement(child, {
                        style: {
                            ...child.props.style,
                            color: isActive ? '#fff' : '#7209DB'
                        },
                        children: React.Children.map(child.props.children, subChild => {
                            if (!React.isValidElement(subChild)) return subChild;

                            if (subChild.type === Title) {
                                return React.cloneElement(subChild, {
                                    style: {
                                        ...subChild.props.style,
                                        color: isActive ? '#fff' : '#7209DB',
                                        margin: 0,
                                        textShadow: isActive ? '0 2px 4px rgba(0,0,0,0.2)' : 'none'
                                    }
                                });
                            }

                            if (React.isValidElement(subChild) && subChild.type === 'span') {
                                return React.cloneElement(subChild, {
                                    style: {
                                        ...subChild.props.style,
                                        color: isActive ? '#fff' : '#7209DB'
                                    }
                                });
                            }

                            return subChild;
                        })
                    });
                }
                return child;
            })}
        </div>
    </div>
);

const MarketingPyramid = ({
    activeLevel,
    onLevelClick,
    dataCount,
    insightCount,
    avatarCount,
    angleCount,
    dataStatus,
    insightStatus,
    avatarStatus,
    angleStatus
}) => {
    // Add useEffect for animation styles
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .flow-line {
                animation: flowAnimation 1.5s infinite;
            }

            .pulse-point {
                animation: pulseAnimation 2s infinite;
            }

            @keyframes flowAnimation {
                0% {
                    opacity: 0;
                    transform: translateY(-5px) translateX(-50%) scaleY(1);
                }
                50% {
                    opacity: 1;
                    transform: translateY(5px) translateX(-50%) scaleY(1.2);
                }
                100% {
                    opacity: 0;
                    transform: translateY(15px) translateX(-50%) scaleY(1);
                }
            }

            @keyframes pulseAnimation {
                0% {
                    transform: scale(1) translateX(-50%);
                    opacity: 0.5;
                }
                50% {
                    transform: scale(1.05) translateX(-50%);
                    opacity: 1;
                }
                100% {
                    transform: scale(1) translateX(-50%);
                    opacity: 0.5;
                }
            }
        `;
        document.head.appendChild(styleSheet);

        // Cleanup function to remove the styles when component unmounts
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []); // Empty dependency array means this runs once on mount

    // Calculate if each level has data
    const hasData = {
        data: dataCount > 0,
        insights: insightCount > 0,
        avatars: avatarCount > 0,
        angles: angleCount > 0
    };

    return (
        <div style={{
            padding: '60px 20px 40px',
            background: 'linear-gradient(180deg, rgba(138,25,255,0.12) 0%, rgba(138,25,255,0.2) 100%)',
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '600px'  // Added to ensure consistent height
        }}>
            {/* Background Pyramid */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '80%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(138,25,255,0.08) 0%, rgba(138,25,255,0.15) 100%)',
                clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                zIndex: 0
            }} />

            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Marketing Angles - Top Level */}
                <PyramidLevel
                    height="100px"
                    backgroundColor="#5C00C7"
                    isActive={activeLevel === 'angles'}
                    onClick={() => onLevelClick('angles')}
                    level="angles"
                >
                    <div style={{ color: '#fff', textAlign: 'center' }}>
                        <BulbOutlined style={{ fontSize: '24px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                        <Title level={4} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Marketing Angles</Title>
                        <Space>
                            <Tag color="#fff" style={{ color: '#5C00C7', fontWeight: 'bold' }}>{angleCount} Angles</Tag>
                            {angleStatus === 'generating' && <Tag icon={<LoadingOutlined />} color="processing">Generating</Tag>}
                        </Space>
                    </div>
                </PyramidLevel>

                {/* Customer Avatars - Third Level */}
                <PyramidLevel
                    height="120px"
                    backgroundColor="#7209DB"
                    isActive={activeLevel === 'avatars'}
                    onClick={() => onLevelClick('avatars')}
                    level="avatars"
                >
                    <div style={{ color: '#fff', textAlign: 'center' }}>
                        <UserOutlined style={{ fontSize: '24px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                        <Title level={4} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Customer Avatars</Title>
                        <Space>
                            <Tag color="#fff" style={{ color: '#7209DB', fontWeight: 'bold' }}>{avatarCount} Personas</Tag>
                            {avatarStatus === 'generating' && <Tag icon={<LoadingOutlined />} color="processing">Generating</Tag>}
                        </Space>
                    </div>
                </PyramidLevel>

                {/* Market Insights - Second Level */}
                <PyramidLevel
                    height="140px"
                    backgroundColor="#8821E0"
                    isActive={activeLevel === 'insights'}
                    onClick={() => onLevelClick('insights')}
                    level="insights"
                >
                    <div style={{ color: '#fff', textAlign: 'center' }}>
                        <AimOutlined style={{ fontSize: '24px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                        <Title level={4} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Market Insights</Title>
                        <Space>
                            <Tag color="#fff" style={{ color: '#8821E0', fontWeight: 'bold' }}>{insightCount} Insights</Tag>
                            {insightStatus === 'generating' && <Tag icon={<LoadingOutlined />} color="processing">Analyzing</Tag>}
                        </Space>
                    </div>
                </PyramidLevel>

                {/* Data Collection - Base Level */}
                <PyramidLevel
                    height="160px"
                    backgroundColor="#9E39E5"
                    isActive={activeLevel === 'data'}
                    onClick={() => onLevelClick('data')}
                    level="data"
                >
                    <div style={{ color: '#fff', textAlign: 'center' }}>
                        <DatabaseOutlined style={{ fontSize: '24px', marginBottom: '8px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                        <Title level={4} style={{ color: '#fff', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>Data</Title>
                        <Space>
                            <Tag color="#fff" style={{ color: '#9E39E5', fontWeight: 'bold' }}>{dataCount} Sources</Tag>
                            {dataStatus === 'collecting' && <Tag icon={<LoadingOutlined />} color="processing">Collecting</Tag>}
                        </Space>
                    </div>
                </PyramidLevel>

                {/* Processing Indicators */}
                <div style={{
                    position: 'absolute',
                    right: '-20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {(dataStatus === 'collecting' || insightStatus === 'generating' ||
                        avatarStatus === 'generating' || angleStatus === 'generating') && (
                            <Progress
                                type="circle"
                                percent={99}
                                size={24}
                                status="active"
                                style={{
                                    marginBottom: '8px',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                }}
                            />
                        )}
                </div>
            </div>
        </div>
    );
};

const DataCollectionView = ({ onDataCollected }) => (
    <Card className="pyramid-detail-view">
        <Divider>Data Collection</Divider>

        <Collapse ghost>
            <Panel header="Manual Quote Entry" key="manual">
                <Form layout="vertical">
                    <Form.Item
                        label="Add a quote or review"
                        name="quote"
                        rules={[{ required: true, message: 'Please enter the quote' }]}
                    >
                        <TextArea
                            rows={3}
                            placeholder="Enter the exact quote..."
                        />
                    </Form.Item>
                    <Form.Item
                        label="Source"
                        name="source"
                        rules={[{ required: true, message: 'Please specify the source' }]}
                    >
                        <Input placeholder="Where is this quote from? (e.g., Amazon Review, Customer Email)" />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="category"
                    >
                        <Select placeholder="Categorize this quote">
                            <Select.OptGroup label="Customer Feedback">
                                <Select.Option value="review">Product Review</Select.Option>
                                <Select.Option value="feedback">General Feedback</Select.Option>
                                <Select.Option value="testimonial">Testimonial</Select.Option>
                                <Select.Option value="complaint">Complaint</Select.Option>
                                <Select.Option value="suggestion">Feature Suggestion</Select.Option>
                            </Select.OptGroup>
                            <Select.OptGroup label="Market Research">
                                <Select.Option value="competitor">Competitor Information</Select.Option>
                                <Select.Option value="competitor-review">Competitor Review</Select.Option>
                                <Select.Option value="competitor-comparison">Product Comparison</Select.Option>
                                <Select.Option value="market-trend">Market Trend</Select.Option>
                            </Select.OptGroup>
                            <Select.OptGroup label="Influencer Content">
                                <Select.Option value="influencer-review">Influencer Review</Select.Option>
                                <Select.Option value="influencer-mention">Influencer Mention</Select.Option>
                                <Select.Option value="expert-opinion">Expert Opinion</Select.Option>
                            </Select.OptGroup>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Additional Context"
                        name="context"
                    >
                        <Input.TextArea
                            rows={2}
                            placeholder="Add any relevant context (e.g., competitor's market position, influencer's expertise)"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary">
                            Add Quote
                        </Button>
                    </Form.Item>
                </Form>
            </Panel>

            <Panel header="Text Analysis" key="analysis">
                <Form layout="vertical">
                    <Alert
                        message="AI-Powered Content Analysis"
                        description="Paste any text content and our AI will automatically identify and extract relevant quotes, reviews, competitor information, and influencer mentions."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Form.Item
                        name="content"
                        rules={[{ required: true, message: 'Please input the content to analyze' }]}
                    >
                        <TextArea
                            rows={8}
                            placeholder="Paste your content here (reviews, articles, competitor analysis, influencer content)..."
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" icon={<RobotOutlined />}>
                                Analyze Content
                            </Button>
                            <Text type="secondary">Our AI will identify and categorize all relevant information</Text>
                        </Space>
                    </Form.Item>
                </Form>
            </Panel>

            <Panel header="Automated Collection" key="automated">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                        message="Automated Data Collection"
                        description="Enter URLs to automatically collect reviews, competitor information, and influencer content from various platforms."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Card size="small" title="Product Reviews">
                        <Input.Search
                            placeholder="Enter Amazon product URL"
                            enterButton={<><ShoppingOutlined /> Collect Reviews</>}
                            allowClear
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Collects product reviews and ratings
                        </Text>
                    </Card>
                    <Card size="small" title="Competitor Analysis">
                        <Input.Search
                            placeholder="Enter competitor's product URL"
                            enterButton={<><TeamOutlined /> Analyze Competitor</>}
                            allowClear
                        />
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Analyzes competitor's product features, pricing, and positioning
                        </Text>
                    </Card>
                    <Card size="small" title="Social Media & Discussions">
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Input.Search
                                placeholder="Enter Reddit thread URL"
                                enterButton={<><RedditOutlined /> Collect Discussions</>}
                                allowClear
                            />
                            <Input.Search
                                placeholder="Enter YouTube video URL"
                                enterButton={<><YoutubeOutlined /> Collect Content</>}
                                allowClear
                            />
                            <Input.Search
                                placeholder="Enter Twitter/X hashtag or profile"
                                enterButton="Collect Mentions"
                                allowClear
                            />
                        </Space>
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                            Collects discussions, reviews, and influencer content
                        </Text>
                    </Card>
                </Space>
            </Panel>

            <Panel header="Image Extractor" key="image-extractor">
                <Space direction="vertical" style={{ width: '100%' }}>
                    <Alert
                        message="Image Extraction"
                        description="Enter URLs to automatically extract images. Add as many URLs as needed, and we'll collect all relevant images."
                        type="info"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                    <Form layout="vertical">
                        <Form.List
                            name="imageUrls"
                            initialValue={['']} // Start with one empty input
                        >
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, index) => (
                                        <Form.Item
                                            required={false}
                                            key={field.key}
                                        >
                                            <Space>
                                                <Form.Item
                                                    {...field}
                                                    validateTrigger={['onChange', 'onBlur']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            whitespace: true,
                                                            message: "Please input a URL or delete this field",
                                                        },
                                                        {
                                                            type: 'url',
                                                            message: 'Please enter a valid URL',
                                                        },
                                                    ]}
                                                    noStyle
                                                >
                                                    <Input
                                                        placeholder="Enter URL to extract images from"
                                                        style={{ width: '400px' }}
                                                    />
                                                </Form.Item>
                                                {fields.length > 1 && (
                                                    <DeleteOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() => remove(field.name)}
                                                    />
                                                )}
                                            </Space>
                                        </Form.Item>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            icon={<PlusOutlined />}
                                            style={{ width: '400px' }}
                                        >
                                            Add URL
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item>
                            <Button type="primary" icon={<CloudDownloadOutlined />}>
                                Extract Images
                            </Button>
                        </Form.Item>
                    </Form>
                    <div style={{ marginTop: 16 }}>
                        <Text type="secondary">
                            Supported image formats: JPG, PNG, GIF, WebP
                        </Text>
                        <br />
                        <Text type="secondary">
                            Images will be automatically downloaded and organized
                        </Text>
                    </div>
                </Space>
            </Panel>

        </Collapse>

        <Divider>Collected Data</Divider>

        <List
            itemLayout="vertical"
            dataSource={[]} // Will be populated with collected data
            locale={{ emptyText: 'No data collected yet. Use one of the methods above to add data.' }}
            renderItem={item => (
                <List.Item
                    actions={[
                        <Button type="link" icon={<EditOutlined />}>Edit</Button>,
                        <Button type="link" danger icon={<DeleteOutlined />}>Remove</Button>
                    ]}
                    extra={
                        <Space>
                            <Tag color={
                                item.category.startsWith('competitor') ? 'orange' :
                                    item.category.startsWith('influencer') ? 'purple' :
                                        'blue'
                            }>{item.category}</Tag>
                            <Tag color="cyan">{item.source}</Tag>
                        </Space>
                    }
                >
                    <List.Item.Meta
                        title={`${item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')} from ${item.source}`}
                        description={
                            <Space direction="vertical" size={0}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Added {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                </Text>
                                {item.context && (
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Context: {item.context}
                                    </Text>
                                )}
                            </Space>
                        }
                    />
                    <Paragraph>{item.content}</Paragraph>
                </List.Item>
            )}
        />
    </Card>
);

const InsightsView = ({ insights, isGenerating }) => (
    <Card
        title="Market Insights"
        className="pyramid-detail-view"
        extra={
            <Button type="primary" icon={<RobotOutlined />} loading={isGenerating}>
                Regenerate Insights
            </Button>
        }
    >
        <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={insights || []}
            locale={{ emptyText: 'No insights generated yet. They will be automatically generated from collected data.' }}
            renderItem={insight => (
                <List.Item>
                    <Card>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Tag color={insight.confidence > 80 ? 'green' : 'orange'}>
                                {insight.confidence}% Confidence
                            </Tag>
                            <Title level={5}>{insight.title}</Title>
                            <Paragraph>{insight.description}</Paragraph>
                            <Space wrap>
                                {insight.tags?.map(tag => (
                                    <Tag key={tag}>{tag}</Tag>
                                ))}
                            </Space>
                            <Text type="secondary">
                                Based on {insight.sourceCount} data points
                            </Text>
                        </Space>
                    </Card>
                </List.Item>
            )}
        />
    </Card>
);

const AvatarsView = ({ avatars, isGenerating }) => (
    <Card
        title="Customer Avatars"
        className="pyramid-detail-view"
        extra={
            <Button type="primary" icon={<RobotOutlined />} loading={isGenerating}>
                Regenerate Avatars
            </Button>
        }
    >
        <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={avatars || []}
            locale={{ emptyText: 'No avatars generated yet. They will be automatically generated from insights.' }}
            renderItem={avatar => (
                <List.Item>
                    <Card>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <Avatar size={64} icon={<UserOutlined />} />
                        </div>
                        <Title level={4} style={{ textAlign: 'center' }}>{avatar.name}</Title>
                        <Paragraph>{avatar.description}</Paragraph>
                        <Divider>Characteristics</Divider>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            {avatar.traits?.map(trait => (
                                <Tag key={trait} style={{ width: '100%', textAlign: 'center' }}>
                                    {trait}
                                </Tag>
                            ))}
                        </Space>
                        <Divider>Pain Points</Divider>
                        <List
                            size="small"
                            dataSource={avatar.painPoints || []}
                            renderItem={point => (
                                <List.Item>
                                    <Text type="secondary">{point}</Text>
                                </List.Item>
                            )}
                        />
                    </Card>
                </List.Item>
            )}
        />
    </Card>
);

const MarketingAnglesView = ({ angles, isGenerating }) => (
    <Card
        title="Marketing Angles"
        className="pyramid-detail-view"
        extra={
            <Button type="primary" icon={<RobotOutlined />} loading={isGenerating}>
                Regenerate Angles
            </Button>
        }
    >
        <List
            grid={{ gutter: 16, column: 2 }}
            dataSource={angles || []}
            locale={{ emptyText: 'No marketing angles generated yet. They will be automatically generated from avatars.' }}
            renderItem={angle => (
                <List.Item>
                    <Card>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Title level={4}>{angle.title}</Title>
                            <Paragraph>{angle.description}</Paragraph>
                            <Divider>Key Points</Divider>
                            <List
                                size="small"
                                dataSource={angle.points || []}
                                renderItem={point => (
                                    <List.Item>
                                        <Text>• {point}</Text>
                                    </List.Item>
                                )}
                            />
                            <Divider>Target Avatars</Divider>
                            <Space wrap>
                                {angle.targetAvatars?.map(avatar => (
                                    <Tag key={avatar} color="purple">{avatar}</Tag>
                                ))}
                            </Space>
                            <Divider>Tone & Style</Divider>
                            <Space wrap>
                                {angle.style?.map(tag => (
                                    <Tag key={tag} color="blue">{tag}</Tag>
                                ))}
                            </Space>
                        </Space>
                    </Card>
                </List.Item>
            )}
        />
    </Card>
);

export default function ProductDetail() {
    const { projectId, productId } = useParams();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDataInputModalOpen, setIsDataInputModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [dataInputForm] = Form.useForm();
    const [activeAgent, setActiveAgent] = useState(null);
    const [inputMethod, setInputMethod] = useState('text'); // text, url-amazon, url-reddit, url-youtube
    const [activeLevel, setActiveLevel] = useState('data');
    const [pyramidStats, setPyramidStats] = useState({
        dataCount: 0,
        insightCount: 0,
        avatarCount: 0,
        angleCount: 0,
        dataStatus: 'idle',    // idle, collecting
        insightStatus: 'idle', // idle, generating
        avatarStatus: 'idle',  // idle, generating
        angleStatus: 'idle'    // idle, generating
    });
    const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

    const {
        currentProduct,
        fetchProduct,
        updateProduct,
        deleteProduct,
        isLoading,
        error
    } = useProductStore();

    const { fetchProject } = useProjectStore();

    // Mock data for demonstration
    const [scrapedData, setScrapedData] = useState([]);
    const [marketingAngles, setMarketingAngles] = useState([]);
    const [marketPatterns, setMarketPatterns] = useState([]);
    const [competitorData, setCompetitorData] = useState([]);
    const [salesPageContent, setSalesPageContent] = useState('');
    const [avatars, setAvatars] = useState([]);

    // New states for the analysis flow
    const [analysisStatus, setAnalysisStatus] = useState('idle'); // idle, scraping, analyzing, generating, complete
    const [scrapingProgress, setScrapingProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchProduct(projectId, productId);
            } catch (error) {
                toast.error('Error loading product: ' + error.message);
                navigate(`/projects/${projectId}`);
            }
        };
        loadData();
    }, [productId, fetchProduct, navigate, projectId]);

    const handleUpdateProduct = async (values) => {
        try {
            await updateProduct(projectId, productId, values);
            setIsEditOpen(false);
            toast.success('Product updated successfully');
        } catch (error) {
            toast.error('Error updating product: ' + error.message);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(projectId, productId);
            // After successful deletion, refresh the project to update the products summary
            await fetchProject(projectId);
            toast.success('Product deleted successfully');
            navigate(`/projects/${projectId}`);
        } catch (error) {
            toast.error('Error deleting product: ' + error.message);
        }
    };

    const launchAgent = (agentType) => {
        setActiveAgent(agentType);
        toast.info(`Launching ${agentType} agent...`);
        // Here you would integrate with your AI agent system
    };

    const startAnalysis = async () => {
        setIsDataInputModalOpen(true);
    };

    const handleDataInput = async (values) => {
        setIsDataInputModalOpen(false);
        dataInputForm.resetFields();
        setAnalysisStatus('scraping');
        setCurrentStep(0);

        // Simulate scraping progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += 10;
            setScrapingProgress(progress);
            if (progress >= 100) {
                clearInterval(progressInterval);
                proceedToPatternAnalysis();
            }
        }, 1000);

        try {
            setActiveAgent('data-scraper');
            // Here you would actually call your scraping service based on the input method
            // For now, we'll simulate it with different mock data based on input type
            await new Promise(resolve => setTimeout(resolve, 10000));

            let mockData;
            switch (values.inputMethod) {
                case 'text':
                    mockData = [
                        { source: 'Text Input', content: 'Extracted quote 1 from text' },
                        { source: 'Text Input', content: 'Extracted quote 2 from text' }
                    ];
                    break;
                case 'url-amazon':
                    mockData = [
                        { source: 'Amazon Review', content: 'Great product! Very satisfied with the purchase.' },
                        { source: 'Amazon Review', content: 'The quality exceeded my expectations.' }
                    ];
                    break;
                case 'url-reddit':
                    mockData = [
                        { source: 'Reddit Thread', content: 'User experience with the product...' },
                        { source: 'Reddit Comment', content: 'Interesting perspective on use cases...' }
                    ];
                    break;
                case 'url-youtube':
                    mockData = [
                        { source: 'YouTube Comment', content: 'Detailed review of features...' },
                        { source: 'YouTube Comment', content: 'Comparison with similar products...' }
                    ];
                    break;
                default:
                    mockData = [];
            }
            setScrapedData(mockData);
        } catch (error) {
            toast.error('Error during scraping');
            setAnalysisStatus('idle');
            return;
        }
    };

    const proceedToPatternAnalysis = async () => {
        setAnalysisStatus('analyzing');
        setCurrentStep(1);
        setActiveAgent('market-patterns');

        try {
            // Simulate pattern analysis
            await new Promise(resolve => setTimeout(resolve, 5000));
            setMarketPatterns([
                {
                    title: 'Pattern 1',
                    description: 'Market trend analysis',
                    trendScore: 85,
                    confidence: 90
                }
            ]);
            proceedToAvatarGeneration();
        } catch (error) {
            toast.error('Error analyzing patterns');
            setAnalysisStatus('idle');
        }
    };

    const proceedToAvatarGeneration = async () => {
        setAnalysisStatus('generating');
        setCurrentStep(2);
        setActiveAgent('avatar-creator');

        try {
            // Simulate avatar generation
            await new Promise(resolve => setTimeout(resolve, 5000));
            setAvatars([
                {
                    name: 'Persona 1',
                    description: 'Primary target audience',
                    traits: ['Tech-savvy', 'Early adopter']
                }
            ]);
            proceedToAngleGeneration();
        } catch (error) {
            toast.error('Error generating avatars');
            setAnalysisStatus('idle');
        }
    };

    const proceedToAngleGeneration = async () => {
        setCurrentStep(3);
        setActiveAgent('marketing-angles');

        try {
            // Simulate marketing angle generation
            await new Promise(resolve => setTimeout(resolve, 5000));
            setMarketingAngles([
                {
                    title: 'Angle 1',
                    description: 'Marketing approach based on patterns and avatars',
                    tags: ['Innovative', 'Value-focused']
                }
            ]);
            setAnalysisStatus('complete');
            setActiveAgent(null);
            toast.success('Analysis complete!');
        } catch (error) {
            toast.error('Error generating marketing angles');
            setAnalysisStatus('idle');
        }
    };

    const handleLevelClick = (level) => {
        setActiveLevel(level);
        setIsDetailDrawerOpen(true);

        // Smooth scroll to the clicked level
        const levelElement = document.querySelector(`[data-level="${level}"]`);
        if (levelElement) {
            setTimeout(() => {
                levelElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300); // Wait for drawer to open
        }
    };

    const renderAnalysisProgress = () => (
        <Card style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Steps current={currentStep} status={analysisStatus === 'idle' ? 'wait' : 'process'}>
                    <Step title="Data Collection" description="Scraping reviews and quotes" icon={<DatabaseOutlined />} />
                    <Step title="Pattern Analysis" description="Identifying market trends" icon={<LineChartOutlined />} />
                    <Step title="Avatar Creation" description="Generating customer personas" icon={<UserOutlined />} />
                    <Step title="Marketing Angles" description="Crafting approaches" icon={<BulbOutlined />} />
                </Steps>

                {analysisStatus === 'scraping' && (
                    <div style={{ marginTop: 16 }}>
                        <Progress percent={scrapingProgress} status="active" />
                        <Text type="secondary">Collecting data from various sources...</Text>
                    </div>
                )}

                {analysisStatus === 'idle' ? (
                    <div style={{ marginTop: 16 }}>
                        <Form
                            form={dataInputForm}
                            layout="vertical"
                            onFinish={handleDataInput}
                            initialValues={{ inputMethod: 'text' }}
                        >
                            <Form.Item
                                name="inputMethod"
                                label="Select Data Source"
                            >
                                <Radio.Group
                                    onChange={(e) => setInputMethod(e.target.value)}
                                    buttonStyle="solid"
                                >
                                    <Space wrap>
                                        <Radio.Button value="text">
                                            <Space>
                                                <FileTextOutlined />
                                                Text Content
                                            </Space>
                                        </Radio.Button>
                                        <Radio.Button value="url-amazon">
                                            <Space>
                                                <ShoppingOutlined />
                                                Amazon URL
                                            </Space>
                                        </Radio.Button>
                                        <Radio.Button value="url-reddit">
                                            <Space>
                                                <RedditOutlined />
                                                Reddit URL
                                            </Space>
                                        </Radio.Button>
                                        <Radio.Button value="url-youtube">
                                            <Space>
                                                <YoutubeOutlined />
                                                YouTube URL
                                            </Space>
                                        </Radio.Button>
                                    </Space>
                                </Radio.Group>
                            </Form.Item>

                            {inputMethod === 'text' ? (
                                <Form.Item
                                    name="content"
                                    rules={[{ required: true, message: 'Please input your content' }]}
                                >
                                    <TextArea
                                        rows={6}
                                        placeholder="Paste any text content containing reviews, testimonials, or relevant information..."
                                        style={{ marginBottom: 16 }}
                                    />
                                </Form.Item>
                            ) : (
                                <Form.Item
                                    name="url"
                                    rules={[
                                        { required: true, message: 'Please input the URL' },
                                        { type: 'url', message: 'Please enter a valid URL' }
                                    ]}
                                >
                                    <Input
                                        placeholder={`Enter ${inputMethod.split('-')[1]} URL here...`}
                                        prefix={inputMethod === 'url-amazon' ? <ShoppingOutlined /> :
                                            inputMethod === 'url-reddit' ? <RedditOutlined /> :
                                                <YoutubeOutlined />}
                                    />
                                </Form.Item>
                            )}

                            <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<RobotOutlined />}
                                    size="large"
                                >
                                    Start Analysis
                                </Button>
                            </Form.Item>
                        </Form>
                        <Text type="secondary" style={{ display: 'block', marginTop: 8, textAlign: 'center' }}>
                            Select a data source and start the analysis
                        </Text>
                    </div>
                ) : analysisStatus === 'complete' ? (
                    <Alert
                        message="Analysis Complete"
                        description="All analyses have been generated based on the collected data."
                        type="success"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                ) : (
                    <Alert
                        message="Analysis in Progress"
                        description="Please wait while we process the data and generate insights."
                        type="info"
                        showIcon
                        style={{ marginTop: 16 }}
                    />
                )}
            </Space>
        </Card>
    );

    const renderDetailView = () => {
        switch (activeLevel) {
            case 'data':
                return <DataCollectionView onDataCollected={() => { }} />;
            case 'insights':
                return <InsightsView insights={marketPatterns} isGenerating={analysisStatus === 'analyzing'} />;
            case 'avatars':
                return <AvatarsView avatars={avatars} isGenerating={analysisStatus === 'generating'} />;
            case 'angles':
                return <MarketingAnglesView angles={marketingAngles} isGenerating={activeAgent === 'marketing-angles'} />;
            default:
                return null;
        }
    };

    const getDetailTitle = () => {
        switch (activeLevel) {
            case 'data':
                return 'Data';
            case 'insights':
                return 'Market Insights';
            case 'avatars':
                return 'Customer Avatars';
            case 'angles':
                return 'Marketing Angles';
            default:
                return '';
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <Text>Loading product details...</Text>
                </Space>
            </div>
        );
    }

    if (error || !currentProduct) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Space direction="vertical">
                    <Text>Error loading product details. Please try again.</Text>
                    <Button onClick={() => navigate(`/projects/${projectId}`)}>
                        Back to Project
                    </Button>
                </Space>
            </div>
        );
    }

    const agentSections = [
        {
            key: 'analysis-flow',
            title: 'Analysis Flow',
            icon: <LineChartOutlined />,
            content: (
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    minHeight: '700px',
                    display: 'flex',
                    flexDirection: 'row',
                    paddingRight: isDetailDrawerOpen ? '560px' : '0', // Add space for drawer
                    paddingTop: '2rem',
                    paddingBottom: '4rem',
                    transition: 'padding-right 0.3s ease'
                }}>
                    <div style={{
                        transition: 'all 0.3s ease',
                        width: '100%',
                        padding: '0 20px',
                        position: 'relative'
                    }}>
                        <MarketingPyramid
                            activeLevel={activeLevel}
                            onLevelClick={handleLevelClick}
                            {...pyramidStats}
                        />
                    </div>
                    <Drawer
                        title={getDetailTitle()}
                        placement="right"
                        width={560}
                        onClose={() => setIsDetailDrawerOpen(false)}
                        open={isDetailDrawerOpen}
                        mask={false}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            height: '100%',
                            boxShadow: '-4px 0 8px rgba(0,0,0,0.1)',
                            background: '#fff',
                            borderRadius: '16px 0 0 16px',
                            overflow: 'hidden'
                        }}
                        bodyStyle={{
                            padding: '20px',
                            background: '#fff',
                            height: 'calc(100% - 55px)', // Account for header height
                            overflow: 'auto'
                        }}
                        headerStyle={{
                            background: '#fff',
                            borderBottom: '1px solid rgba(0,0,0,0.06)',
                            padding: '16px 20px',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }}
                        className="detail-drawer"
                        rootStyle={{
                            position: 'absolute'
                        }}
                        getContainer={false}
                    >
                        {renderDetailView()}
                    </Drawer>
                </div>
            )
        }
    ];

    return (
        <div style={{ padding: '2rem 2rem 4rem', maxWidth: '100%', margin: '0 auto' }}>
            <Card style={{
                overflow: 'hidden',
                minHeight: '80vh',
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <Title level={2} style={{ marginBottom: '0.5rem' }}>{currentProduct.name}</Title>
                        <Text type="secondary">
                            {currentProduct.created_at ?
                                `Created ${formatDistanceToNow(new Date(currentProduct.created_at), { addSuffix: true })}` :
                                'Recently created'
                            }
                        </Text>
                    </div>
                    <Space>
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setIsEditOpen(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setIsDeleteModalOpen(true)}
                        >
                            Delete
                        </Button>
                    </Space>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <Title level={4}>Description</Title>
                    <Paragraph type="secondary">
                        {currentProduct.description || 'No description provided.'}
                    </Paragraph>
                </div>

                <Divider />

                <Tabs defaultActiveKey="analysis-flow">
                    {agentSections.map(section => (
                        <TabPane
                            tab={
                                <span>
                                    {section.icon}
                                    <span style={{ marginLeft: 8 }}>{section.title}</span>
                                </span>
                            }
                            key={section.key}
                        >
                            {section.content}
                        </TabPane>
                    ))}
                </Tabs>
            </Card>

            {/* Edit Modal */}
            <Modal
                title="Edit Product"
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProduct}
                    initialValues={currentProduct}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Space>
                            <Button onClick={() => setIsEditOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Save Changes
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                title="Delete Product"
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="delete" danger onClick={handleDeleteProduct}>
                        Delete
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete this product? This action cannot be undone.</p>
            </Modal>
        </div>
    );
} 
