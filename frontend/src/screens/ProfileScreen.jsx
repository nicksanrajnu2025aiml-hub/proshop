import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { User, Package, ChevronRight, Edit3, Save, Eye } from 'lucide-react';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingProfile }] = useProfileMutation();
  const { data: orders, isLoading: loadingOrders, error: ordersError } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password: password || undefined,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
        setPassword('');
        setConfirmPassword('');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-black text-brand-dark mb-8 tracking-tight flex items-center gap-3">
          <User size={28} /> My Account
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Profile Form */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                <Edit3 size={18} /> Edit Profile
              </h2>
              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep current"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-600 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingProfile}
                  className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {loadingProfile ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-brand-dark mb-6 flex items-center gap-2">
                <Package size={18} /> My Orders
              </h2>
              {loadingOrders ? (
                <Loader />
              ) : ordersError ? (
                <Message variant="red">{ordersError?.data?.message || ordersError.error}</Message>
              ) : orders?.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">No orders yet</h3>
                  <p className="text-gray-400 mb-6">Start shopping to see your orders here!</p>
                  <Link to="/" className="bg-brand-primary text-brand-dark px-6 py-3 rounded-xl font-bold hover:bg-brand-primary transition">
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                        <th className="text-left p-3 font-bold rounded-l-xl">Order ID</th>
                        <th className="text-left p-3 font-bold">Date</th>
                        <th className="text-left p-3 font-bold">Total</th>
                        <th className="text-left p-3 font-bold">Paid</th>
                        <th className="text-left p-3 font-bold">Delivered</th>
                        <th className="text-left p-3 font-bold rounded-r-xl"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                          <td className="p-3 font-mono text-xs text-gray-500">{order._id.slice(-8)}</td>
                          <td className="p-3 font-medium">{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td className="p-3 font-bold">${order.totalPrice}</td>
                          <td className="p-3">
                            {order.isPaid ? (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                                {new Date(order.paidAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">Pending</span>
                            )}
                          </td>
                          <td className="p-3">
                            {order.isDelivered ? (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                                {new Date(order.deliveredAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold">In Transit</span>
                            )}
                          </td>
                          <td className="p-3">
                            <Link to={`/order/${order._id}`} className="text-blue-600 hover:text-brand-accent transition flex items-center gap-1 font-bold text-xs">
                              <Eye size={14} /> Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;