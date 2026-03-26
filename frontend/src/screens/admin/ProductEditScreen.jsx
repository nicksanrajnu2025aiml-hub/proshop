import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import { ArrowLeft, Save, Package } from 'lucide-react';

const ProductEditScreen = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success('Product updated');
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="red">{error?.data?.message || error.error}</Message>;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/admin/productlist" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-accent transition mb-6">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h1 className="text-2xl font-black text-brand-dark mb-6 flex items-center gap-3">
            <Package size={24} /> Edit Product
          </h1>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Product Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Price ($)</label>
                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Brand</label>
                <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Category</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Count In Stock</label>
                <input type="number" value={countInStock} onChange={(e) => setCountInStock(Number(e.target.value))} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">Image URL</label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium mb-2" />
                <input type="file" onChange={uploadFileHandler} className="w-full p-2 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-primary file:text-brand-dark hover:file:bg-brand-primary cursor-pointer" />
                {loadingUpload && <Loader />}
              </div>
            </div>

            {image && (
              <div className="flex justify-center">
                <img src={image} alt="Preview" className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200" />
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-1">Description</label>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-brand-primary outline-none transition font-medium resize-none" />
            </div>

            <button
              type="submit"
              disabled={loadingUpdate}
              className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} /> {loadingUpdate ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductEditScreen;
