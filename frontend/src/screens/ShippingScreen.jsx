import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import { MapPin } from 'lucide-react';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = useMemo(() => {
    const errs = {};
    if (!address || address.trim().length < 10) {
      errs.address = 'Enter a full street address (min 10 characters)';
    }
    if (!city || city.trim().length < 2) {
      errs.city = 'City must be at least 2 characters';
    }
    const postal = postalCode.trim();
    if (!postal || postal.length < 4 || postal.length > 10 || !/^[A-Za-z0-9\-\s]+$/.test(postal)) {
      errs.postalCode = 'Enter a valid postal/ZIP (4-10 letters/numbers)';
    }
    if (!country || country.trim().length < 2) {
      errs.country = 'Country must be at least 2 characters';
    }
    return errs;
  }, [address, city, postalCode, country]);

  const isFormValid = Object.keys(errors).length === 0;

  const markTouched = (field) => setTouched((prev) => ({ ...prev, [field]: true }));

  const submitHandler = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-12 flex justify-center items-start">
      <div className="glass-card w-full max-w-[450px] flex flex-col p-8 sm:p-10">
        
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
             <MapPin size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Delivery Address</h1>
          <p className="text-slate-500 font-medium text-center text-sm">
            Enter your delivery details to continue checkout
          </p>
        </div>

        <form onSubmit={submitHandler} className="flex flex-col flex-1">
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Full address</label>
              <input
                type="text"
                placeholder="123 Example Street, Apt 4B"
                className={`input-premium ${touched.address && errors.address ? 'border-red-500' : ''}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => markTouched('address')}
                required
              />
              {touched.address && errors.address && (
                <p className="text-xs text-red-600 font-semibold">{errors.address}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">City</label>
              <input
                type="text"
                placeholder="New York"
                className={`input-premium ${touched.city && errors.city ? 'border-red-500' : ''}`}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onBlur={() => markTouched('city')}
                required
              />
              {touched.city && errors.city && (
                <p className="text-xs text-red-600 font-semibold">{errors.city}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Postal Code</label>
                <input
                  type="text"
                  placeholder="10001"
                  className={`input-premium ${touched.postalCode && errors.postalCode ? 'border-red-500' : ''}`}
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  onBlur={() => markTouched('postalCode')}
                  required
                />
                {touched.postalCode && errors.postalCode && (
                  <p className="text-xs text-red-600 font-semibold">{errors.postalCode}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Country</label>
                <input
                  type="text"
                  placeholder="United States"
                  className={`input-premium ${touched.country && errors.country ? 'border-red-500' : ''}`}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  onBlur={() => markTouched('country')}
                  required
                />
                {touched.country && errors.country && (
                  <p className="text-xs text-red-600 font-semibold">{errors.country}</p>
                )}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="btn-primary w-full mt-10 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Use this address
          </button>
        </form>
      </div>
    </div>
  );
};
export default ShippingScreen;
