// API base URL from env or use proxy in dev
const apiUrl = import.meta.env.VITE_API_URL || '';
export const BASE_URL = apiUrl; 
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const STRIPE_URL = '/api/config/stripe';
