import { useGetUsersQuery, useDeleteUserMutation } from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Users, Trash2, CheckCircle2, XCircle, Shield } from 'lucide-react';

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success('User deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-black text-brand-dark mb-8 tracking-tight flex items-center gap-3">
          <Users size={28} /> Manage Customers
        </h1>

        {loadingDelete && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="red">{error?.data?.message || error.error}</Message>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-indigo-600 text-white text-xs uppercase tracking-wider">
                    <th className="text-left p-4 font-bold">ID</th>
                    <th className="text-left p-4 font-bold">Name</th>
                    <th className="text-left p-4 font-bold">Email</th>
                    <th className="text-left p-4 font-bold">Admin</th>
                    <th className="text-left p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users?.map((user) => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4 font-mono text-xs text-gray-400">{user._id.slice(-8)}</td>
                      <td className="p-4 font-bold text-brand-dark">{user.name}</td>
                      <td className="p-4">
                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline font-medium">{user.email}</a>
                      </td>
                      <td className="p-4">
                        {user.isAdmin ? (
                          <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-bold">
                            <Shield size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-bold">
                            Customer
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {!user.isAdmin && (
                          <button onClick={() => deleteHandler(user._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
                        )}
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

export default UserListScreen;
