import { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from '@/components/common/loading-page/LoadingPage'; // Import component Loading đã tách riêng
import ProtectedRoute from '@/core/guard/ProtectedRoute';
import Register from '@/features/auth/pages/register/Register';
import Profile from '@/features/dashboard/features/profile/Profile';
import { ROLE } from '@/utils/constants/constants';
import Dashboard from '@/features/dashboard/Dashboard';
import Practices from '@/features/dashboard/features/practices/Practices';
import Chat from '@/features/dashboard/features/chat/Chat';
import Payment from '@/features/public-pages/pages/payment/Payment';
import UserManagement from '@/features/dashboard/features/user-management/UserManagement';
import CourseRouter from '@/features/dashboard/features/courses/CourseRouter';

const Home = lazy(() => import('@/features/public-pages/pages/home/Home'));
const Login = lazy(() => import('@/features/auth/pages/login/Login'));
const ListCourse = lazy(
  () =>
    import(
      '@/features/public-pages/pages/course/components/list-course-page/ListCourse'
    ),
);
const VerifyEmail = lazy(
  () =>
    import(
      '@/features/auth/pages/register/components/verify-email/VerifyEmail'
    ),
);

function AppRoutes() {
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDelay(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (delay) {
    return <Loading />;
  }

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<ListCourse />} />

        {/* User navigation */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={[ROLE.USER]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* <Route path='profile' element={<Profile />} /> */}
          <Route path="" element={<Navigate to="courses" />} />
          <Route path="chat" element={<Chat />} />
          <Route path="courses/*" element={<CourseRouter />} />
          <Route path="practices" element={<Practices />} />
          <Route path="payments" element={<Payment />} />
          <Route path="user-management/*" element={<UserManagement />} />
          <Route path="*" />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
