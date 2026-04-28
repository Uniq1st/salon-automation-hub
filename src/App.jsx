import { useState } from 'react'
import SalonAutomationHub from '@components/SalonAutomationHub'
import AdminDashboard from '@components/AdminDashboard'
import PhotoStudio from '@components/PhotoStudio'

const VIEWS = [
  { id: 'hub', label: '✦ Automation Hub' },
  { id: 'photos', label: '📸 Photo Studio' },
  { id: 'admin', label: 'Admin Dashboard' },
]

export default function App() {
  const [view, setView] = useState('hub')

  return (
    <>
      <nav style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        borderBottom: '0.5px solid #e5e7eb',
        background: '#fff', alignItems: 'center',
      }}>
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              padding: '6px 14px', borderRadius: '0.5rem', cursor: 'pointer',
              border: view === v.id ? '1.5px solid #7F77DD' : '1px solid #e5e7eb',
              background: view === v.id ? '#EEEDFE' : 'transparent',
              color: view === v.id ? '#7F77DD' : '#6b7280',
              fontWeight: view === v.id ? 600 : 400, fontSize: 13,
            }}
          >
            {v.label}
          </button>
        ))}
      </nav>

      {view === 'hub' && <SalonAutomationHub />}
      {view === 'photos' && <PhotoStudio />}
      {view === 'admin' && <AdminDashboard />}
    </>
  )
}
