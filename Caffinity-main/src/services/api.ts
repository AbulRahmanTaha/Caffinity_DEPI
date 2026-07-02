import axios from 'axios';


export const api = axios.create({
  baseURL: 'https://caffinity-api.vercel.app/api/v1',
});

export interface GetProductsParams {
  category?: string;
  "price[gte]"?: number;
  "price[lte]"?: number;
  "ratingsAverage[gte]"?: number;
  sort?: string;
}

export const productService = {
  /**
   * Fetch all products with optional filtering and sorting
   */
  getProducts: async (params?: GetProductsParams) => {
    const response = await api.get('/products', { params });
    const resData = response.data;

    // Handle direct array response
    if (Array.isArray(resData)) {
      return { status: 'success', data: resData };
    }

    // Handle { data: [...] } wrapped response
    if (resData && Array.isArray(resData.data)) {
      return resData;
    }

    // Handle { data: { products: [...] } } or similar missing arrays
    if (resData && resData.data && Array.isArray(resData.data.products)) {
      return { status: 'success', data: resData.data.products };
    }

    return { status: 'success', data: [] };
  },

  /**
   * Fetch a single product by ID
   */
  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    const resData = response.data;

    // Handle typical wrapped response { data: Product }
    if (resData && resData.data && typeof resData.data === 'object') {
      return resData;
    }

    // Handle direct product object
    return { status: 'success', data: resData };
  }
};

export const authService = {
  /**
   * Login user
   */
  login: async (credentials: any) => {
    const response = await api.post('/users/signin', credentials);
    return response.data;
  },

  /**
   * Signup user
   */
  signup: async (userData: any) => {
    const response = await api.post('/users/signup', userData);
    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.get('/users/logout');
    return response;
  },

  /**
   * Request password reset
   */
  forgetPassword: async (email: string) => {
    const response = await api.post('/users/forgetPassword', { email });
    return response;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, data: { password: string, confirmPassword: string }) => {
    const response = await api.patch(`/users/resetPassword/${token}`, data);
    return response;
  },

  /**
   * Get current user profile
   */
  getMe: async (token: string) => {
    const response = await api.get('/users/getMe', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateMe: async (token: string, data: { firstName: string, lastName: string }) => {
    const response = await api.patch('/users/updateMe', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  /**
   * Delete current user account
   */
  deleteMe: async (token: string) => {
    const response = await api.delete('/users/deleteMe', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response;
  }
};

export const orderService = {
  /**
   * Create checkout session
   */
  checkoutSession: async (token: string, data: { items: { productId: string, quantity: number }[] }) => {
    const response = await api.post('/orders/checkout-session', data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  /**
   * Verify an order using Stripe Checkout Session ID
   */
  verifyOrder: async (token: string, sessionId: string) => {
    const response = await api.get(`/orders/verify/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  /**
   * Get current user's orders
   */
  getMyOrders: async (token: string) => {
    const response = await api.get('/orders/my-orders', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.data;
  }
};

export const reviewService = {
  getAllReviews: async (token: string) => {
    const response = await api.get('/reviews', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  getProductReviews: async (productId: string, token: string) => {
    const response = await api.get(`/products/${productId}/reviews`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  addReview: async (productId: string, token: string, data: { review: string, rating: number }) => {
    const response = await api.post(`/products/${productId}/reviews`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  }
};
