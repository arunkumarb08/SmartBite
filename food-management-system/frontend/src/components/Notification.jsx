/**
 * Notification.jsx
 * ------------------
 * Simple, reusable success/error alert banner.
 * Controlled entirely by props from the parent page.
 */

import React from 'react'

function Notification({ message, type = 'success', onClose }) {
  if (!message) return null

  return (
    <div
      className={`alert alert-${type === 'success' ? 'success' : 'danger'} alert-dismissible fade show shadow-sm`}
      role="alert"
    >
      {message}
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  )
}

export default Notification
