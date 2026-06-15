
import axios from 'axios';

class ApiService {
  /**
   * The constructor sets up the base URL and default configurations.
   * @param {string} baseUrl - The backend API domain.
   */
  constructor(baseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      withCredentials:true
    });

  }

  /**
   * Generic GET request handler
   */
  async get(endpoint,) {
    try {
      const response = await this.client.get(endpoint);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generic POST request handler
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generic PUT request handler
   */
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Generic DELETE request handler
   */
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Centralized error handling
   */
  handleError(error) {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
}

// Export an instance of the class with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL;
export const api = new ApiService(API_BASE_URL);