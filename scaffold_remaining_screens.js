const fs = require('fs');
const path = require('path');

const writeToFile = (filePath, content) => {
  const fullPath = path.resolve(__dirname, 'frontend/src', filePath);
  fs.writeFileSync(fullPath, content);
};

// LoginScreen
writeToFile('screens/LoginScreen.jsx', `import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Error handled by RTK
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Sign In</h1>
      {error && <Message variant="red">{error?.data?.message || 'Invalid credentials'}</Message>}
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <div className="mt-4 text-center">
        New Customer? <Link to={redirect ? \`/register?redirect=\${redirect}\` : '/register'} className="text-blue-600 hover:underline">Register</Link>
      </div>
    </div>
  );
};
export default LoginScreen;
`);

// RegisterScreen
writeToFile('screens/RegisterScreen.jsx', `import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        // Error handled
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      {message && <Message variant="red">{message}</Message>}
      {error && <Message variant="red">{error?.data?.message || 'Error occurred'}</Message>}
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            className="w-full p-2 border rounded mt-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Confirm Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded mt-1"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        Already have an account? <Link to={redirect ? \`/login?redirect=\${redirect}\` : '/login'} className="text-blue-600 hover:underline">Login</Link>
      </div>
    </div>
  );
};
export default RegisterScreen;
`);

// ShippingScreen
writeToFile('screens/ShippingScreen.jsx', `import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">City</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Postal Code</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Country</label>
          <input
            type="text"
            className="w-full p-2 border rounded mt-1"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};
export default ShippingScreen;
`);

// PaymentScreen
writeToFile('screens/PaymentScreen.jsx', `import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h1 className="text-3xl font-bold mb-6">Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-6">
          <label className="block text-xl text-gray-700 mb-2">Select Method</label>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              className="mr-2"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              checked
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="Stripe">Stripe / Credit Card</label>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </form>
    </div>
  );
};
export default PaymentScreen;
`);

// PlaceOrderScreen
writeToFile('screens/PlaceOrderScreen.jsx', `import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';
import Message from '../components/Message';
import Loader from '../components/Loader';

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
      navigate(\`/order/\${res._id}\`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Shipping</h2>
          <p>
            <strong>Address: </strong>
            {cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
          <p>
            <strong>Method: </strong>
            {cart.paymentMethod}
          </p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">Order Items</h2>
          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <ul className="space-y-4">
              {cart.cartItems.map((item, index) => (
                <li key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <Link to={\`/product/\${item.product}\`} className="hover:text-blue-600">{item.name}</Link>
                  </div>
                  <div>
                    {item.qty} x \${item.price} = \${(item.qty * item.price).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div>
        <div className="bg-white p-6 rounded shadow sticky top-4">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Items</span>
              <span>$\${cart.itemsPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>$\${cart.shippingPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>$\${cart.taxPrice}</span>
            </div>
            <div className="flex justify-between border-t pt-4 font-bold text-xl">
              <span>Total</span>
              <span>$\${cart.totalPrice}</span>
            </div>
          </div>

          {error && <div className="mt-4"><Message variant="red">{error?.data?.message || 'Failed to place order'}</Message></div>}

          <button
            type="button"
            className="w-full bg-blue-600 text-white p-3 rounded mt-6 hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={cart.cartItems.length === 0 || isLoading}
            onClick={placeOrderHandler}
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrderScreen;
`);

// Admin dummy shells since too large
writeToFile('screens/admin/ProductListScreen.jsx', `
import Message from '../../components/Message';
const ProductListScreen = () => {
  return <div className="p-4"><h1 className="text-2xl font-bold mb-4">Products (Admin)</h1>
    <Message variant="blue">Advanced feature implementation required</Message>
  </div>;
}; export default ProductListScreen;
`);

writeToFile('screens/admin/UserListScreen.jsx', `
import Message from '../../components/Message';
const UserListScreen = () => {
  return <div className="p-4"><h1 className="text-2xl font-bold mb-4">Users (Admin)</h1>
    <Message variant="blue">Advanced feature implementation required</Message>
  </div>;
}; export default UserListScreen;
`);

writeToFile('screens/admin/OrderListScreen.jsx', `
import Message from '../../components/Message';
const OrderListScreen = () => {
  return <div className="p-4"><h1 className="text-2xl font-bold mb-4">Orders (Admin)</h1>
    <Message variant="blue">Advanced feature implementation required</Message>
  </div>;
}; export default OrderListScreen;
`);

console.log('Remaining screens scaffolding done!');
