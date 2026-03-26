import { Link } from 'react-router-dom';
import { useGetOrderDetailsQuery, useRequestReturnMutation, useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '../slices/ordersApiSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Package, Truck, CreditCard, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  const [requestReturn, { isLoading: loadingReturn }] = useRequestReturnMutation();
  const [createRazorpayOrder, { isLoading: loadingRzp }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment, { isLoading: verifyingRzp }] = useVerifyRazorpayPaymentMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const [selectedItems, setSelectedItems] = useState([]);
  const [returnReason, setReturnReason] = useState('');

  const isReturnWindowOpen = useMemo(() => {
    if (!order?.isDelivered || !order?.deliveredAt) return false;
    const days = (Date.now() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24);
    return days <= 10;
  }, [order]);

  const toggleItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const submitReturnRequest = async () => {
    if (!selectedItems.length) {
      toast.error('Select at least one item to return');
      return;
    }
    if (!returnReason.trim()) {
      toast.error('Please provide a reason for the return');
      return;
    }
    try {
      await requestReturn({ orderId, itemIds: selectedItems, reason: returnReason.trim() }).unwrap();
      setSelectedItems([]);
      setReturnReason('');
      toast.success('Return request submitted');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const loadRazorpayScript = () => new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

  const payWithRazorpay = async () => {
    if (!order || order.isPaid) return;
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load Razorpay. Check your connection.');
      return;
    }
    try {
      const { orderId: rzpOrderId, amount, currency, key } = await createRazorpayOrder(order._id).unwrap();
      const options = {
        key,
        amount,
        currency,
        name: 'ProShop Demo',
        description: 'Order payment',
        order_id: rzpOrderId,
        prefill: {
          name: userInfo?.name,
          email: userInfo?.email,
        },
        handler: async function (response) {
          try {
            await verifyRazorpayPayment({
              orderId: order._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();
            toast.success('Payment successful');
            refetch();
          } catch (err) {
            toast.error(err?.data?.message || 'Payment verification failed');
          }
        },
        theme: {
          color: '#0c9',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        toast.error(resp.error?.description || 'Payment failed');
      });
      rzp.open();
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Unable to start payment');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="red">{error?.data?.message || error.error}</Message>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-2xl font-black text-brand-dark mb-6 tracking-tight flex items-center gap-3">
          <Package size={24} /> Order <span className="text-gray-400 font-mono text-lg">#{order._id.slice(-8)}</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Shipping */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <MapPin size={18} /> Shipping
              </h2>
              <p className="text-gray-600 mb-1"><strong>Name:</strong> {order.user.name}</p>
              <p className="text-gray-600 mb-1"><strong>Email:</strong> <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">{order.user.email}</a></p>
              <p className="text-gray-600 mb-4">
                <strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 size={18} /> Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <Truck size={18} /> In Transit — Expected delivery in 2-5 business days
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <CreditCard size={18} /> Payment
              </h2>
              <p className="text-gray-600 mb-4"><strong>Method:</strong> {order.paymentMethod}</p>
              {order.isPaid ? (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 size={18} /> Paid on {new Date(order.paidAt).toLocaleDateString()}
                </div>
              ) : (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 font-bold text-sm">
                  <Clock size={18} /> Payment Pending
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-lg font-bold text-brand-dark mb-4 flex items-center gap-2">
                <Package size={18} /> Order Items
              </h2>
              <div className="space-y-4">
                {order.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                    <div className="flex-grow">
                      <Link to={`/product/${item.product}`} className="font-bold text-brand-dark hover:text-brand-accent transition text-sm">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-sm font-bold text-gray-600">
                      {item.qty} × ₹{item.price} = <span className="text-brand-dark">₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                    {order.isDelivered && (
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                        <input
                          type="checkbox"
                          className="accent-brand-primary"
                          checked={selectedItems.includes(item.product)}
                          onChange={() => toggleItem(item.product)}
                        />
                        Select for return
                      </label>
                    )}
                  </div>
                ))}
              </div>

              {order.isDelivered && (
                <div className="mt-6 p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-bold text-brand-dark flex items-center gap-2">
                      <Package size={16} /> Request a Return
                    </h3>
                    {!isReturnWindowOpen && (
                      <span className="text-xs font-semibold text-red-500">Return window closed</span>
                    )}
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    rows="3"
                    placeholder="Describe the issue, packaging condition, or reason for return"
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    disabled={!isReturnWindowOpen}
                  />
                  <button
                    onClick={submitReturnRequest}
                    disabled={!isReturnWindowOpen || loadingReturn}
                    className="mt-3 inline-flex items-center gap-2 bg-brand-primary text-brand-dark px-4 py-2 rounded-lg font-bold shadow hover:shadow-md disabled:opacity-50"
                  >
                    {loadingReturn ? 'Submitting...' : 'Submit Return Request'}
                  </button>
                </div>
              )}

              {order.returnRequests?.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-bold text-brand-dark mb-3">Return History</h3>
                  <div className="space-y-3">
                    {order.returnRequests.map((req, idx) => {
                      const requestedItems = order.orderItems.filter((item) => req.itemIds.includes(item.product));
                      const statusColor = {
                        pending: 'bg-yellow-100 text-yellow-800',
                        approved: 'bg-green-100 text-green-800',
                        rejected: 'bg-red-100 text-red-700',
                        received: 'bg-blue-100 text-blue-800',
                      }[req.status] || 'bg-gray-100 text-gray-800';

                      return (
                        <div key={idx} className="p-3 rounded-xl border border-gray-200 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
                              {req.status.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(req.requestedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{req.reason}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            {requestedItems.map((item) => (
                              <span key={item.product} className="px-2 py-1 bg-gray-100 rounded-full font-semibold">
                                {item.name}
                              </span>
                            ))}
                          </div>
                          {req.responseNote && (
                            <p className="text-xs text-gray-500 mt-2">Note: {req.responseNote}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-brand-dark mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span className="font-bold">${order.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold">₹{order.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-bold">₹{order.taxPrice}</span>
                </div>
                <div className="flex justify-between border-t pt-4 text-xl font-black text-brand-dark">
                  <span>Total</span>
                  <span>₹{order.totalPrice}</span>
                </div>
              </div>
              {!order.isPaid && (
                <button
                  onClick={payWithRazorpay}
                  disabled={loadingRzp || verifyingRzp}
                  className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all mt-6 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <CreditCard size={18} /> {loadingRzp ? 'Starting...' : verifyingRzp ? 'Verifying...' : 'Pay with Razorpay'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;