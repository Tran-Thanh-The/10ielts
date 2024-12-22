import { getRoles } from '@/api/api'
import CreateUpdateUser from '@/features/dashboard/features/user-management/features/create-update-user/CreateUpdateUser'
import RoleForm from '@/features/dashboard/features/user-management/features/role-magagement/RoleForm'
import RoleMagagement from '@/features/dashboard/features/user-management/features/role-magagement/RoleMagagement'
import StaffMagagement from '@/features/dashboard/features/user-management/features/staff-management/StaffManagement'
import StudentMagagement from '@/features/dashboard/features/user-management/features/student-magagement/StudentMagagement'
import UserDetail from '@/features/dashboard/features/user-management/features/user-detail/UserDetail'
import UserList from '@/features/dashboard/features/user-management/features/user-list/UserList'
import { setRoles } from '@/stores/slices/appSlice'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function UserManagement() {
  const dispatch = useDispatch();

  useEffect(() => {
    getRoles().then((res) => {
      dispatch(setRoles(res.data.data));
    })
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="list" replace />} />
      <Route path="/list" element={<UserList />} />
      <Route path="/create" element={<CreateUpdateUser />} />
      <Route path="/update/:id" element={<CreateUpdateUser />} />
      <Route path="/:idCourse" element={<UserDetail />} />
      <Route path="/student" element={<StudentMagagement />} />
      <Route path="/staff" element={<StaffMagagement />} />
      <Route path="/role" element={<RoleMagagement />} />
      <Route path="/role/create" element={<RoleForm />} />
      <Route path="/role/update/:id" element={<RoleForm />} />
    </Routes>
  )
}
