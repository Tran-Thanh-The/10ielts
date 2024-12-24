import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import DashboardLayout from '@/features/dashboard/layouts/dashboard-layout/DashboardLayout'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsStudentDashboard } from '@/features/auth/slices/authSlice'

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
