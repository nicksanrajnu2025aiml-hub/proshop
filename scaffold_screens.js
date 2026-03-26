const fs = require('fs');
const path = require('path');

const writeToFile = (filePath, content) => {
  const fullPath = path.resolve(__dirname, 'frontend/src', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// HomeScreen
writeToFile('screens/HomeScreen.jsx', `import { Row, Col } from 'react-bootstrap'; // Will replace with Tailwind grid
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const { data, isLoading, error } = useGetProductsQuery();

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='red'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.products.map((product) => (
            <div key={product._id} className="h-full">
              <Product product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};
export default HomeScreen;
`);

// ProductScreen
writeToFile('screens/ProductScreen.jsx', `import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetProductDetailsQuery } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="red">{error?.data?.message || error.error}</Message>;

  return (
    <>
      <Link className="btn btn-light my-3 text-blue-600 hover:underline" to="/">
        Go Back
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded shadow" />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
          <div className="mb-4">
            <Rating value={product.rating} text={\`\${product.numReviews} reviews\`} />
          </div>
          <p className="text-2xl font-semibold mb-6">Price: \${product.price}</p>
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <div className="bg-gray-100 p-4 rounded shadow mb-6">
            <div className="flex justify-between mb-4">
              <span>Status:</span>
              <span className="font-bold">{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
            </div>

            {product.countInStock > 0 && (
              <div className="flex justify-between items-center mb-4">
                <span>Qty</span>
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-2 border rounded"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button
              className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default ProductScreen;
`);

// CartScreen
writeToFile('screens/CartScreen.jsx', `import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../slices/cartSlice';
import Message from '../components/Message';
import { Trash2 } from 'lucide-react';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/" className="text-blue-600 underline">Go Back</Link>
          </Message>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 bg-white rounded shadow">
                <div className="flex items-center space-x-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <Link to={\`/product/\${item._id}\`} className="hover:text-blue-600 font-semibold w-full max-w-xs truncate">{item.name}</Link>
                </div>
                <div className="font-bold">\${item.price}</div>
                <div>
                  <select
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="p-2 border rounded"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => removeFromCartHandler(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="bg-gray-100 p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-4">
            Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
          </h2>
          <p className="text-xl mb-6">
            $\${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
          </p>
          <button
            type="button"
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:bg-gray-400"
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartScreen;
`);

// Other needed shells (Login, Register, Profile, Shipping, Payment, etc) using string templates
const writeEmptyComponent = (pathName, componentName) => {
  writeToFile(pathName, `const ${componentName} = () => { return <div>${componentName}</div>; };
export default ${componentName};`);
};

['LoginScreen', 'RegisterScreen', 'ProfileScreen', 'ShippingScreen', 'PaymentScreen', 'PlaceOrderScreen', 'OrderScreen'].forEach((name) => {
  writeEmptyComponent(`screens/${name}.jsx`, name);
});

['UserListScreen', 'ProductListScreen', 'OrderListScreen'].forEach((name) => {
  writeEmptyComponent(`screens/admin/${name}.jsx`, name);
});

console.log("React screens scaffolding generated!");
