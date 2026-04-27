import { useState } from 'react'
import SalonAutomationHub from '@components/SalonAutomationHub'
import AdminDashboard from '@components/AdminDashboard'

export default function App() {
  const [view, setView] = useState('hub')

  return (
    <>
      <nav style={{
        display: 'flex', gap: 8, padding: '10px 16px',
        borderBottom: '0.5px solid #e5e7eb',
        background: '#fff',
      }}>
        <button
          onClick={() => setView('hub')}
          style={{
            padding: '6px 14px', borderRadius: '0.5rem', cursor: 'pointer',
            border: view === 'hub' ? '1.5px solid #7F77DD' : '1px solid #e5e7eb',
            background: view === 'hub' ? '#EEEDFE' : 'transparent',
            color: view === 'hub' ? '#7F77DD' : '#6b7280',
            fontWeight: view === 'hub' ? 600 : 400, fontSize: 13,
          }}
        >
          ✦ Automation Hub
        </button>
        <button
          onClick={() => setView('admin')}
          style={{
            padding: '6px 14px', borderRadius: '0.5rem', cursor: 'pointer',
            border: view === 'admin' ? '1.5px solid #7F77DD' : '1px solid #e5e7eb',
            background: view === 'admin' ? '#EEEDFE' : 'transparent',
            color: view === 'admin' ? '#7F77DD' : '#6b7280',
            fontWeight: view === 'admin' ? 600 : 400, fontSize: 13,
          }}
        >
          Admin Dashboard
        </button>
      </nav>
      {view === 'hub' ? <SalonAutomationHub /> : <AdminDashboard />}
    </>
  )
}
