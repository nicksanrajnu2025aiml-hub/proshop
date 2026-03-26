import { Link } from 'react-router-dom';
import { useGetOrdersQuery, useDeliverOrderMutation } from '../../slices/ordersApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Package, Truck, CheckCircle2, Clock, Eye, CreditCard } from 'lucide-react';

const OrderListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        await deliverOrder(id).unwrap();
        refetch();
        toast.success('Order marked as delivered');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-black text-brand-dark mb-8 tracking-tight flex items-center gap-3">
          <Package size={28} /> Shipment Center
        </h1>

        {loadingDeliver && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : orders?.length === 0 ? (
          <Message variant="blue">No orders found</Message>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
                    <th className="text-left p-4 font-bold">Order ID</th>
                    <th className="text-left p-4 font-bold">Customer</th>
                    <th className="text-left p-4 font-bold">Date</th>
                    <th className="text-left p-4 font-bold">Total</th>
                    <th className="text-left p-4 font-bold">Paid</th>
                    <th className="text-left p-4 font-bold">Delivered</th>
                    <th className="text-left p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-xs text-gray-400">{order._id.slice(-8)}</td>
                      <td className="p-4 font-bold text-brand-dark">{order.user?.name || 'Deleted User'}</td>
                      <td className="p-4 font-medium text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 font-bold text-brand-dark">${order.totalPrice}</td>
                      <td className="p-4">
                        {order.isPaid ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                            <CreditCard size={12} /> {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                            <Clock size={12} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {order.isDelivered ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                            <CheckCircle2 size={12} /> {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <button
                            onClick={() => deliverHandler(order._id)}
                            className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 text-xs px-3 py-1.5 rounded-full font-bold hover:bg-yellow-100 transition cursor-pointer"
                          >
                            <Truck size={12} /> Mark Delivered
                          </button>
                        )}
                      </td>
                      <td className="p-4">
                        <Link to={`/order/${order._id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition inline-flex items-center gap-1 text-xs font-bold">
                          <Eye size={14} /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderListScreen;
