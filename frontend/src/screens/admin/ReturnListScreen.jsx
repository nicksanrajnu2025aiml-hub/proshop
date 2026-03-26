import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useGetOrdersQuery, useUpdateReturnStatusMutation } from '../../slices/ordersApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { toast } from 'react-toastify';
import { Package, RotateCcw, CheckCircle2, XCircle, Eye, Clock, ClipboardList, ShieldCheck } from 'lucide-react';

const statusChip = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-700',
    received: 'bg-green-100 text-green-800',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
};

const ReturnListScreen = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [updateReturnStatus, { isLoading: loadingUpdate }] = useUpdateReturnStatusMutation();

  const rows = useMemo(() => {
    if (!orders) return [];
    const list = [];
    orders.forEach((order) => {
      (order.returnRequests || []).forEach((req) => {
        list.push({
          orderId: order._id,
          customer: order.user?.name || 'Deleted User',
          requestedAt: req.requestedAt,
          status: req.status,
          reason: req.reason,
          responseNote: req.responseNote,
          returnId: req._id,
          items: order.orderItems.filter((item) => req.itemIds.includes(item.product)),
        });
      });
    });
    return list.sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  }, [orders]);

  const updateStatus = async (orderId, returnId, status, responseNote) => {
    try {
      await updateReturnStatus({ orderId, returnId, status, responseNote }).unwrap();
      toast.success(`Return ${status}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-black text-brand-dark mb-8 tracking-tight flex items-center gap-3">
          <RotateCcw size={28} /> Return Center
        </h1>

        {(isLoading || loadingUpdate) && <Loader />}

        {error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : rows.length === 0 ? (
          <Message variant="blue">No return requests yet.</Message>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
                    <th className="text-left p-4 font-bold">Order</th>
                    <th className="text-left p-4 font-bold">Customer</th>
                    <th className="text-left p-4 font-bold">Requested</th>
                    <th className="text-left p-4 font-bold">Items</th>
                    <th className="text-left p-4 font-bold">Reason</th>
                    <th className="text-left p-4 font-bold">Status</th>
                    <th className="text-left p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.orderId}-${row.returnId}`} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Link to={`/order/${row.orderId}`} className="text-blue-600 font-bold flex items-center gap-1">
                            <Eye size={14} /> {row.orderId.slice(-8)}
                          </Link>
                          <span className="text-[10px] text-gray-400">{row.items.length} item(s)</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-brand-dark">{row.customer}</td>
                      <td className="p-4 text-gray-600 text-xs">
                        {new Date(row.requestedAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                          {row.items.map((item) => (
                            <span key={item.product} className="px-2 py-1 bg-gray-100 rounded-full font-semibold flex items-center gap-1">
                              <Package size={12} /> {item.name} × {item.qty}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-gray-700 text-sm max-w-xs">
                        <div className="flex flex-col gap-1">
                          <span>{row.reason}</span>
                          {row.responseNote && (
                            <span className="text-xs text-gray-500">Note: {row.responseNote}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusChip(row.status)}`}>
                          {row.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {row.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateStatus(row.orderId, row.returnId, 'approved')}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                              >
                                <ClipboardList size={12} /> Approve
                              </button>
                              <button
                                onClick={() => updateStatus(row.orderId, row.returnId, 'rejected')}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                              >
                                <XCircle size={12} /> Reject
                              </button>
                            </>
                          )}
                          {row.status === 'approved' && (
                            <button
                              onClick={() => updateStatus(row.orderId, row.returnId, 'received')}
                              className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-green-50 text-green-700 rounded-full hover:bg-green-100"
                            >
                              <CheckCircle2 size={12} /> Mark Received
                            </button>
                          )}
                          {row.status === 'received' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full">
                              <ShieldCheck size={12} /> Restocked
                            </span>
                          )}
                        </div>
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

export default ReturnListScreen;
