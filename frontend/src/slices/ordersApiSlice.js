import { apiSlice } from './apiSlice';
import { ORDERS_URL } from './constants';
const PAYMENTS_URL = '/api/payments';

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
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    payOrder: builder.mutation({
    createRazorpayOrder: builder.mutation({
      query: (orderId) => ({
        url: `${PAYMENTS_URL}/razorpay/order`,
        method: 'POST',
        body: { orderId },
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: ({ orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) => ({
        url: `${PAYMENTS_URL}/razorpay/verify`,
        method: 'POST',
        body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature },
      }),
    }),
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: details,
      }),
    }),
    deliverOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
      }),
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5,
    }),
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      providesTags: ['Order'],
      keepUnusedDataFor: 5,
    }),
    requestReturn: builder.mutation({
      query: ({ orderId, itemIds, reason }) => ({
        url: `${ORDERS_URL}/${orderId}/returns`,
        method: 'POST',
        body: { itemIds, reason },
      }),
    }),
    updateReturnStatus: builder.mutation({
      query: ({ orderId, returnId, status, responseNote }) => ({
        url: `${ORDERS_URL}/${orderId}/returns/${returnId}`,
        method: 'PUT',
        body: { status, responseNote },
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
  useRequestReturnMutation,
  useUpdateReturnStatusMutation,
} = ordersApiSlice;
