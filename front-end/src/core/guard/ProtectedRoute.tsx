import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[]; // Các role được phép truy cập route này
  redirectPath?: string; // Đường dẫn điều hướng khi không đủ quyền
  children?: React.ReactNode; // Nội dung bên trong route
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectPath = '/login',
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Kiểm tra xem người dùng có đăng nhập hay không
  const [userRole, setUserRole] = useState<string | null>(null); // Role của người dùng
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const location = useLocation();

  useEffect(() => {
    // Hàm kiểm tra người dùng có đăng nhập hay không
    const checkAuth = () => {
      const auth = JSON.parse(localStorage.getItem('auth') || '{}'); // Lấy thông tin auth từ localStorage
      const token = auth.token; // Lấy token
      const role = auth.user?.role?.name; // Lấy role từ user object

      console.log(role);

      if (token) {
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Nếu đang trong trạng thái loading, có thể hiển thị spinner hoặc loading indicator
  if (loading) {
    return <div>Loading...</div>; // Hoặc có thể sử dụng một component loading tùy chỉnh
  }

  // Nếu người dùng chưa đăng nhập, điều hướng về trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // Kiểm tra nếu role không được phép truy cập vào route này
  if (userRole && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu tất cả các điều kiện đều đúng, hiển thị nội dung bên trong route
  return (
    <>
      {children}
      {/* <Outlet /> */}
    </>
  );
};

export default ProtectedRoute;
