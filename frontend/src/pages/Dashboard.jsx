import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Calculator,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import api from '../services/api'
import PortfolioOverview from '../components/dashboard/PortfolioOverview'
import CashFlowChart from '../components/dashboard/CashFlowChart'
import PropertyPerformanceChart from '../components/dashboard/PropertyPerformanceChart'
import DepreciationChart from '../components/dashboard/DepreciationChart'

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboardOverview()
      setOverview(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-600">Error loading dashboard: {error}</p>
        <button 
          onClick={loadDashboardData}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!overview) return null

  const { portfolio, monthlyData, cashFlowByProperty, depreciation, currentYear } = overview

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Portfolio overview and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolio.total_portfolio_value)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appreciation</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolio.total_appreciation)}
              </p>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-success-600" />
                <span className="text-success-600">
                  {formatPercentage((portfolio.total_appreciation / portfolio.total_purchase_value) * 100)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Properties</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.total_properties}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calculator className="h-8 w-8 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Depreciation ({currentYear})</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(depreciation.total_depreciation)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cash Flow */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow</h3>
          <CashFlowChart data={monthlyData} />
        </div>

        {/* Property Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
          <PropertyPerformanceChart data={cashFlowByProperty} />
        </div>
      </div>

      {/* Depreciation Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Depreciation Over Time</h3>
        <DepreciationChart />
      </div>

      {/* Portfolio Overview Table */}
      <PortfolioOverview data={cashFlowByProperty} />
    </div>
  )
}

export default Dashboard 