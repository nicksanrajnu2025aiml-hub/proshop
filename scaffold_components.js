const fs = require('fs');
const path = require('path');

const writeToFile = (filePath, content) => {
  const fullPath = path.resolve(__dirname, 'frontend/src', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// Components
writeToFile('components/Header.jsx', `import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { ShoppingCart, User, LogOut } from 'lucide-react';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-wider">
          ProShop
        </Link>
        <nav className="flex space-x-6 items-center">
          <Link to="/cart" className="flex items-center space-x-1 hover:text-gray-300 transition">
            <ShoppingCart size={20} />
            <span>Cart</span>
            {cartItems.length > 0 && (
              <span className="bg-blue-600 text-xs rounded-full px-2 py-1 ml-1 font-bold">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className="relative group">
              <button className="flex items-center space-x-1 hover:text-gray-300 transition">
                <User size={20} />
                <span>{userInfo.name}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-1 hover:text-gray-300 transition">
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
          {userInfo && userInfo.isAdmin && (
            <div className="relative group ml-4">
              <button className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition">
                <span>Admin</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block z-50">
                <Link to="/admin/productlist" className="block px-4 py-2 hover:bg-gray-100">Products</Link>
                <Link to="/admin/userlist" className="block px-4 py-2 hover:bg-gray-100">Users</Link>
                <Link to="/admin/orderlist" className="block px-4 py-2 hover:bg-gray-100">Orders</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Header;
`);

writeToFile('components/Footer.jsx', `const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p>ProShop &copy; {currentYear}</p>
      </div>
    </footer>
  );
};
export default Footer;
`);

writeToFile('components/Loader.jsx', `import { Loader2 } from 'lucide-react';
const Loader = () => {
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="animate-spin text-blue-600" size={48} />
    </div>
  );
};
export default Loader;
`);

writeToFile('components/Message.jsx', `const Message = ({ variant = 'blue', children }) => {
  const colors = {
    red: 'bg-red-100 text-red-800 border-red-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };
  return (
    <div className={\`p-4 mb-4 border rounded \${colors[variant] || colors.blue}\`}>
      {children}
    </div>
  );
};
export default Message;
`);

writeToFile('components/Product.jsx', `import { Link } from 'react-router-dom';
import Rating from './Rating';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-full">
      <Link to={\`/product/\${product._id}\`}>
        <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <Link to={\`/product/\${product._id}\`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 mb-2 truncate">
          {product.name}
        </Link>
        <div className="mb-4">
          <Rating value={product.rating} text={\`\${product.numReviews} reviews\`} />
        </div>
        <div className="mt-auto">
          <span className="text-xl font-bold text-gray-900">\${product.price}</span>
        </div>
      </div>
    </div>
  );
};
export default Product;
`);

writeToFile('components/Rating.jsx', `import { Star, StarHalf } from 'lucide-react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((index) => {
          if (value >= index) {
            return <Star key={index} fill="currentColor" size={16} />;
          } else if (value >= index - 0.5) {
            return <StarHalf key={index} fill="currentColor" size={16} />;
          } else {
            return <Star key={index} size={16} />;
          }
        })}
      </div>
      {text && <span className="text-sm text-gray-600 ml-2">{text}</span>}
    </div>
  );
};
export default Rating;
`);

// Private and Admin routes
writeToFile('components/PrivateRoute.jsx', `import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
`);

writeToFile('components/AdminRoute.jsx', `import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};
export default AdminRoute;
`);

console.log("React components generated successfully!");
