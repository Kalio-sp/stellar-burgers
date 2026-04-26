import { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  onlyUnAuth = false,
  component
}) => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from.pathname || '/'} replace />;
  }

  return component;
};
