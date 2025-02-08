import { Card, Typography, Button, Space, Spin, Form, Input, Modal, List, Empty } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useProjectStore from '../stores/projectStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function ProjectDetail() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isNewProductOpen, setIsNewProductOpen] = useState(false);
    const [form] = Form.useForm();
    const [productForm] = Form.useForm();

    const {
        currentProject,
        fetchProject,
        updateProject,
        deleteProject,
        isLoading: projectLoading,
        error: projectError
    } = useProjectStore();

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchProject(projectId);
            } catch (error) {
                toast.error('Error loading project: ' + error.message);
                navigate('/projects');
            }
        };
        loadData();
    }, [projectId, fetchProject, navigate]);

    const handleUpdateProject = async (values) => {
        try {
            await updateProject(projectId, values);
            setIsEditOpen(false);
            toast.success('Project updated successfully');
        } catch (error) {
            toast.error('Error updating project: ' + error.message);
        }
    };

    const handleDeleteProject = async () => {
        try {
            await deleteProject(projectId);
            toast.success('Project deleted successfully');
            navigate('/projects');
        } catch (error) {
            toast.error('Error deleting project: ' + error.message);
        }
    };

    const handleCreateProduct = async (values) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Failed to create product');
            }

            const newProduct = await response.json();
            productForm.resetFields();
            setIsNewProductOpen(false);
            toast.success('Product created successfully');
            // Refresh project to get updated products summary
            await fetchProject(projectId);
            // Navigate to the new product
            navigate(`/projects/${projectId}/products/${newProduct.id}`);
        } catch (error) {
            toast.error('Error creating product: ' + error.message);
        }
    };

    if (projectLoading) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (projectError || !currentProject) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <Space direction="vertical">
                    <Text>Error loading project details. Please try again.</Text>
                    <Button onClick={() => navigate('/projects')}>
                        Back to Projects
                    </Button>
                </Space>
            </div>
        );
    }

    // Detailed logging of the data structure
    console.log('Full project data:', JSON.stringify(currentProject, null, 2));
    console.log('Products summary structure:', JSON.stringify(currentProject.products_summary, null, 2));

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                    <div>
                        <Title level={2} style={{ marginBottom: '0.5rem' }}>{currentProject.name}</Title>
                        <Text type="secondary">
                            {currentProject.created_at ?
                                `Created ${formatDistanceToNow(new Date(currentProject.created_at), { addSuffix: true })}` :
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
                        {currentProject.description || 'No description provided.'}
                    </Paragraph>
                </div>

                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <Title level={4} style={{ margin: 0 }}>Products</Title>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsNewProductOpen(true)}
                        >
                            Add Product
                        </Button>
                    </div>

                    {currentProject.products_summary?.products.length === 0 ? (
                        <Empty description="No products yet" />
                    ) : (
                        <List
                            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
                            dataSource={currentProject.products_summary?.products || []}
                            renderItem={product => {
                                console.log('Product in render:', {
                                    id: product.id,
                                    name: product.name,
                                    description: product.description,
                                    full_product: product
                                });
                                return (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            onClick={() => navigate(`/projects/${projectId}/products/${product.id}`)}
                                        >
                                            <Title level={5}>{product.name}</Title>
                                            <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                                                {product.description || 'No description'}
                                            </Paragraph>
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary">
                                                    {product.created_at ?
                                                        `Created ${formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}` :
                                                        'Recently created'
                                                    }
                                                </Text>
                                                <Text type="secondary">
                                                    {product.updated_at ?
                                                        `Updated ${formatDistanceToNow(new Date(product.updated_at), { addSuffix: true })}` :
                                                        'Recently updated'
                                                    }
                                                </Text>
                                            </Space>
                                        </Card>
                                    </List.Item>
                                );
                            }}
                        />
                    )}
                </div>
            </Card>

            {/* Edit Project Modal */}
            <Modal
                title="Edit Project"
                open={isEditOpen}
                onCancel={() => setIsEditOpen(false)}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdateProject}
                    initialValues={currentProject}
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[{ required: true, message: 'Please enter project name' }]}
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

            {/* Delete Project Modal */}
            <Modal
                title="Delete Project"
                open={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsDeleteModalOpen(false)}>
                        Cancel
                    </Button>,
                    <Button key="delete" danger onClick={handleDeleteProject}>
                        Delete
                    </Button>
                ]}
            >
                <p>Are you sure you want to delete this project? This action cannot be undone.</p>
            </Modal>

            {/* New Product Modal */}
            <Modal
                title="Add New Product"
                open={isNewProductOpen}
                onCancel={() => setIsNewProductOpen(false)}
                footer={null}
            >
                <Form
                    form={productForm}
                    layout="vertical"
                    onFinish={handleCreateProduct}
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
                            <Button onClick={() => setIsNewProductOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create Product
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
} 