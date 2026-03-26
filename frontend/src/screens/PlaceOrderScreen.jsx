import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { Package, MapPin, CreditCard, Lock, ChevronRight } from 'lucide-react';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-3xl font-black text-brand-dark mb-8 tracking-tight flex items-center gap-2">
          Review your order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="flex gap-4 items-start flex-1">
                <MapPin className="text-brand-accent mt-1 hidden sm:block" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-brand-dark mb-2">Shipping address</h2>
                  <p className="text-gray-600 font-medium">{cart.shippingAddress.address}</p>
                  <p className="text-gray-600 font-medium">
                    {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
                  </p>
                  <p className="text-gray-600 font-medium">{cart.shippingAddress.country}</p>
                </div>
              </div>
              <Link to="/shipping" className="text-blue-600 hover:text-brand-accent font-bold text-sm transition self-start">Change</Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-6 md:items-start justify-between">
              <div className="flex gap-4 items-start flex-1">
                <CreditCard className="text-brand-accent mt-1 hidden sm:block" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-brand-dark mb-2">Payment method</h2>
                  <p className="text-gray-600 font-medium flex items-center gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded font-bold text-sm border border-gray-200">{cart.paymentMethod}</span>
                  </p>
                </div>
              </div>
              <Link to="/payment" className="text-blue-600 hover:text-brand-accent font-bold text-sm transition self-start">Change</Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
              <h2 className="text-lg font-bold text-brand-dark mb-6 flex items-center gap-2">
                <Package className="text-brand-accent" size={24} /> Review items and shipping
              </h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your cart is empty</Message>
              ) : (
                <div className="space-y-6 border-2 border-gray-100 rounded-xl p-4">
                  {cart.cartItems.map((item, index) => (
                    <div key={index} className="flex gap-6 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                      <div className="flex-1">
                        <Link to={`/product/${item.product}`} className="text-brand-dark hover:text-brand-accent font-bold text-lg leading-tight block mb-2 transition">
                          {item.name}
                        </Link>
                        <div className="text-[#B12704] font-bold text-lg mb-2">₹{item.price}</div>
                        <div className="text-gray-600 font-medium bg-gray-50 inline-block px-3 py-1 rounded-full border border-gray-200">
                          Qty: <span className="font-bold text-brand-dark">{item.qty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <button
                type="button"
                className="w-full bg-brand-primary hover:bg-brand-primary text-brand-dark py-3 rounded-full font-black text-sm shadow-xl shadow-brand-primary/50 transition-all disabled:bg-gray-200 disabled:shadow-none mb-4"
                disabled={cart.cartItems.length === 0 || isLoading}
                onClick={placeOrderHandler}
              >
                {isLoading ? 'Processing...' : 'Place your order'}
              </button>
              
              <p className="text-xs text-center text-gray-500 font-medium mb-6 px-4">
                By placing your order, you agree to ProShop's privacy notice and conditions of use.
              </p>

              <h2 className="text-lg font-bold text-brand-dark mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>Items:</span>
                  <span>₹{cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping & handling:</span>
                  <span>₹{cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-200">
                  <span>Estimated tax to be collected:</span>
                  <span>₹{cart.taxPrice}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-[#B12704] pt-2">
                  <span>Order total:</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
              </div>

              {error && <div className="mt-6"><Message variant="red">{error?.data?.message || 'Failed to place order'}</Message></div>}
              
              <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex gap-3 text-xs text-gray-600 font-medium">
                 <Lock size={16} className="text-gray-400 shrink-0 mt-0.5" />
                 <p>Secure connection. Your payment data is encrypted and secure.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrderScreen;
