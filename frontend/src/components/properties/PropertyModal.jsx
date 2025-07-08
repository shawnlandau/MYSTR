import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PropertyModal = ({ property, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    property_type: '',
    purchase_price: '',
    current_value: '',
    monthly_rent: '',
    annual_taxes: '',
    annual_insurance: '',
    hoa_fees: ''
  })

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address || '',
        property_type: property.property_type || '',
        purchase_price: property.purchase_price || '',
        current_value: property.current_value || '',
        monthly_rent: property.monthly_rent || '',
        annual_taxes: property.annual_taxes || '',
        annual_insurance: property.annual_insurance || '',
        hoa_fees: property.hoa_fees || ''
      })
    }
  }, [property])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      purchase_price: parseFloat(formData.purchase_price) || 0,
      current_value: parseFloat(formData.current_value) || 0,
      monthly_rent: parseFloat(formData.monthly_rent) || 0,
      annual_taxes: parseFloat(formData.annual_taxes) || 0,
      annual_insurance: parseFloat(formData.annual_insurance) || 0,
      hoa_fees: parseFloat(formData.hoa_fees) || 0
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
              <label className="label">Monthly Rent</label>
              <input
                type="number"
                name="monthly_rent"
                value={formData.monthly_rent}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Annual Taxes</label>
              <input
                type="number"
                name="annual_taxes"
                value={formData.annual_taxes}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Annual Insurance</label>
              <input
                type="number"
                name="annual_insurance"
                value={formData.annual_insurance}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">HOA Fees</label>
              <input
                type="number"
                name="hoa_fees"
                value={formData.hoa_fees}
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