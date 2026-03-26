import { useState, useEffect, useMemo } from 'react';
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

  const emailRegex = useMemo(
    () => /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/,
    []
  );

  const errors = useMemo(() => {
    const errs = {};
    if (!emailRegex.test(email)) errs.email = 'Enter a valid email';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  }, [email, password, emailRegex]);

  const isFormValid = Object.keys(errors).length === 0;
  const [touched, setTouched] = useState({});
  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Error handled by RTK
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-12 flex justify-center items-start">
      <div className="glass-card w-full max-w-md p-8 sm:p-10">
        <h1 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Sign In</h1>
        {error && <Message variant="red">{error?.data?.message || 'Invalid credentials'}</Message>}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Email Address</label>
            <input
              type="email"
              className={`input-premium ${touched.email && errors.email ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => markTouched('email')}
              required
            />
            {touched.email && errors.email && (
              <p className="text-xs text-red-600 font-semibold">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Password</label>
            <input
              type="password"
              className={`input-premium ${touched.password && errors.password ? 'border-red-500' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => markTouched('password')}
              required
            />
            {touched.password && errors.password && (
              <p className="text-xs text-red-600 font-semibold">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm font-medium text-slate-600">
          New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition">Register</Link>
        </div>
      </div>
    </div>
  );
};
export default LoginScreen;
