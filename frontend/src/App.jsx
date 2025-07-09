import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Bookings from './pages/Bookings'
import Transactions from './pages/Transactions'
import Depreciation from './pages/Depreciation'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/depreciation" element={<Depreciation />} />
      </Routes>
    </Layout>
  )
}

export default App 