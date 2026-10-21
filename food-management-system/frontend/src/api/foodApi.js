/**
 * foodApi.js
 * -----------
 * Centralized Axios configuration and API calls for the Food resource.
 * Keeping all HTTP calls here means components never talk to Axios directly.
 */

import axios from 'axios'

// Base URL of the Flask backend
const BASE_URL = 'http://127.0.0.1:5000'

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Get all food items. Optionally pass a search term to filter
 * by food_name or category on the backend.
 */
export const getAllFoods = (searchTerm = '') => {
  return apiClient.get('/foods', {
    params: searchTerm ? { search: searchTerm } : {},
  })
}

/** Get a single food item by id */
export const getFoodById = (id) => {
  return apiClient.get(`/foods/${id}`)
}

/** Create a new food item */
export const createFood = (foodData) => {
  return apiClient.post('/foods', foodData)
}

/** Update an existing food item */
export const updateFood = (id, foodData) => {
  return apiClient.put(`/foods/${id}`, foodData)
}

/** Delete a food item */
export const deleteFood = (id) => {
  return apiClient.delete(`/foods/${id}`)
}

export default apiClient
