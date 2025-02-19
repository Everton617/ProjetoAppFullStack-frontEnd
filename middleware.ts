import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const useAuthMiddleware = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const publicRoutes = ['/login', '/signup'];

        const isTokenValid = (token: string): boolean => {
            try {
                const decoded = JSON.parse(atob(token.split('.')[1])) as { exp: number };
                const currentTime = Date.now() / 1000;
                return decoded.exp > currentTime;
            } catch (error) {
                return false;
            }
        };

        if (publicRoutes.includes(location.pathname)) {
            if (token && isTokenValid(token)) {
                navigate('/');
                return;
            }

            return;
        }

        if (!token || !isTokenValid(token)) {
            navigate('/login');
            return;
        }

    }, [navigate, location]);
};

export default useAuthMiddleware;