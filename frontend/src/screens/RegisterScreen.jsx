import { useState, useEffect, useMemo } from 'react';
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
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading, error }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const emailRegex = useMemo(
    () => /^[\w.!#$%&'*+/=?^`{|}~-]+@[\w-]+(\.[\w-]+)+$/,
    []
  );

  const passwordChecks = useMemo(() => {
    const checks = [];
    if (password.length < 8) checks.push('At least 8 characters');
    if (!/[A-Z]/.test(password)) checks.push('One uppercase letter');
    if (!/[a-z]/.test(password)) checks.push('One lowercase letter');
    if (!/[0-9]/.test(password)) checks.push('One number');
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) checks.push('One special character');
    return checks;
  }, [password]);

  const errors = useMemo(() => {
    const errs = {};
    if (!name || name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!emailRegex.test(email)) errs.email = 'Enter a valid email';
    if (passwordChecks.length > 0) errs.password = passwordChecks.join(', ');
    if (confirmPassword !== password) errs.confirmPassword = 'Passwords do not match';
    return errs;
  }, [name, email, passwordChecks, confirmPassword, password, emailRegex]);

  const isFormValid = Object.keys(errors).length === 0;

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  useEffect(() => {
    if (userInfo) navigate(redirect);
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (!isFormValid) {
      setMessage('Please fix the highlighted fields');
      return;
    }
    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Error handled by RTK
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-12 flex justify-center items-start">
      <div className="glass-card w-full max-w-md p-8 sm:p-10">
        <h1 className="text-3xl font-black text-slate-800 mb-6 tracking-tight">Register</h1>
        {message && <Message variant="red">{message}</Message>}
        {error && <Message variant="red">{error?.data?.message || 'Error occurred'}</Message>}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Name</label>
            <input
              type="text"
              className={`input-premium ${touched.name && errors.name ? 'border-red-500' : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => markTouched('name')}
              required
            />
            {touched.name && errors.name && (
              <p className="text-xs text-red-600 font-semibold">{errors.name}</p>
            )}
          </div>
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
          <div>
            <label className="block text-sm font-bold text-slate-700 ml-1 mb-1">Confirm Password</label>
            <input
              type="password"
              className={`input-premium ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={() => markTouched('confirmPassword')}
              required
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <p className="text-xs text-red-600 font-semibold">{errors.confirmPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="btn-primary w-full mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-8 text-center text-sm font-medium text-slate-600">
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition">Login</Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterScreen;
