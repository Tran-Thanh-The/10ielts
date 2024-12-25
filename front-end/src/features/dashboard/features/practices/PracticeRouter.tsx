import CreateUpdatePractice from '@/features/dashboard/features/practices/features/CreateUpdatePractice/CreateUpdatePractice'
import PracticeDetail from '@/features/dashboard/features/practices/features/PracticeDetail/PracticeDetail'
import Practices from '@/features/dashboard/features/practices/features/Practices'
import PracticeListSubmition from '@/features/dashboard/features/practices/features/SubmitionPractice/PracticeList/PracticeListSubmition'
import SubmitionDetail from '@/features/dashboard/features/practices/features/SubmitionPractice/SubmitionDetail/SubmitionDetail'
import UserPracticeSubmition from '@/features/dashboard/features/practices/features/SubmitionPractice/UserPracticeSubmition/UserPracticeSubmition'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function PracticeRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="list" replace />} />
      <Route path="/list" element={<Practices />} />
      <Route path="/:idPractice" element={<PracticeDetail />} />
      <Route path="/:idPractice/update" element={<CreateUpdatePractice />} />
      <Route path="/submitions" element={<PracticeListSubmition />} />
      <Route path="/:idPractice/submitions/" element={<UserPracticeSubmition />} />
      <Route path="/:idPractice/submitions/:submitionId" element={<SubmitionDetail />} />
    </Routes>
  )
}
