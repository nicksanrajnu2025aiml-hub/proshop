const fs = require('fs');
const path = require('path');

const writeToFile = (filePath, content) => {
  const fullPath = path.resolve(__dirname, 'frontend/src', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// store.js
writeToFile('store.js', `import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import cartSliceReducer from './slices/cartSlice';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
`);

// slices/constants.js
writeToFile('slices/constants.js', `export const BASE_URL = 'http://localhost:5000'; // If using proxy, you can set it to ''
export const PRODUCTS_URL = '/api/products';
export const USERS_URL = '/api/users';
export const ORDERS_URL = '/api/orders';
export const STRIPE_URL = '/api/config/stripe';
`);

// slices/apiSlice.js
writeToFile('slices/apiSlice.js', `import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from './constants';

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
`);

// slices/authSlice.js
writeToFile('slices/authSlice.js', `import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cart');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
`);

// slices/cartSlice.js
writeToFile('slices/cartSlice.js', `import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'Stripe' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state, action) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
`);

// utils/cartUtils.js
writeToFile('utils/cartUtils.js', `export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Items price
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  // Shipping price (If > $100 -> free, else $10)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);
  // Tax price (15%)
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)));
  // Total
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem('cart', JSON.stringify(state));
  return state;
};
`);

// slices/usersApiSlice.js
writeToFile('slices/usersApiSlice.js', `import { apiSlice } from './apiSlice';
import { USERS_URL } from './constants';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: \`\${USERS_URL}/login\`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: \`\${USERS_URL}\`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: \`\${USERS_URL}/logout\`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: \`\${USERS_URL}/profile\`,
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});
export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useProfileMutation } = usersApiSlice;
`);

// slices/productsApiSlice.js
writeToFile('slices/productsApiSlice.js', `import { PRODUCTS_URL } from './constants';
import { apiSlice } from './apiSlice';

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: (productId) => ({
        url: \`\${PRODUCTS_URL}/\${productId}\`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});
export const { useGetProductsQuery, useGetProductDetailsQuery } = productsApiSlice;
`);

// slices/ordersApiSlice.js
writeToFile('slices/ordersApiSlice.js', `import { apiSlice } from './apiSlice';
import { ORDERS_URL, STRIPE_URL } from './constants';

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: order,
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: \`\${ORDERS_URL}/\${orderId}\`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: \`\${ORDERS_URL}/\${orderId}/pay\`,
        method: 'PUT',
        body: details,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: \`\${ORDERS_URL}/myorders\`,
      }),
      keepUnusedDataFor: 5,
    }),
    getStripeClientId: builder.query({
      query: () => ({
        url: STRIPE_URL,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
  useGetStripeClientIdQuery,
} = ordersApiSlice;
`);

console.log("React frontend boilerplate generated successfully!");
