import CreateUpdateUser from '@/features/dashboard/features/user-management/features/create-update-user/CreateUpdateUser'
import UserDetail from '@/features/dashboard/features/user-management/features/user-detail/UserDetail'
import UserList from '@/features/dashboard/features/user-management/features/user-list/UserList'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function UserManagement() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="list" replace />} />
      <Route path="/list" element={<UserList />} />
      <Route path="/create" element={<CreateUpdateUser />} />
      <Route path="/update/:id" element={<CreateUpdateUser />} />
      <Route path="/:idCourse" element={<UserDetail />} />
    </Routes>
  )
}
