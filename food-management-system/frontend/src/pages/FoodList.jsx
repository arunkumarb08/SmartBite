/**
 * FoodList.jsx
 * -------------
 * Displays all food items in a responsive table, with:
 * - live search
 * - edit / delete actions
 * - success/error notifications
 */

import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getAllFoods, deleteFood } from '../api/foodApi'
import Notification from '../components/Notification'

function FoodList() {
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [notification, setNotification] = useState({ message: '', type: 'success' })
  const [deleteTarget, setDeleteTarget] = useState(null) // food object pending delete confirmation

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    // auto-hide after 3 seconds
    setTimeout(() => setNotification({ message: '', type: 'success' }), 3000)
  }

  const fetchFoods = useCallback(async (search = '') => {
    setLoading(true)
    try {
      const res = await getAllFoods(search)
      setFoods(res.data.data || [])
    } catch (err) {
      showNotification(
        err.response?.data?.message || 'Failed to load food items. Is the backend running?',
        'error'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchFoods()
  }, [fetchFoods])

  // Debounced search: wait 400ms after typing stops before calling API
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFoods(searchTerm)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm, fetchFoods])

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return
    try {
      await deleteFood(deleteTarget.id)
      showNotification(`"${deleteTarget.food_name}" deleted successfully.`, 'success')
      setFoods((prev) => prev.filter((f) => f.id !== deleteTarget.id))
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete item.', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h2 className="fw-bold mb-0">Food List</h2>
        <Link to="/add" className="btn btn-success">
          + Add Food
        </Link>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: '', type: 'success' })}
      />

      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control form-control-lg"
          placeholder="Search by food name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : foods.length === 0 ? (
        <div className="alert alert-info text-center">
          No food items found. Try adding one!
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover align-middle mb-0">
            <thead className="table-success">
              <tr>
                <th>#</th>
                <th>Food Name</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
            {foods.map((food, index) => (
              <tr key={food.id}>
                <td>{index + 1}</td>
                  <td className="fw-semibold">{food.food_name}</td>
                  <td>
                    <span className="badge bg-secondary">{food.category}</span>
                  </td>
                  <td>{Number(food.price).toFixed(2)}</td>
                  <td>{food.quantity}</td>
                  <td className="text-end">
                    <Link
                      to={`/edit/${food.id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setDeleteTarget(food)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal (simple Bootstrap-styled, controlled by state) */}
      {deleteTarget && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setDeleteTarget(null)}
                ></button>
              </div>
              <div className="modal-body">
                Are you sure you want to delete{' '}
                <strong>{deleteTarget.food_name}</strong>? This action cannot be undone.
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteConfirmed}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FoodList
