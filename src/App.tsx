import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ProfilePage } from './pages/ProfilePage'
import { ProgramPage } from './pages/ProgramPage'
import { ProgressPage } from './pages/ProgressPage'
import { WorkoutPage } from './pages/WorkoutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/programme" element={<ProgramPage />} />
          <Route path="/progression" element={<ProgressPage />} />
          <Route path="/profil" element={<ProfilePage />} />
        </Route>
        <Route path="/seance" element={<WorkoutPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
