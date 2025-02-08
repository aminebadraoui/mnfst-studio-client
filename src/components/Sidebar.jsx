import { Layout, Menu, Button, Modal, Form, Input } from 'antd';
import { FolderOutlined, SettingOutlined, LogoutOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useProjectStore from '../stores/projectStore';
import './Sidebar.css';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Sidebar() {
    const location = useLocation();
    const { projects, createProject, fetchProjects } = useProjectStore();
    const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [openKeys, setOpenKeys] = useState(['projects']);

    // Fetch projects when component mounts
    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Update openKeys when projectId changes
    useEffect(() => {
        const { projectId } = getCurrentIds();
        if (projectId) {
            setOpenKeys(['projects', `project-${projectId}`]);
        }
    }, [location.pathname]);

    // Handle submenu open/close
    const onOpenChange = (keys) => {
        setOpenKeys(keys);
    };

    // Extract current project and product IDs from URL
    const getCurrentIds = () => {
        const matches = location.pathname.match(/\/projects\/([^\/]+)(?:\/products\/([^\/]+))?/);
        return {
            projectId: matches?.[1],
            productId: matches?.[2]
        };
    };

    const { projectId, productId } = getCurrentIds();

    const handleNewProject = async (values) => {
        try {
            await createProject(values);
            setIsNewProjectModalOpen(false);
            form.resetFields();
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const getProjectSubMenu = (project) => {
        console.log('Project in sidebar:', project);
        console.log('Project products:', project.products_summary?.products);
        console.log('Project ID:', project.id);
        const projectProducts = project.products_summary?.products || [];
        console.log('Processed project products:', projectProducts);

        const submenu = (
            <SubMenu
                key={`project-${project.id}`}
                icon={<FolderOutlined />}
                title={project.name}
            >
                {projectProducts.map(product => {
                    console.log('Rendering product:', product);
                    return (
                        <Menu.Item
                            key={`/projects/${project.id}/products/${product.id}`}
                            icon={<AppstoreOutlined />}
                        >
                            <Link to={`/projects/${project.id}/products/${product.id}`}>
                                {product.name}
                            </Link>
                        </Menu.Item>
                    );
                })}
            </SubMenu>
        );
        console.log('Generated submenu:', submenu);
        return submenu;
    };

    console.log('Current projects in sidebar:', projects);
    console.log('Current openKeys:', openKeys);

    return (
        <Sider
            theme="light"
            style={{
                overflow: 'auto',
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                background: '#fff',
                borderRight: '1px solid rgba(0,0,0,0.06)',
                zIndex: 1000
            }}
            width={250}
        >
            <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{
                    height: '64px',
                    padding: '16px 24px',
                    background: '#7209DB',
                    color: '#fff',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer'
                }}>
                    MNFST Studio
                </div>
            </Link>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={['projects']}
                openKeys={openKeys}
                className="sidebar-menu"
                style={{
                    border: 'none',
                    height: 'calc(100vh - 64px)',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onOpenChange={onOpenChange}
            >
                <div>
                    <div className="projects-header">
                        <Link to="/projects" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <span style={{ cursor: 'pointer' }}>Projects</span>
                        </Link>
                        <Button
                            type="text"
                            icon={<PlusOutlined />}
                            onClick={() => setIsNewProjectModalOpen(true)}
                            size="small"
                        />
                    </div>
                    {projects.map(project => getProjectSubMenu(project))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <Menu.Item
                        key="/settings"
                        icon={<SettingOutlined />}
                    >
                        <Link to="/settings">Settings</Link>
                    </Menu.Item>

                    <Menu.Item
                        key="sign-out"
                        icon={<LogoutOutlined />}
                        style={{ color: '#ff4d4f' }}
                    >
                        <Link to="/sign-out">Sign Out</Link>
                    </Menu.Item>
                </div>
            </Menu>

            <Modal
                title="Create New Project"
                open={isNewProjectModalOpen}
                onCancel={() => {
                    setIsNewProjectModalOpen(false);
                    form.resetFields();
                }}
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
                        <Input.TextArea
                            placeholder="Enter project description"
                            rows={4}
                        />
                    </Form.Item>
                    <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                        <Button onClick={() => {
                            setIsNewProjectModalOpen(false);
                            form.resetFields();
                        }} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Create Project
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Sider>
    );
}