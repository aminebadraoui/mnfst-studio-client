import { theme } from 'antd';

export const customTheme = {
    algorithm: theme.defaultAlgorithm,
    token: {
        colorPrimary: '#8a19ff',
        colorSuccess: '#10B981',
        colorWarning: '#F59E0B',
        colorError: '#EF4444',
        colorInfo: '#3B82F6',
        borderRadius: 8,
        fontFamily: 'Inter, system-ui, sans-serif',
    },
    components: {
        Card: {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadiusLG: 16,
        },
        Button: {
            borderRadius: 8,
            fontWeight: 500,
        },
    },
}; 