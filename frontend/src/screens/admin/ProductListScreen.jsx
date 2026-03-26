import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { Plus, Edit3, Trash2, Package, Layers, X } from 'lucide-react';

const ProductListScreen = () => {
  const { data, isLoading, error, refetch } = useGetProductsQuery({});
  const [createProduct, { isLoading: loadingCreate }] = useCreateProductMutation();
  const [deleteProduct, { isLoading: loadingDelete }] = useDeleteProductMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    brand: '',
    category: '',
    countInStock: 0,
    image: '',
    description: ''
  });

  const createHandler = async (e) => {
    e.preventDefault();
    try {
      await createProduct(newProduct).unwrap();
      refetch();
      toast.success('Product created successfully!');
      setIsModalOpen(false);
      setNewProduct({ name: '', price: 0, brand: '', category: '', countInStock: 0, image: '', description: '' });
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        refetch();
        toast.success('Product deleted');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-brand-dark tracking-tight flex items-center gap-3">
            <Layers size={28} /> Manage Inventory
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={18} /> New Product
          </button>
        </div>

        {/* Modal for adding Information and Description */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition">
                <X size={24} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Package className="text-indigo-500" /> Create New Product
              </h2>
              <form onSubmit={createHandler} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Name</label>
                    <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="input-premium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Price ($)</label>
                    <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} className="input-premium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Brand</label>
                    <input type="text" required value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} className="input-premium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Category</label>
                    <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="input-premium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Stock</label>
                    <input type="number" required value={newProduct.countInStock} onChange={e => setNewProduct({...newProduct, countInStock: Number(e.target.value)})} className="input-premium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-600 mb-1">Image URL</label>
                    <input type="text" placeholder="https://..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} className="input-premium" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Information / Description</label>
                  <textarea rows="3" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="input-premium resize-none" placeholder="Enter product information and description..." />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={loadingCreate} className="btn-primary">
                    {loadingCreate ? 'Creating...' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {(loadingCreate || loadingDelete) && <Loader />}

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
                    <th className="text-left p-4 font-bold">Product</th>
                    <th className="text-left p-4 font-bold">Price</th>
                    <th className="text-left p-4 font-bold">Category</th>
                    <th className="text-left p-4 font-bold">Brand</th>
                    <th className="text-left p-4 font-bold">Stock</th>
                    <th className="text-left p-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.products?.map((product) => (
                    <tr key={product._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg border" />
                          <div>
                            <p className="font-bold text-brand-dark line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400 font-mono">{product._id.slice(-8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-indigo-900 border-l border-white">
                        ${product.price}
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{product.category}</span>
                      </td>
                      <td className="p-4 font-medium text-gray-600">{product.brand}</td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${product.countInStock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {product.countInStock > 0 ? `${product.countInStock} units` : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/admin/product/${product._id}/edit`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                            <Edit3 size={16} />
                          </Link>
                          <button onClick={() => deleteHandler(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={16} />
                          </button>
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

export default ProductListScreen;
