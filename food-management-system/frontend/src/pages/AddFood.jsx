/**
 * AddFood.jsx
 * ------------
 * Form page to create a new food item.
 * Performs basic client-side validation before calling the API.
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFood } from '../api/foodApi'
import Notification from '../components/Notification'

const initialForm = {
  food_name: '',
  category: '',
  price: '',
  quantity: '',
}

function AddFood() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [notification, setNotification] = useState({ message: '', type: 'success' })
  const [submitting, setSubmitting] = useState(false)

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const newErrors = {}
    if (!form.food_name.trim()) newErrors.food_name = 'Food name is required.'
    if (!form.category.trim()) newErrors.category = 'Category is required.'
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0)
      newErrors.price = 'Enter a valid non-negative price.'
    if (form.quantity === '' || isNaN(form.quantity) || Number(form.quantity) < 0)
      newErrors.quantity = 'Enter a valid non-negative quantity.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await createFood({
        food_name: form.food_name.trim(),
        category: form.category.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      })
      showNotification('Food item added successfully!', 'success')
      setTimeout(() => navigate('/foods'), 800)
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to add food item.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <h2 className="fw-bold mb-4">Add New Food</h2>

          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ message: '', type: 'success' })}
          />

          <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0" noValidate>
            <div className="mb-3">
              <label className="form-label">Food Name</label>
              <input
                type="text"
                name="food_name"
                className={`form-control ${errors.food_name ? 'is-invalid' : ''}`}
                value={form.food_name}
                onChange={handleChange}
                placeholder="e.g. Paneer Butter Masala"
              />
              {errors.food_name && <div className="invalid-feedback">{errors.food_name}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Main Course"
              />
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="row">
              <div className="col-6 mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>

              <div className="col-6 mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="0"
                />
                {errors.quantity && <div className="invalid-feedback">{errors.quantity}</div>}
              </div>
            </div>

            <div className="d-flex gap-2 mt-2">
              <button type="submit" className="btn btn-success" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Food'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/foods')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddFood
