import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;

export default function Dashboard() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout style={{ marginLeft: 250 }}>
                <Content style={{ background: '#f5f5f5' }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
