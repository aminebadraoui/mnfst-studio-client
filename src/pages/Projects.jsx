import { Card, Typography, Button, Row, Col, Spin, Modal, Form, Input } from 'antd';
import { PlusOutlined, DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useProjectStore from '../stores/projectStore';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function Projects() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [form] = Form.useForm();
    const { projects, isLoading: projectsLoading, fetchProjects, createProject, deleteProject } = useProjectStore();

    const onOpen = () => setIsOpen(true);
    const onClose = () => {
        setIsOpen(false);
        form.resetFields();
    };

    // Initial data fetch
    useEffect(() => {
        const loadData = async () => {
            await fetchProjects();
        };
        loadData();
    }, [fetchProjects]);

    const getProductCount = (project) => {
        return project.products_summary?.total_count || 0;
    };

    const handleNewProject = async (values) => {
        const project = await createProject(values);
        if (project) {
            onClose();
            navigate(`/projects/${project.id}`);
        }
    };

    const handleDeleteProject = async (e, projectId) => {
        e.stopPropagation();
        Modal.confirm({
            title: 'Are you sure you want to delete this project?',
            content: 'This action cannot be undone.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => deleteProject(projectId),
        });
    };

    if (projectsLoading && projects.length === 0) {
        return (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <Title level={2} style={{ marginBottom: '0.5rem' }}>Projects</Title>
                    <Text type="secondary">Manage your marketing research projects</Text>
                </div>
                <Button type="primary" icon={<PlusOutlined />} onClick={onOpen}>
                    New Project
                </Button>
            </div>

            <Row gutter={[24, 24]}>
                {projects.map(project => (
                    <Col xs={24} md={12} lg={8} key={project.id}>
                        <Card
                            hoverable
                            onClick={() => navigate(`/projects/${project.id}`)}
                            extra={
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={(e) => handleDeleteProject(e, project.id)}
                                />
                            }
                        >
                            <Title level={4} style={{ marginBottom: '0.5rem' }}>{project.name}</Title>
                            <Text type="secondary" style={{ display: 'block', marginBottom: '1rem' }}>
                                {project.description}
                            </Text>
                            <div style={{ display: 'flex', gap: '1rem', color: 'rgba(0, 0, 0, 0.45)' }}>
                                <Text type="secondary">
                                    <InboxOutlined style={{ marginRight: '0.5rem' }} />
                                    {getProductCount(project)} {getProductCount(project) === 1 ? 'Product' : 'Products'}
                                </Text>
                                <Text type="secondary">
                                    Updated {formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}
                                </Text>
                            </div>
                        </Card>
                    </Col>
                ))}
                <Col xs={24} md={12} lg={8}>
                    <Card
                        hoverable
                        onClick={onOpen}
                        style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9' }}
                        bodyStyle={{ textAlign: 'center' }}
                    >
                        <PlusOutlined style={{ fontSize: '24px', color: '#8a19ff', marginBottom: '0.5rem' }} />
                        <Text type="secondary">Create New Project</Text>
                    </Card>
                </Col>
            </Row>

            <Modal
                title="Create New Project"
                open={isOpen}
                onCancel={onClose}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleNewProject}
                >
                    <Form.Item
                        name="name"
                        label="Project Name"
                        rules={[{ required: true, message: 'Please enter project name' }]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <TextArea
                            placeholder="Enter project description"
                            rows={4}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button onClick={onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Create Project
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
} 