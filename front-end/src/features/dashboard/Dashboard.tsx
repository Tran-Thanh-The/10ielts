import React from 'react'
import PropTypes from 'prop-types'
import DashboardLayout from '@/features/dashboard/layouts/dashboard-layout/DashboardLayout'
import { Outlet } from 'react-router-dom'

function Dashboard(props) {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}

export default Dashboard
