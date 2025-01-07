import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice'
import DashboardLayout from '@/features/dashboard/layouts/dashboard-layout/DashboardLayout'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

function Dashboard(props) {
  const isStudentDashboard = useSelector(selectIsStudentDashboard);

  useEffect(() => {
    if (!isStudentDashboard) {
      document.body.classList.add('admin-dashboard');
    }
  }, [isStudentDashboard])

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default Dashboard
