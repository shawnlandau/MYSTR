import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PropertyModal = ({ property, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    property_type: '',
    purchase_price: '',
    down_payment: '',
    monthly_mortgage: '',
    monthly_taxes: '',
    monthly_insurance: '',
    monthly_hoa_fees: '',
    current_value: '',
    nightly_rate: ''
  })

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address || '',
        property_type: property.property_type || '',
        purchase_price: property.purchase_price || '',
        down_payment: property.down_payment || '',
        monthly_mortgage: property.monthly_mortgage || '',
        monthly_taxes: property.monthly_taxes || '',
        monthly_insurance: property.monthly_insurance || '',
        monthly_hoa_fees: property.monthly_hoa_fees || '',
        current_value: property.current_value || '',
        nightly_rate: property.nightly_rate || ''
      })
    }
  }, [property])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      purchase_price: parseFloat(formData.purchase_price) || 0,
      down_payment: parseFloat(formData.down_payment) || 0,
      monthly_mortgage: parseFloat(formData.monthly_mortgage) || 0,
      monthly_taxes: parseFloat(formData.monthly_taxes) || 0,
      monthly_insurance: parseFloat(formData.monthly_insurance) || 0,
      monthly_hoa_fees: parseFloat(formData.monthly_hoa_fees) || 0,
      current_value: parseFloat(formData.current_value) || 0,
      nightly_rate: parseFloat(formData.nightly_rate) || 0
    }
    
    if (property) {
      onSave(property.id, data)
    } else {
      onSave(data)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {property ? 'Edit Property' : 'Add Property'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Property Type</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Type</option>
              <option value="single_family">Single Family</option>
              <option value="multi_family">Multi Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Purchase Price</label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                className="input"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="label">Down Payment</label>
              <input
                type="number"
                name="down_payment"
                value={formData.down_payment}
                onChange={handleChange}
                className="input"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Monthly Mortgage</label>
              <input
                type="number"
                name="monthly_mortgage"
                value={formData.monthly_mortgage}
                onChange={handleChange}
                className="input"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="label">Current Value</label>
              <input
                type="number"
                name="current_value"
                value={formData.current_value}
                onChange={handleChange}
                className="input"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Monthly Taxes</label>
              <input
                type="number"
                name="monthly_taxes"
                value={formData.monthly_taxes}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Monthly Insurance</label>
              <input
                type="number"
                name="monthly_insurance"
                value={formData.monthly_insurance}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Monthly HOA Fees</label>
              <input
                type="number"
                name="monthly_hoa_fees"
                value={formData.monthly_hoa_fees}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Nightly Rate</label>
              <input
                type="number"
                name="nightly_rate"
                value={formData.nightly_rate}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {property ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyModal 